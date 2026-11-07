import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

type RouteContext = {
  params: Promise<{
    lessonId: string
  }>
}

export async function PATCH(_request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { message: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    if (user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Доступ запрещён' }, { status: 403 })
    }

    const { lessonId } = await params

    const result = await prisma.$transaction(async tx => {
      // Проверяем, что занятие принадлежит преподавателю.
      const lesson = await tx.lesson.findFirst({
        where: {
          id: lessonId,
          schedule: {
            teacherId: user.id
          }
        },
        select: {
          id: true,
          status: true
        }
      })

      if (!lesson) {
        return { error: 'NOT_FOUND' as const }
      }

      // Завершать можно только начатое занятие.
      if (lesson.status !== 'IN_PROGRESS') {
        return { error: 'NOT_IN_PROGRESS' as const }
      }

      // Неотмеченные студенты автоматически становятся отсутствующими.
      const attendanceResult = await tx.attendance.updateMany({
        where: {
          lessonId,
          status: 'UNMARKED'
        },
        data: {
          status: 'ABSENT'
        }
      })

      // Завершаем занятие.
      const completedLesson = await tx.lesson.update({
        where: {
          id: lessonId
        },
        data: {
          status: 'COMPLETED'
        },
        select: {
          id: true,
          status: true
        }
      })

      return {
        error: null,
        lesson: completedLesson,
        markedAbsent: attendanceResult.count
      }
    })

    if (result.error === 'NOT_FOUND') {
      return NextResponse.json(
        { message: 'Занятие не найдено' },
        { status: 404 }
      )
    }

    if (result.error === 'NOT_IN_PROGRESS') {
      return NextResponse.json(
        { message: 'Завершить можно только начатое занятие' },
        { status: 409 }
      )
    }

    return NextResponse.json({
      message: 'Занятие успешно завершено',
      lesson: result.lesson,
      markedAbsent: result.markedAbsent
    })
  } catch (error) {
    console.error('Ошибка завершения занятия:', error)

    return NextResponse.json(
      { message: 'Не удалось завершить занятие' },
      { status: 500 }
    )
  }
}
