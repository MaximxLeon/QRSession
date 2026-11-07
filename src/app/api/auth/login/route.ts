import { NextResponse } from 'next/server'

import { login } from '@/server/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { login: userLogin, password } = body

    if (
      typeof userLogin !== 'string' ||
      typeof password !== 'string' ||
      !userLogin.trim() ||
      !password
    ) {
      return NextResponse.json(
        { message: 'Введите логин и пароль' },
        { status: 400 }
      )
    }

    const result = await login(userLogin.trim(), password)

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 401 })
    }

    // Направляем пользователя в раздел согласно его роли
    const routes = {
      STUDENT: '/student',
      TEACHER: '/teacher',
      ADMIN: '/admin'
    }

    return NextResponse.json({
      success: true,
      redirect: routes[result.role as keyof typeof routes]
    })
  } catch (error) {
    console.error('Login error:', error)

    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
