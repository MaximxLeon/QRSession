import { NextRequest, NextResponse } from 'next/server'

import { LessonType, WeekDay } from '@/generated/prisma/client'
import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

const weekDays: WeekDay[] = [
  WeekDay.SUNDAY,
  WeekDay.MONDAY,
  WeekDay.TUESDAY,
  WeekDay.WEDNESDAY,
  WeekDay.THURSDAY,
  WeekDay.FRIDAY,
  WeekDay.SATURDAY
]

export async function POST(request: NextRequest) {
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

    const body = await request.json()

    const { scheduleId, date, lessonType } = body

    // Проверяем обязательные поля.
    if (!scheduleId || !date || !lessonType) {
      return NextResponse.json(
        { message: 'Заполните все обязательные поля' },
        { status: 400 }
      )
    }

    // Проверяем формат даты.
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { message: 'Некорректная дата' },
        { status: 400 }
      )
    }

    const selectedDate = new Date(`${date}T00:00:00.000Z`)

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate.toISOString().slice(0, 10) !== date
    ) {
      return NextResponse.json(
        { message: 'Некорректная дата' },
        { status: 400 }
      )
    }

    // Проверяем тип занятия.
    if (!Object.values(LessonType).includes(lessonType as LessonType)) {
      return NextResponse.json(
        { message: 'Некорректный тип занятия' },
        { status: 400 }
      )
    }

    const dayOfWeek = weekDays[selectedDate.getUTCDay()]

    // Проверяем, что расписание принадлежит преподавателю.
    const schedule = await prisma.schedule.findFirst({
      where: {
        id: scheduleId,
        teacherId: user.id,
        isActive: true,
        dayOfWeek,
        validFrom: { lte: selectedDate },
        OR: [{ validTo: null }, { validTo: { gte: selectedDate } }]
      }
    })

    if (!schedule) {
      return NextResponse.json(
        { message: 'Занятие не найдено в вашем расписании' },
        { status: 404 }
      )
    }

    // Проверяем, не создано ли занятие ранее.
    const existingLesson = await prisma.lesson.findUnique({
      where: {
        scheduleId_date: {
          scheduleId,
          date: selectedDate
        }
      }
    })

    if (existingLesson) {
      return NextResponse.json(
        {
          message: 'Занятие на эту дату уже создано',
          lesson: existingLesson
        },
        { status: 409 }
      )
    }

    // Создаём конкретное занятие из расписания.
    const lesson = await prisma.lesson.create({
      data: {
        scheduleId,
        date: selectedDate,

        // Время расписания сохраняем в UTC.
        startsAt: new Date(`${date}T${schedule.startTime}:00.000Z`),
        endsAt: new Date(`${date}T${schedule.endTime}:00.000Z`),

        classroom: schedule.classroom,
        lessonType: lessonType as LessonType,
        status: 'PLANNED'
      },
      include: {
        schedule: {
          include: {
            group: true,
            subject: true
          }
        }
      }
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error('Ошибка создания занятия:', error)

    return NextResponse.json(
      { message: 'Не удалось создать занятие' },
      { status: 500 }
    )
  }
}
