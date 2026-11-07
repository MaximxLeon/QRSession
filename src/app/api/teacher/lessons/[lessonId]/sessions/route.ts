import { createHash, randomBytes, randomInt } from 'node:crypto'

import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

// Хешируем секреты перед сохранением в БД.
function hashValue(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
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

    // Генерируем случайный токен и код подтверждения.
    const token = randomBytes(32).toString('hex')
    const confirmationCode = randomInt(100000, 1000000).toString()

    const now = new Date()
    const tokenExpiresAt = new Date(now.getTime() + 30_000)

    // Создаём сессию в транзакции.
    const result = await prisma.$transaction(async tx => {
      // Проверяем принадлежность занятия преподавателю.
      const lesson = await tx.lesson.findFirst({
        where: {
          id: lessonId,
          schedule: {
            is: {
              teacherId: user.id
            }
          }
        }
      })

      if (!lesson) {
        return { error: 'NOT_FOUND' as const }
      }

      if (lesson.status === 'COMPLETED' || lesson.status === 'CANCELLED') {
        return { error: 'LESSON_CLOSED' as const }
      }

      // Закрываем предыдущие активные QR-сессии этой пары.
      await tx.attendanceSession.updateMany({
        where: {
          lessonId,
          isActive: true
        },
        data: {
          isActive: false,
          closedAt: now
        }
      })

      // Переводим занятие в состояние "идёт".
      await tx.lesson.update({
        where: { id: lessonId },
        data: { status: 'IN_PROGRESS' }
      })

      // Создаём новую QR-сессию.
      const session = await tx.attendanceSession.create({
        data: {
          lessonId,
          createdById: user.id,
          tokenHash: hashValue(token),
          confirmationCodeHash: hashValue(confirmationCode),
          tokenExpiresAt,
          isActive: true
        }
      })

      return { session }
    })

    if ('error' in result) {
      if (result.error === 'NOT_FOUND') {
        return NextResponse.json(
          { message: 'Занятие не найдено' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { message: 'Занятие уже завершено или отменено' },
        { status: 409 }
      )
    }

    // Возвращаем секреты только преподавателю.
    return NextResponse.json(
      {
        sessionId: result.session.id,
        token,
        confirmationCode,
        tokenExpiresAt
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Ошибка запуска QR-сессии:', error)

    return NextResponse.json(
      { message: 'Не удалось запустить QR-сессию' },
      { status: 500 }
    )
  }
}
