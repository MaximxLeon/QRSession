import { compare } from 'bcryptjs'
import { createHash, randomBytes } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { prisma } from './prisma'

// Название cookie сессии
const SESSION_COOKIE = 'attendance_session'

// Время жизни сессии — 7 дней
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

// Хешируем токен перед сохранением в БД

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

// Вход пользователя
export async function login(login: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { login }
  })

  if (!user || !user.isActive) {
    return { success: false, message: 'Неверный логин или пароль' }
  }

  const passwordValid = await compare(password, user.passwordHash)

  if (!passwordValid) {
    return { success: false, message: 'Неверный логин или пароль' }
  }

  // Создаём случайный токен сессии
  const token = randomBytes(32).toString('hex')
  const tokenHash = hashToken(token)

  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  await prisma.session.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt
    }
  })

  // Сохраняем токен в защищённой cookie
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt
  })

  return { success: true, role: user.role }
}

// Получение текущего пользователя
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) return null

  const session = await prisma.session.findUnique({
    where: {
      tokenHash: hashToken(token)
    },
    include: {
      user: true
    }
  })

  if (!session || session.expiresAt <= new Date() || !session.user.isActive) {
    return null
  }

  return session.user
}

// Выход пользователя
export async function logout() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (token) {
    await prisma.session.deleteMany({
      where: {
        tokenHash: hashToken(token)
      }
    })
  }

  cookieStore.delete(SESSION_COOKIE)
}

// Проверка роли пользователя
// Проверка роли пользователя
export async function requireRole(roles: string[]) {
  const user = await getCurrentUser()

  // Если пользователь не авторизован
  if (!user) {
    redirect('/login')
  }

  // Если роль не подходит — возвращаем на его главную страницу
  if (!roles.includes(user.role)) {
    redirect(getRoleHome(user.role))
  }

  return user
}

// Проверка авторизации без проверки роли
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return user
}

// Главная страница для каждой роли
function getRoleHome(role: string) {
  switch (role) {
    case 'ADMIN':
      return '/admin'

    case 'TEACHER':
      return '/teacher'

    case 'STUDENT':
      return '/student'

    default:
      return '/login'
  }
}
