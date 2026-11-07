'use client'

type ScannerCameraProps = {
  isScanning: boolean
  isStarting: boolean
  onStart: () => void
  onStop: () => void
}

export function ScannerCamera({
  isScanning,
  isStarting,
  onStart,
  onStop
}: ScannerCameraProps) {
  return (
    <div className="space-y-4">
      <div
        id="attendance-reader"
        className="min-h-62.5 overflow-hidden rounded-lg bg-muted-bg"
      />

      <button
        type="button"
        onClick={isScanning ? onStop : onStart}
        disabled={isStarting}
        className="
          w-full rounded-lg bg-primary px-4 py-3
          font-medium text-primary-foreground
          transition-colors hover:bg-primary-hover
          disabled:cursor-not-allowed disabled:opacity-50
        "
      >
        {isStarting
          ? 'Запуск камеры...'
          : isScanning
            ? 'Остановить камеру'
            : 'Сканировать QR-код'}
      </button>
    </div>
  )
}
