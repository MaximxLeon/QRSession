import { hash } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

// Получение списка студентов
export async function GET() {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Доступ запрещён' }, { status: 403 })
  }

  const students = await prisma.studentProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          login: true,
          isActive: true
        }
      },
      group: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      user: {
        fullName: 'asc'
      }
    }
  })

  return NextResponse.json(students)
}

// Создание студента
export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Доступ запрещён' }, { status: 403 })
  }

  try {
    const body = await request.json()

    const fullName = body.fullName?.trim()
    const login = body.login?.trim()
    const password = body.password
    const groupId = body.groupId
    const studentNumber = body.studentNumber?.trim() || null

    if (!fullName || !login || !password || !groupId) {
      return NextResponse.json(
        { message: 'Заполните обязательные поля' },
        { status: 400 }
      )
    }

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { message: 'Пароль должен содержать минимум 8 символов' },
        { status: 400 }
      )
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId }
    })

    if (!group) {
      return NextResponse.json(
        { message: 'Группа не найдена' },
        { status: 404 }
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

    if (studentNumber) {
      const existingStudent = await prisma.studentProfile.findUnique({
        where: { studentNumber }
      })

      if (existingStudent) {
        return NextResponse.json(
          { message: 'Такой номер студенческого билета уже существует' },
          { status: 409 }
        )
      }
    }

    const passwordHash = await hash(password, 10)

    const student = await prisma.user.create({
      data: {
        fullName,
        login,
        passwordHash,
        role: 'STUDENT',
        studentProfile: {
          create: {
            groupId,
            studentNumber
          }
        }
      },
      include: {
        studentProfile: {
          include: {
            group: true
          }
        }
      }
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Ошибка создания студента:', error)

    return NextResponse.json(
      { message: 'Не удалось создать студента' },
      { status: 500 }
    )
  }
}
