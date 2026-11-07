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
  const [isOpen, setIsOpen] = useState(false)

  const rotatingRef = useRef(false)

  const startMutation = useStartAttendanceSession()
  const { mutateAsync: rotateSession } = useRotateAttendanceSession()

  // Запуск QR-сессии.
  async function handleStart() {
    try {
      const data = await startMutation.mutateAsync(lessonId)

      setSession(data)
      setSecondsLeft(30)
      setIsOpen(true)
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

  // Закрытие модального окна по Escape.
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Данные QR-кода.
  const qrValue = session ? `${session.sessionId}|${session.token}` : ''

  return (
    <>
      {/* Кнопка запуска или повторного открытия QR */}
      {!session ? (
        <div className="mt-4">
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
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="
            mt-4 rounded-lg bg-primary px-4 py-2
            text-sm font-medium text-primary-foreground
            transition-colors hover:bg-primary-hover
          "
        >
          Показать QR-код
        </button>
      )}

      {/* Полноэкранное модальное окно */}
      {isOpen && session && (
        <div
          className="
            fixed inset-0 z-50
            flex min-h-screen items-center justify-center
            overflow-y-auto bg-black/80 p-4
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
        >
          <div
            className="
              relative flex min-h-[90vh] w-full max-w-3xl
              flex-col items-center justify-center
              rounded-2xl bg-card px-5 py-12 text-center
              shadow-2xl sm:px-10
            "
          >
            {/* Кнопка закрытия */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть окно"
              className="
                absolute right-5 top-5
                flex h-10 w-10 items-center justify-center
                rounded-full bg-muted-bg text-foreground
                transition-colors hover:bg-border
              "
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            <h2
              id="qr-modal-title"
              className="text-2xl font-bold text-heading sm:text-3xl"
            >
              QR-код посещаемости
            </h2>

            <p className="mt-3 text-sm text-text-muted sm:text-base">
              Попросите студентов отсканировать QR-код
            </p>

            {/* Большой QR-код */}
            <div className="my-8 flex w-full justify-center">
              <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6">
                <QRCodeSVG
                  value={qrValue}
                  size={400}
                  level="H"
                />
              </div>
            </div>

            {/* Код подтверждения */}
            <p className="text-sm text-text-muted sm:text-base">
              Код подтверждения
            </p>

            <p className="mt-2 text-4xl font-bold tracking-[0.3em] text-heading sm:text-5xl">
              {session.confirmationCode}
            </p>

            {/* Таймер */}
            <div className="mt-8 rounded-xl bg-primary-light px-6 py-4">
              <p className="text-sm text-primary">QR-код обновится через</p>

              <p className="mt-1 text-3xl font-bold tabular-nums text-primary">
                {secondsLeft} сек.
              </p>
            </div>

            <p className="mt-6 max-w-md text-xs text-text-muted sm:text-sm">
              Каждый QR-код действителен ограниченное время. Если код устарел,
              дождитесь автоматического обновления.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
