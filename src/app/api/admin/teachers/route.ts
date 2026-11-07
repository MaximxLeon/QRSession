import { hash } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

export async function GET() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Нет доступа' }, { status: 403 })
  }

  const teachers = await prisma.user.findMany({
    where: {
      role: 'TEACHER',
      isActive: true
    },
    select: {
      id: true,
      fullName: true,
      login: true
    },
    orderBy: {
      fullName: 'asc'
    }
  })

  return NextResponse.json(teachers)
}

// Создание преподавателя
export async function POST(request: NextRequest) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Нет доступа' }, { status: 403 })
  }

  try {
    const body = await request.json()

    const fullName = body.fullName?.trim()
    const login = body.login?.trim()
    const password = body.password

    if (!fullName || !login || !password) {
      return NextResponse.json(
        { message: 'Заполните все обязательные поля' },
        { status: 400 }
      )
    }

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { message: 'Пароль должен содержать минимум 8 символов' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { login }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Такой логин уже занят' },
        { status: 409 }
      )
    }

    const passwordHash = await hash(password, 10)

    const teacher = await prisma.user.create({
      data: {
        fullName,
        login,
        passwordHash,
        role: 'TEACHER'
      },
      select: {
        id: true,
        fullName: true,
        login: true,
        role: true
      }
    })

    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    console.error('Ошибка создания преподавателя:', error)

    return NextResponse.json(
      { message: 'Не удалось создать преподавателя' },
      { status: 500 }
    )
  }
}
