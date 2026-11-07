'use client'

type ConfirmationCodeFormProps = {
  confirmationCode: string
  isPending: boolean
  onCodeChange: (value: string) => void
  onSubmit: () => void
  onRescan: () => void
}

export function ConfirmationCodeForm({
  confirmationCode,
  isPending,
  onCodeChange,
  onSubmit,
  onRescan
}: ConfirmationCodeFormProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-success-text">
        QR-код успешно распознан!
      </p>

      <div>
        <label
          htmlFor="confirmation-code"
          className="mb-2 block text-sm font-medium text-heading"
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
            onCodeChange(event.target.value.replace(/\D/g, '').slice(0, 6))
          }
          placeholder="000000"
          className="
            w-full rounded-lg border border-border-input
            bg-input-bg px-4 py-3 text-center text-2xl
            tracking-[0.4em] text-heading outline-none
            focus:border-primary focus:ring-2 focus:ring-focus-ring/20
          "
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={confirmationCode.length !== 6 || isPending}
        className="
          w-full rounded-lg bg-primary px-4 py-3
          font-medium text-primary-foreground
          transition-colors hover:bg-primary-hover
          disabled:cursor-not-allowed disabled:opacity-50
        "
      >
        {isPending ? 'Проверяем...' : 'Подтвердить посещение'}
      </button>

      <button
        type="button"
        onClick={onRescan}
        disabled={isPending}
        className="
          w-full rounded-lg border border-border
          px-4 py-3 text-foreground transition-colors
          hover:bg-muted-bg disabled:opacity-50
        "
      >
        Отсканировать заново
      </button>
    </div>
  )
}
