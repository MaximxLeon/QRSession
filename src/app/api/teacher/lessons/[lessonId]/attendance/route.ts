import { NextRequest, NextResponse } from 'next/server'

import {
  AttendanceSource,
  AttendanceStatus,
  LessonStatus
} from '@/generated/prisma/client'
import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

type RouteContext = {
  params: Promise<{ lessonId: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    // Проверяем авторизацию.
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

    // Получаем данные запроса.
    const body = await request.json()
    const { studentId, present } = body

    if (typeof studentId !== 'string' || typeof present !== 'boolean') {
      return NextResponse.json(
        { message: 'Некорректные данные' },
        { status: 400 }
      )
    }

    // Проверяем, что занятие принадлежит преподавателю.
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        schedule: {
          teacherId: user.id
        }
      },
      include: {
        schedule: {
          select: {
            groupId: true
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json(
        { message: 'Занятие не найдено' },
        { status: 404 }
      )
    }

    if (lesson.status === LessonStatus.CANCELLED) {
      return NextResponse.json(
        { message: 'Нельзя менять посещаемость отменённого занятия' },
        { status: 400 }
      )
    }

    // Проверяем, что студент состоит в группе этого занятия.
    const student = await prisma.studentProfile.findFirst({
      where: {
        id: studentId,
        groupId: lesson.schedule.groupId,
        user: {
          isActive: true
        }
      },
      select: {
        id: true
      }
    })

    if (!student) {
      return NextResponse.json(
        { message: 'Студент не найден в группе этого занятия' },
        { status: 404 }
      )
    }

    // Определяем новый статус.
    const newStatus = present
      ? AttendanceStatus.PRESENT
      : AttendanceStatus.ABSENT

    // Сохраняем посещаемость и историю одним действием.
    const result = await prisma.$transaction(async tx => {
      const existing = await tx.attendance.findUnique({
        where: {
          lessonId_studentId: {
            lessonId,
            studentId
          }
        }
      })

      // Если статус не изменился, новую запись истории не создаём.
      if (
        existing &&
        existing.status === newStatus &&
        existing.source === AttendanceSource.MANUAL
      ) {
        return existing
      }

      const attendance = await tx.attendance.upsert({
        where: {
          lessonId_studentId: {
            lessonId,
            studentId
          }
        },
        create: {
          lessonId,
          studentId,
          status: newStatus,
          source: AttendanceSource.MANUAL,
          markedAt: new Date(),
          markedById: user.id
        },
        update: {
          status: newStatus,
          source: AttendanceSource.MANUAL,
          markedAt: new Date(),
          markedById: user.id,
          sessionId: null
        }
      })

      // Записываем историю изменения.
      await tx.attendanceAudit.create({
        data: {
          attendanceId: attendance.id,
          oldStatus: existing?.status ?? null,
          newStatus,
          oldSource: existing?.source ?? null,
          newSource: AttendanceSource.MANUAL,
          reason: 'Изменено преподавателем вручную',
          changedById: user.id
        }
      })

      return attendance
    })

    return NextResponse.json({
      message: 'Посещаемость обновлена',
      attendance: result
    })
  } catch (error) {
    console.error('Ошибка изменения посещаемости:', error)

    return NextResponse.json(
      { message: 'Не удалось изменить посещаемость' },
      { status: 500 }
    )
  }
}
