'use client'

import { useState } from 'react'

import { toast } from 'sonner'

import { useScanAttendance } from '@/features/student/scan-attendance'

import type { QrData } from './types'

export function useAttendanceSubmit() {
  const [qrData, setQrData] = useState<QrData | null>(null)
  const [confirmationCode, setConfirmationCode] = useState('')

  const scanMutation = useScanAttendance()

  function handleScan(data: QrData) {
    setQrData(data)
    setConfirmationCode('')
  }

  function handleSubmit() {
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

  function resetScan() {
    setQrData(null)
    setConfirmationCode('')
  }

  return {
    qrData,
    confirmationCode,
    setConfirmationCode,
    handleScan,
    handleSubmit,
    resetScan,
    isPending: scanMutation.isPending
  }
}
