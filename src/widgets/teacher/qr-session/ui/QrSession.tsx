'use client'

import { useEffect, useRef, useState } from 'react'

import { QRCodeSVG } from 'qrcode.react'

import type { StartSessionResponse } from '@/entities/teacher-lesson'
import { useRotateAttendanceSession } from '@/features/teacher/rotate-attendance-session'
import { useStartAttendanceSession } from '@/features/teacher/start-attendance-session'

type QrSessionProps = {
  lessonId: string
}

export function QrSession({ lessonId }: QrSessionProps) {
  const [session, setSession] = useState<StartSessionResponse | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(30)

  const rotatingRef = useRef(false)

  const startMutation = useStartAttendanceSession()
  const { mutateAsync: rotateSession } = useRotateAttendanceSession()

  // Запуск QR-сессии.
  async function handleStart() {
    try {
      const data = await startMutation.mutateAsync(lessonId)

      setSession(data)
      setSecondsLeft(30)
    } catch (error) {
      console.error('Ошибка запуска QR-сессии:', error)
    }
  }

  // Автоматическое обновление QR-кода.
  useEffect(() => {
    if (!session) return

    const currentSession = session

    const interval = setInterval(async () => {
      const expiresAt = new Date(currentSession.tokenExpiresAt).getTime()

      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000))

      setSecondsLeft(remaining)

      if (remaining > 0 || rotatingRef.current) return

      rotatingRef.current = true

      try {
        const data = await rotateSession(currentSession.sessionId)

        setSession(previous =>
          previous
            ? {
                ...previous,
                token: data.token,
                confirmationCode: data.confirmationCode,
                tokenExpiresAt: data.tokenExpiresAt
              }
            : previous
        )
      } catch (error) {
        console.error('Ошибка обновления QR:', error)
      } finally {
        rotatingRef.current = false
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [session, rotateSession])

  // Данные QR-кода.
  const qrValue = session
    ? JSON.stringify({
        sessionId: session.sessionId,
        token: session.token
      })
    : ''

  return (
    <div className="mt-4">
      {!session ? (
        <div>
          <button
            type="button"
            onClick={handleStart}
            disabled={startMutation.isPending}
            className="
              rounded-lg bg-primary px-4 py-2
              text-sm font-medium text-primary-foreground
              transition-colors hover:bg-primary-hover
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            {startMutation.isPending ? 'Запуск...' : 'Запустить QR'}
          </button>

          {startMutation.isError && (
            <p className="mt-2 text-sm text-danger-text">
              Не удалось запустить QR-сессию.
            </p>
          )}
        </div>
      ) : (
        <div className="max-w-sm rounded-xl border border-border bg-card p-5 text-center">
          <h3 className="text-lg font-semibold text-heading">
            QR-код посещаемости
          </h3>

          <div className="my-4 flex justify-center">
            <QRCodeSVG
              value={qrValue}
              size={220}
              level="H"
            />
          </div>

          <p className="text-sm text-text-muted">Код подтверждения</p>

          <p className="mt-1 text-3xl font-bold tracking-widest text-heading">
            {session.confirmationCode}
          </p>

          <p className="mt-3 text-sm text-text-muted">
            Обновление через: {secondsLeft} сек.
          </p>
        </div>
      )}
    </div>
  )
}
