import { createHash, timingSafeEqual } from 'node:crypto'

import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

// Создаём SHA-256 хеш.
function hashValue(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

// Сравниваем хеши безопасным способом.
function compareHashes(first: string, second: string) {
  const firstBuffer = Buffer.from(first, 'hex')
  const secondBuffer = Buffer.from(second, 'hex')

  if (firstBuffer.length !== secondBuffer.length) {
    return false
  }

  return timingSafeEqual(firstBuffer, secondBuffer)
}

export async function POST(request: Request) {
  try {
    // 1. Проверяем авторизацию.
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

    // 2. Получаем данные QR-кода и код подтверждения.
    const body = await request.json()

    const { sessionId, token, confirmationCode } = body

    if (
      typeof sessionId !== 'string' ||
      typeof token !== 'string' ||
      typeof confirmationCode !== 'string' ||
      !/^\d{6}$/.test(confirmationCode)
    ) {
      return NextResponse.json(
        { message: 'Некорректные данные QR-кода или код подтверждения' },
        { status: 400 }
      )
    }

    // 3. Находим профиль студента.
    const student = await prisma.studentProfile.findUnique({
      where: {
        userId: user.id
      }
    })

    if (!student) {
      return NextResponse.json(
        { message: 'Профиль студента не найден' },
        { status: 404 }
      )
    }

    // 4. Находим активную QR-сессию.
    const session = await prisma.attendanceSession.findUnique({
      where: {
        id: sessionId
      },
      include: {
        lesson: {
          include: {
            schedule: {
              select: {
                groupId: true
              }
            }
          }
        }
      }
    })

    if (
      !session ||
      !session.isActive ||
      session.lesson.status !== 'IN_PROGRESS'
    ) {
      return NextResponse.json(
        { message: 'QR-сессия не найдена или уже закрыта' },
        { status: 404 }
      )
    }

    // 5. Проверяем срок действия QR-кода.
    const now = new Date()

    if (session.tokenExpiresAt <= now) {
      return NextResponse.json(
        { message: 'Срок действия QR-кода истёк. Отсканируйте новый код' },
        { status: 410 }
      )
    }

    // 6. Проверяем токен и код подтверждения.
    const tokenIsValid = compareHashes(hashValue(token), session.tokenHash)

    const codeIsValid = compareHashes(
      hashValue(confirmationCode),
      session.confirmationCodeHash
    )

    if (!tokenIsValid || !codeIsValid) {
      return NextResponse.json(
        { message: 'Неверный QR-код или код подтверждения' },
        { status: 400 }
      )
    }

    // 7. Проверяем, что студент относится к группе занятия.
    if (student.groupId !== session.lesson.schedule.groupId) {
      return NextResponse.json(
        { message: 'Это занятие не относится к вашей группе' },
        { status: 403 }
      )
    }

    // 8. Проверяем, не отмечался ли студент ранее.
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        lessonId_studentId: {
          lessonId: session.lessonId,
          studentId: student.id
        }
      }
    })

    if (existingAttendance?.status === 'PRESENT') {
      return NextResponse.json(
        { message: 'Вы уже отметили посещение этого занятия' },
        { status: 409 }
      )
    }

    // 9. Создаём или обновляем посещаемость.
    const attendance = await prisma.attendance.upsert({
      where: {
        lessonId_studentId: {
          lessonId: session.lessonId,
          studentId: student.id
        }
      },
      create: {
        lessonId: session.lessonId,
        studentId: student.id,
        status: 'PRESENT',
        source: 'QR',
        markedAt: now,
        sessionId: session.id
      },
      update: {
        status: 'PRESENT',
        source: 'QR',
        markedAt: now,
        markedById: null,
        sessionId: session.id
      }
    })

    return NextResponse.json({
      message: 'Посещение успешно отмечено!',
      attendance: {
        id: attendance.id,
        status: attendance.status,
        markedAt: attendance.markedAt
      }
    })
  } catch (error) {
    console.error('Ошибка отметки посещаемости:', error)

    return NextResponse.json(
      { message: 'Не удалось отметить посещение' },
      { status: 500 }
    )
  }
}
