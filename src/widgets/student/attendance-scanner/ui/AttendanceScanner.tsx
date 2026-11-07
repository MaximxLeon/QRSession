'use client'

import { useAttendanceSubmit, useQrScanner } from '../model'
import { ConfirmationCodeForm } from './ConfirmationCodeForm'
import { ScannerCamera } from './ScannerCamera'

export function AttendanceScanner() {
  const {
    qrData,
    confirmationCode,
    setConfirmationCode,
    handleScan,
    handleSubmit,
    resetScan,
    isPending
  } = useAttendanceSubmit()

  const { isScanning, isStarting, startScanner, stopScanner } =
    useQrScanner(handleScan)

  return (
    <div className="max-w-lg space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-heading">
          Отметка посещаемости
        </h2>

        <p className="mt-1 text-sm text-text-muted">
          Отсканируй QR-код преподавателя и введи код подтверждения.
        </p>
      </div>

      {!qrData ? (
        <ScannerCamera
          isScanning={isScanning}
          isStarting={isStarting}
          onStart={startScanner}
          onStop={stopScanner}
        />
      ) : (
        <ConfirmationCodeForm
          confirmationCode={confirmationCode}
          isPending={isPending}
          onCodeChange={setConfirmationCode}
          onSubmit={handleSubmit}
          onRescan={async () => {
            resetScan()
            await startScanner()
          }}
        />
      )}
    </div>
  )
}
