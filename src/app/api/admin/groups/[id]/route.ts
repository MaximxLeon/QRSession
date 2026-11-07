import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Нет доступа' }, { status: 403 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { curatorId } = body

    if (curatorId !== null && typeof curatorId !== 'string') {
      return NextResponse.json(
        { message: 'Некорректный ID куратора' },
        { status: 400 }
      )
    }

    const group = await prisma.group.findUnique({
      where: { id }
    })

    if (!group) {
      return NextResponse.json(
        { message: 'Группа не найдена' },
        { status: 404 }
      )
    }

    if (curatorId !== null) {
      const teacher = await prisma.user.findFirst({
        where: {
          id: curatorId,
          role: 'TEACHER',
          isActive: true
        }
      })

      if (!teacher) {
        return NextResponse.json(
          { message: 'Преподаватель не найден' },
          { status: 404 }
        )
      }
    }

    const updatedGroup = await prisma.group.update({
      where: { id },
      data: { curatorId },
      include: {
        curator: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    })

    return NextResponse.json(updatedGroup)
  } catch (error) {
    console.error('Update curator error:', error)

    return NextResponse.json(
      { message: 'Не удалось обновить куратора' },
      { status: 500 }
    )
  }
}

// Удаление учебной группы
export async function DELETE(_request: Request, { params }: RouteContext) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Нет доступа' }, { status: 403 })
  }

  try {
    const { id } = await params

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
            schedules: true
          }
        }
      }
    })

    if (!group) {
      return NextResponse.json(
        { message: 'Группа не найдена' },
        { status: 404 }
      )
    }

    if (group._count.students > 0 || group._count.schedules > 0) {
      return NextResponse.json(
        {
          message:
            'Нельзя удалить группу, в которой есть студенты или расписание'
        },
        { status: 409 }
      )
    }

    await prisma.group.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Группа успешно удалена' })
  } catch (error) {
    console.error('Delete group error:', error)

    return NextResponse.json(
      { message: 'Не удалось удалить группу' },
      { status: 500 }
    )
  }
}
