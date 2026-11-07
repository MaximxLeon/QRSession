import { NextRequest, NextResponse } from 'next/server'

import { WeekDay } from '@/generated/prisma/client'
import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

// Преобразуем номер дня недели в значение Prisma enum.
const weekDays: WeekDay[] = [
  WeekDay.SUNDAY,
  WeekDay.MONDAY,
  WeekDay.TUESDAY,
  WeekDay.WEDNESDAY,
  WeekDay.THURSDAY,
  WeekDay.FRIDAY,
  WeekDay.SATURDAY
]

export async function GET(request: NextRequest) {
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

    // Получаем дату из query-параметра.
    const date = request.nextUrl.searchParams.get('date')

    // Проверяем формат даты.
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { message: 'Укажите дату в формате YYYY-MM-DD' },
        { status: 400 }
      )
    }

    // Проверяем, что дата существует.
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

    const dayOfWeek = weekDays[selectedDate.getUTCDay()]

    // Ищем расписание преподавателя на выбранную дату.
    const schedules = await prisma.schedule.findMany({
      where: {
        teacherId: user.id,
        isActive: true,
        dayOfWeek,
        validFrom: {
          lte: selectedDate
        },
        OR: [{ validTo: null }, { validTo: { gte: selectedDate } }]
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            students: {
              where: {
                user: {
                  isActive: true
                }
              },
              select: {
                id: true,
                studentNumber: true,
                isHead: true,
                user: {
                  select: {
                    fullName: true
                  }
                }
              },
              orderBy: {
                user: {
                  fullName: 'asc'
                }
              }
            }
          }
        },
        subject: {
          select: {
            id: true,
            name: true
          }
        },
        lessons: {
          where: {
            date: selectedDate
          },
          select: {
            id: true,
            status: true,
            lessonType: true,
            attendance: {
              select: {
                studentId: true,
                status: true,
                source: true,
                markedAt: true
              }
            }
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    })

    return NextResponse.json(schedules)
  } catch (error) {
    console.error('Ошибка получения занятий:', error)

    return NextResponse.json(
      { message: 'Не удалось получить занятия' },
      { status: 500 }
    )
  }
}
