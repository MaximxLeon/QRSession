import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

export async function GET() {
  try {
    // Проверяем авторизацию.
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { message: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    // Проверяем роль пользователя.
    if (user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Доступ запрещён' }, { status: 403 })
    }

    // Получаем только расписание текущего преподавателя.
    const schedules = await prisma.schedule.findMany({
      where: {
        teacherId: user.id,
        isActive: true
      },
      include: {
        group: {
          select: {
            id: true,
            name: true
          }
        },
        subject: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
    })

    return NextResponse.json(schedules)
  } catch (error) {
    console.error('Ошибка получения расписания:', error)

    return NextResponse.json(
      { message: 'Не удалось получить расписание' },
      { status: 500 }
    )
  }
}
