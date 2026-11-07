import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

const WEEK_DAYS = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY'
] as const

function formatDate(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getDateTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number)

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    hours,
    minutes
  )
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { message: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    if (user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Доступ запрещён' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)

    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const datePattern = /^\d{4}-\d{2}-\d{2}$/

    if (!from || !to || !datePattern.test(from) || !datePattern.test(to)) {
      return NextResponse.json(
        { message: 'Необходимо указать даты from и to в формате YYYY-MM-DD' },
        { status: 400 }
      )
    }

    const fromDate = new Date(`${from}T00:00:00.000Z`)
    const toDate = new Date(`${to}T00:00:00.000Z`)

    if (
      Number.isNaN(fromDate.getTime()) ||
      Number.isNaN(toDate.getTime()) ||
      fromDate > toDate ||
      formatDate(fromDate) !== from ||
      formatDate(toDate) !== to
    ) {
      return NextResponse.json(
        { message: 'Некорректный диапазон дат' },
        { status: 400 }
      )
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
      select: { groupId: true }
    })

    if (!studentProfile) {
      return NextResponse.json(
        { message: 'Профиль студента не найден' },
        { status: 404 }
      )
    }

    // Получаем шаблоны расписания группы.
    const schedules = await prisma.schedule.findMany({
      where: {
        groupId: studentProfile.groupId,
        isActive: true,
        OR: [{ validFrom: null }, { validFrom: { lte: toDate } }],
        AND: [
          {
            OR: [{ validTo: null }, { validTo: { gte: fromDate } }]
          }
        ]
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
        },
        teacher: {
          select: {
            id: true,
            fullName: true
          }
        },
        lessons: {
          where: {
            date: {
              gte: fromDate,
              lte: toDate
            }
          },
          select: {
            id: true,
            date: true,
            startsAt: true,
            endsAt: true,
            classroom: true,
            lessonType: true,
            status: true
          }
        }
      }
    })

    const result = []

    // Перебираем все даты выбранного периода.
    for (
      const date = new Date(fromDate);
      date <= toDate;
      date.setUTCDate(date.getUTCDate() + 1)
    ) {
      const weekDay = WEEK_DAYS[date.getUTCDay()]
      const dateKey = formatDate(date)

      for (const schedule of schedules) {
        if (schedule.dayOfWeek !== weekDay) {
          continue
        }

        // Проверяем период действия шаблона.
        if (schedule.validFrom && dateKey < formatDate(schedule.validFrom)) {
          continue
        }

        if (schedule.validTo && dateKey > formatDate(schedule.validTo)) {
          continue
        }

        // Проверяем, существует ли уже конкретное занятие.
        const existingLesson = schedule.lessons.find(
          lesson => formatDate(lesson.date) === dateKey
        )

        // Если занятие создано, используем его данные.
        if (existingLesson) {
          result.push({
            ...existingLesson,
            date: dateKey,
            schedule: {
              id: schedule.id,
              group: schedule.group,
              subject: schedule.subject,
              teacher: schedule.teacher
            }
          })

          continue
        }

        // Если Lesson ещё нет, формируем пару из шаблона.
        result.push({
          id: `schedule-${schedule.id}-${dateKey}`,
          scheduleId: schedule.id,
          date: dateKey,
          startsAt: getDateTime(date, schedule.startTime),
          endsAt: getDateTime(date, schedule.endTime),
          classroom: schedule.classroom,
          lessonType: 'LECTURE',
          status: 'PLANNED',
          schedule: {
            id: schedule.id,
            group: schedule.group,
            subject: schedule.subject,
            teacher: schedule.teacher
          }
        })
      }
    }

    // Сортируем пары по времени начала.
    result.sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Ошибка получения расписания студента:', error)

    return NextResponse.json(
      { message: 'Не удалось получить расписание' },
      { status: 500 }
    )
  }
}
