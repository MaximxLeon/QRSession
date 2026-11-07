'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Html5Qrcode } from 'html5-qrcode'
import { toast } from 'sonner'

import type { QrData } from './types'

export function useQrScanner(onScan: (data: QrData) => void) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isProcessingRef = useRef(false)
  const isStartingRef = useRef(false)

  const [isScanning, setIsScanning] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current

    if (!scanner) {
      setIsScanning(false)
      return
    }

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
  }, [])

  const startScanner = useCallback(async () => {
    if (isStartingRef.current || scannerRef.current) return

    isStartingRef.current = true
    setIsStarting(true)
    isProcessingRef.current = false

    try {
      const scanner = new Html5Qrcode('attendance-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        async decodedText => {
          if (isProcessingRef.current) return

          isProcessingRef.current = true

          try {
            const parsed: unknown = JSON.parse(decodedText)

            if (
              !parsed ||
              typeof parsed !== 'object' ||
              !('sessionId' in parsed) ||
              !('token' in parsed) ||
              typeof parsed.sessionId !== 'string' ||
              typeof parsed.token !== 'string'
            ) {
              toast.error('Некорректный QR-код')
              isProcessingRef.current = false
              return
            }

            await stopScanner()

            onScan({
              sessionId: parsed.sessionId,
              token: parsed.token
            })
          } catch (error) {
            console.error('Ошибка обработки QR:', error)
            toast.error('Не удалось обработать QR-код')
            isProcessingRef.current = false
          }
        },
        () => {
          // Ошибки распознавания отдельных кадров игнорируем.
        }
      )

      setIsScanning(true)
    } catch (error) {
      console.error('Ошибка запуска камеры:', error)

      toast.error('Не удалось запустить камеру. Проверь разрешения браузера.')

      scannerRef.current = null
      setIsScanning(false)
    } finally {
      isStartingRef.current = false
      setIsStarting(false)
    }
  }, [onScan, stopScanner])

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current

      if (scanner?.isScanning) {
        void scanner.stop().catch(console.error)
      }

      scannerRef.current = null
    }
  }, [])

  return {
    isScanning,
    isStarting,
    startScanner,
    stopScanner
  }
}
