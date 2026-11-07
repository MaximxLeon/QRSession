'use client'

import { useEffect, useRef, useState } from 'react'

import { Html5Qrcode } from 'html5-qrcode'
import { toast } from 'sonner'

import { useScanAttendance } from '../model'

type QrData = {
  sessionId: string
  token: string
}

export function AttendanceScanner() {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isProcessingRef = useRef(false)

  const [qrData, setQrData] = useState<QrData | null>(null)
  const [confirmationCode, setConfirmationCode] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  const scanMutation = useScanAttendance()

  // Освобождаем камеру при уходе со страницы
  useEffect(() => {
    return () => {
      const scanner = scannerRef.current

      if (scanner?.isScanning) {
        void scanner.stop().catch(console.error)
      }

      scannerRef.current = null
    }
  }, [])

  // Остановка камеры и очистка экземпляра сканера
  async function stopScanner() {
    const scanner = scannerRef.current

    if (scanner) {
      try {
        if (scanner.isScanning) {
          await scanner.stop()
        }
      } catch (error) {
        console.error('Ошибка остановки камеры:', error)
      } finally {
        scannerRef.current = null
        setIsScanning(false)
      }
    } else {
      setIsScanning(false)
    }
  }

  // Запуск камеры
  async function startScanner() {
    if (isStarting || isScanning) return

    setIsStarting(true)
    isProcessingRef.current = false

    try {
      // Удаляем предыдущий экземпляр, если он остался
      if (scannerRef.current) {
        await stopScanner()
      }

      const scanner = new Html5Qrcode('attendance-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        async decodedText => {
          // Не обрабатываем несколько кадров одного QR одновременно
          if (isProcessingRef.current) return

          isProcessingRef.current = true

          try {
            const [sessionId, token] = decodedText.split('|')

            if (!sessionId || !token || decodedText.split('|').length !== 2) {
              toast.error('QR-код имеет неверный формат')
              isProcessingRef.current = false
              return
            }

            const parsed: QrData = {
              sessionId,
              token
            }

            if (
              typeof parsed.sessionId !== 'string' ||
              typeof parsed.token !== 'string'
            ) {
              toast.error('Некорректный QR-код')
              isProcessingRef.current = false
              return
            }

            // Останавливаем камеру перед вводом кода
            await stopScanner()

            setQrData(parsed)
            setConfirmationCode('')
          } catch (error) {
            console.error('Ошибка обработки QR:', error)
            toast.error('Не удалось обработать QR-код')
            isProcessingRef.current = false
          }
        },
        () => {
          // Ошибки распознавания отдельных кадров игнорируем
        }
      )

      setIsScanning(true)
    } catch (error) {
      console.error('Ошибка запуска камеры:', error)
      toast.error('Не удалось запустить камеру. Проверь разрешения браузера.')

      scannerRef.current = null
      setIsScanning(false)
    } finally {
      setIsStarting(false)
    }
  }

  // Отправка отметки посещаемости
  async function handleSubmit() {
    if (!qrData || !/^\d{6}$/.test(confirmationCode)) {
      toast.error('Введи шестизначный код подтверждения')
      return
    }

    scanMutation.mutate(
      {
        sessionId: qrData.sessionId,
        token: qrData.token,
        confirmationCode
      },
      {
        onSuccess: result => {
          toast.success(result.message)

          setQrData(null)
          setConfirmationCode('')
          isProcessingRef.current = false
        },
        onError: (error: unknown) => {
          const message =
            error && typeof error === 'object' && 'response' in error
              ? (
                  error as {
                    response?: {
                      data?: { message?: string }
                    }
                  }
                ).response?.data?.message
              : undefined

          toast.error(message || 'Не удалось отметить посещение')
        }
      }
    )
  }

  // Повторное сканирование
  function handleRescan() {
    setQrData(null)
    setConfirmationCode('')
    isProcessingRef.current = false

    // Запускаем камеру после обновления интерфейса
    setTimeout(() => {
      void startScanner()
    }, 100)
  }

  return (
    <div className="max-w-lg space-y-5 rounded-xl border bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">Отметка посещаемости</h2>
        <p className="mt-1 text-sm text-gray-500">
          Отсканируй QR-код преподавателя и введи код подтверждения.
        </p>
      </div>

      <div
        id="attendance-reader"
        className="min-h-62.5 overflow-hidden rounded-lg"
      />

      {!qrData && (
        <button
          type="button"
          onClick={isScanning ? stopScanner : startScanner}
          disabled={isStarting}
          className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isStarting
            ? 'Запуск камеры...'
            : isScanning
              ? 'Остановить камеру'
              : 'Сканировать QR-код'}
        </button>
      )}

      {qrData && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-green-700">
            QR-код успешно распознан!
          </p>

          <div>
            <label
              htmlFor="confirmation-code"
              className="mb-2 block text-sm font-medium"
            >
              Код подтверждения
            </label>

            <input
              id="confirmation-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={confirmationCode}
              onChange={event =>
                setConfirmationCode(
                  event.target.value.replace(/\D/g, '').slice(0, 6)
                )
              }
              placeholder="000000"
              className="w-full rounded-lg border px-4 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={confirmationCode.length !== 6 || scanMutation.isPending}
            className="w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {scanMutation.isPending ? 'Проверяем...' : 'Подтвердить посещение'}
          </button>

          <button
            type="button"
            onClick={handleRescan}
            disabled={scanMutation.isPending}
            className="w-full rounded-lg border px-4 py-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Отсканировать заново
          </button>
        </div>
      )}
    </div>
  )
}
