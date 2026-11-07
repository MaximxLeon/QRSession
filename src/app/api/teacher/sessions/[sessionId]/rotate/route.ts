import { createHash, randomBytes, randomInt } from 'node:crypto'

import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/server/auth'
import { prisma } from '@/server/prisma'

// Создаём SHA-256 хеш.
function hashValue(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
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

    const { sessionId } = await params

    // Генерируем новый токен и код.
    const token = randomBytes(16).toString('hex')
    const confirmationCode = randomInt(100000, 1000000).toString()

    const now = new Date()
    const tokenExpiresAt = new Date(now.getTime() + 30_000)

    const result = await prisma.$transaction(async tx => {
      // Проверяем принадлежность сессии преподавателю.
      // const session = await tx.attendanceSession.findFirst({
      //   where: {
      //     id: sessionId,
      //     createdById: user.id,
      //     isActive: true,
      //     lesson: {
      //       is: {
      //         status: 'IN_PROGRESS'
      //       }
      //     }
      //   }
      // })

      const session = await tx.attendanceSession.findUnique({
        where: {
          id: sessionId
        },
        include: {
          lesson: {
            select: {
              id: true,
              status: true
            }
          }
        }
      })

      // console.log('QR ROTATION DEBUG:', {
      //   requestedSessionId: sessionId,
      //   found: Boolean(session),
      //   sessionCreatorId: session?.createdById,
      //   currentTeacherId: user.id,
      //   isActive: session?.isActive,
      //   lessonStatus: session?.lesson.status,
      //   tokenExpiresAt: session?.tokenExpiresAt,
      //   now
      // })

      if (
        !session ||
        session.createdById !== user.id ||
        !session.isActive ||
        session.lesson.status !== 'IN_PROGRESS'
      ) {
        return { error: 'NOT_FOUND' as const }
      }

      if (!session) {
        return { error: 'NOT_FOUND' as const }
      }

      // Не разрешаем обновлять токен раньше времени.
      if (session.tokenExpiresAt > now) {
        return {
          error: 'NOT_EXPIRED' as const,
          expiresAt: session.tokenExpiresAt
        }
      }

      // Сохраняем новые хеши и срок действия.
      const updated = await tx.attendanceSession.updateMany({
        where: {
          id: sessionId,
          isActive: true,
          tokenExpiresAt: {
            lte: now
          }
        },
        data: {
          tokenHash: hashValue(token),
          confirmationCodeHash: hashValue(confirmationCode),
          tokenExpiresAt
        }
      })

      if (updated.count !== 1) {
        return { error: 'CONFLICT' as const }
      }

      return { success: true as const }
    })

    if ('error' in result) {
      if (result.error === 'NOT_FOUND') {
        return NextResponse.json(
          { message: 'Активная QR-сессия не найдена' },
          { status: 404 }
        )
      }

      if (result.error === 'NOT_EXPIRED') {
        return NextResponse.json(
          {
            message: 'Текущий QR-код ещё действителен',
            expiresAt: result.expiresAt
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { message: 'QR-код уже был обновлён' },
        { status: 409 }
      )
    }

    return NextResponse.json({
      token,
      confirmationCode,
      tokenExpiresAt
    })
  } catch (error) {
    console.error('Ошибка обновления QR:', error)

    return NextResponse.json(
      { message: 'Не удалось обновить QR-код' },
      { status: 500 }
    )
  }
}
