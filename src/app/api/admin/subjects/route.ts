import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

// Получение списка предметов
export async function GET() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Нет доступа' }, { status: 403 })
  }

  const subjects = await prisma.subject.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  return NextResponse.json(subjects)
}

// Создание предмета
export async function POST(request: NextRequest) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Нет доступа' }, { status: 403 })
  }

  try {
    const body = await request.json()

    const name = body.name?.trim()
    const code = body.code?.trim() || null

    if (!name) {
      return NextResponse.json(
        { message: 'Укажите название предмета' },
        { status: 400 }
      )
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        code
      }
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    console.error('Ошибка создания предмета:', error)

    return NextResponse.json(
      {
        message:
          'Не удалось создать предмет. Возможно, такое название или код уже существуют.'
      },
      { status: 500 }
    )
  }
}
