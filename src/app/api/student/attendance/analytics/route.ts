import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

type Counts = {
  total: number
  present: number
  attended: number
  absent: number
  late: number
  excused: number
}

const createCounts = (): Counts => ({
  total: 0,
  present: 0,
  attended: 0,
  absent: 0,
  late: 0,
  excused: 0
})

const datePattern = /^\d{4}-\d{2}-\d{2}$/

const weekdayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

function isValidDate(value: string) {
  if (!datePattern.test(value)) return false

  const date = new Date(`${value}T00:00:00.000Z`)

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  )
}

function addAttendance(counts: Counts, status: string | undefined) {
  counts.total++

  switch (status) {
    case 'PRESENT':
      counts.present++
      counts.attended++
      break

    case 'LATE':
      counts.late++
      counts.attended++
      break

    case 'EXCUSED':
      counts.excused++
      break

    case 'ABSENT':
    case 'UNMARKED':
    default:
      counts.absent++
      break
  }
}

function formatCounts(counts: Counts) {
  return {
    ...counts,
    rate:
      counts.total > 0
        ? Math.round((counts.attended / counts.total) * 1000) / 10
        : 0
  }
}

export async function GET(request: NextRequest) {
  try {
    // Проверяем авторизацию.
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { message: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    // Проверяем роль.
    if (user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Доступ запрещён' }, { status: 403 })
    }

    // Получаем необязательный диапазон дат.
    const { searchParams } = new URL(request.url)

    const from = searchParams.get('from')
    const to = searchParams.get('to')

    if ((from && !to) || (!from && to)) {
      return NextResponse.json(
        { message: 'Необходимо указать обе даты: from и to' },
        { status: 400 }
      )
    }

    if (from && to) {
      if (!isValidDate(from) || !isValidDate(to) || from > to) {
        return NextResponse.json(
          { message: 'Некорректный диапазон дат' },
          { status: 400 }
        )
      }
    }

    // Находим профиль студента.
    const studentProfile = await prisma.studentProfile.findUnique({
      where: {
        userId: user.id
      },
      select: {
        id: true,
        groupId: true
      }
    })

    if (!studentProfile) {
      return NextResponse.json(
        { message: 'Профиль студента не найден' },
        { status: 404 }
      )
    }

    // Формируем фильтр по датам.
    const dateFilter =
      from && to
        ? {
            gte: new Date(`${from}T00:00:00.000Z`),
            lt: new Date(
              new Date(`${to}T00:00:00.000Z`).getTime() + 24 * 60 * 60 * 1000
            )
          }
        : undefined

    // Получаем только проведённые занятия группы.
    const lessons = await prisma.lesson.findMany({
      where: {
        status: 'COMPLETED',
        ...(dateFilter && {
          date: dateFilter
        }),
        schedule: {
          groupId: studentProfile.groupId
        }
      },
      select: {
        date: true,
        schedule: {
          select: {
            startTime: true,
            subject: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        attendance: {
          where: {
            studentId: studentProfile.id
          },
          select: {
            status: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Общая статистика.
    const summary = createCounts()

    // Статистика по предметам.
    const subjectMap = new Map<
      string,
      Counts & { subjectId: string; subjectName: string }
    >()

    // Статистика по месяцам.
    const periodMap = new Map<string, Counts>()

    // Статистика по дням недели.
    const weekdayMap = new Map<number, Counts>()

    // Статистика по времени начала занятий.
    const timeMap = new Map<string, Counts>()

    // Создаём пустую статистику для всех дней недели.
    for (let day = 0; day < 7; day++) {
      weekdayMap.set(day, createCounts())
    }

    for (const lesson of lessons) {
      // Если отметки нет или остался UNMARKED,
      // считаем студента отсутствовавшим.
      const status = lesson.attendance[0]?.status

      addAttendance(summary, status)

      // Статистика по предметам.
      const subject = lesson.schedule.subject

      if (!subjectMap.has(subject.id)) {
        subjectMap.set(subject.id, {
          subjectId: subject.id,
          subjectName: subject.name,
          ...createCounts()
        })
      }

      addAttendance(subjectMap.get(subject.id)!, status)

      // Статистика по месяцам.
      const year = lesson.date.getUTCFullYear()
      const month = String(lesson.date.getUTCMonth() + 1).padStart(2, '0')
      const periodKey = `${year}-${month}`

      if (!periodMap.has(periodKey)) {
        periodMap.set(periodKey, createCounts())
      }

      addAttendance(periodMap.get(periodKey)!, status)

      // Статистика по дням недели.
      const weekday = lesson.date.getUTCDay()

      addAttendance(weekdayMap.get(weekday)!, status)

      // Статистика по времени начала занятий.
      const time = lesson.schedule.startTime

      if (!timeMap.has(time)) {
        timeMap.set(time, createCounts())
      }

      addAttendance(timeMap.get(time)!, status)
    }

    // Подготавливаем данные для графиков.
    const bySubject = Array.from(subjectMap.values())
      .map(item => ({
        ...item,
        ...formatCounts(item)
      }))
      .sort((a, b) => a.rate - b.rate)

    const byPeriod = Array.from(periodMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, counts]) => ({
        period,
        ...formatCounts(counts)
      }))

    const byWeekday = Array.from(weekdayMap.entries())
      .sort(([a], [b]) => {
        // Понедельник должен быть первым.
        const orderA = a === 0 ? 7 : a
        const orderB = b === 0 ? 7 : b

        return orderA - orderB
      })
      .map(([day, counts]) => ({
        day: weekdayNames[day],
        ...formatCounts(counts)
      }))

    const byTime = Array.from(timeMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, counts]) => ({
        time,
        ...formatCounts(counts)
      }))

    return NextResponse.json({
      summary: {
        totalLessons: summary.total,
        present: summary.present,
        attended: summary.attended,
        absent: summary.absent,
        late: summary.late,
        excused: summary.excused,
        attendanceRate:
          summary.total > 0
            ? Math.round((summary.attended / summary.total) * 1000) / 10
            : 0
      },
      bySubject,
      byPeriod,
      byWeekday,
      byTime
    })
  } catch (error) {
    console.error('Ошибка получения аналитики посещаемости:', error)

    return NextResponse.json(
      { message: 'Не удалось получить аналитику посещаемости' },
      { status: 500 }
    )
  }
}
