import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

// Получение списка групп
export async function GET() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Нет доступа' }, { status: 403 })
  }

  const groups = await prisma.group.findMany({
    include: {
      curator: {
        select: {
          id: true,
          fullName: true
        }
      },
      _count: {
        select: {
          students: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  return NextResponse.json(groups)
}

// Создание группы
export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Нет доступа' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const name = body.name?.trim()

    if (!name) {
      return NextResponse.json(
        { message: 'Укажите название группы' },
        { status: 400 }
      )
    }

    const group = await prisma.group.create({
      data: {
        name
      }
    })

    return NextResponse.json(group, { status: 201 })
  } catch {
    return NextResponse.json(
      { message: 'Не удалось создать группу. Возможно, она уже существует.' },
      { status: 400 }
    )
  }
}
