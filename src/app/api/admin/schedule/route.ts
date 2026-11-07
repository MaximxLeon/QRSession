import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

// Получение расписания
export async function GET() {
  try {
    const user = await getCurrentUser()

    // Проверяем права администратора
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Нет доступа' }, { status: 403 })
    }

    const schedules = await prisma.schedule.findMany({
      include: {
        group: {
          select: { id: true, name: true }
        },
        subject: {
          select: { id: true, name: true }
        },
        teacher: {
          select: { id: true, fullName: true }
        }
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
    })

    return NextResponse.json(schedules)
  } catch (error) {
    console.error('GET /api/admin/schedule:', error)

    return NextResponse.json(
      { message: 'Не удалось получить расписание' },
      { status: 500 }
    )
  }
}

// Создание записи расписания
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    // Проверяем права администратора
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Нет доступа' }, { status: 403 })
    }

    const body = await request.json()

    const {
      groupId,
      subjectId,
      teacherId,
      dayOfWeek,
      startTime,
      endTime,
      classroom,
      validFrom,
      validTo
    } = body

    // Проверяем обязательные поля
    if (
      !groupId ||
      !subjectId ||
      !teacherId ||
      !dayOfWeek ||
      !startTime ||
      !endTime ||
      !classroom ||
      !validFrom
    ) {
      return NextResponse.json(
        { message: 'Заполните все обязательные поля' },
        { status: 400 }
      )
    }

    // Проверяем существование группы, предмета и преподавателя
    const [group, subject, teacher] = await Promise.all([
      prisma.group.findUnique({ where: { id: groupId } }),
      prisma.subject.findUnique({ where: { id: subjectId } }),
      prisma.user.findFirst({
        where: {
          id: teacherId,
          role: 'TEACHER',
          isActive: true
        }
      })
    ])

    if (!group || !subject || !teacher) {
      return NextResponse.json(
        { message: 'Группа, предмет или преподаватель не найдены' },
        { status: 404 }
      )
    }

    // Проверяем формат времени
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/

    if (
      !timePattern.test(startTime) ||
      !timePattern.test(endTime) ||
      startTime >= endTime
    ) {
      return NextResponse.json(
        { message: 'Проверьте время начала и окончания занятия' },
        { status: 400 }
      )
    }

    // Проверяем дату начала и окончания действия расписания
    const from = new Date(validFrom)
    const to = validTo ? new Date(validTo) : null

    if (
      Number.isNaN(from.getTime()) ||
      (to && (Number.isNaN(to.getTime()) || to < from))
    ) {
      return NextResponse.json(
        { message: 'Некорректный период действия расписания' },
        { status: 400 }
      )
    }

    // Создаём запись расписания
    const schedule = await prisma.schedule.create({
      data: {
        groupId,
        subjectId,
        teacherId,
        dayOfWeek,
        startTime,
        endTime,
        classroom,
        validFrom: from,
        validTo: to
      },
      include: {
        group: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
        teacher: { select: { id: true, fullName: true } }
      }
    })

    return NextResponse.json(schedule, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/schedule:', error)

    return NextResponse.json(
      { message: 'Не удалось создать запись расписания' },
      { status: 500 }
    )
  }
}
