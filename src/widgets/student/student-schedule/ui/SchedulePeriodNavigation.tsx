type SchedulePeriodNavigationProps = {
  selectedDate: string
  onDateChange: (date: string) => void
  onPeriodChange: (direction: number) => void
}

export function SchedulePeriodNavigation({
  selectedDate,
  onDateChange,
  onPeriodChange
}: SchedulePeriodNavigationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPeriodChange(-1)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-card-hover"
          aria-label="Предыдущий период"
        >
          ←
        </button>

        <button
          type="button"
          onClick={() =>
            onDateChange(
              `${new Date().getFullYear()}-${String(
                new Date().getMonth() + 1
              ).padStart(2, '0')}-${String(new Date().getDate()).padStart(
                2,
                '0'
              )}`
            )
          }
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-card-hover"
        >
          Сегодня
        </button>

        <button
          type="button"
          onClick={() => onPeriodChange(1)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-card-hover"
          aria-label="Следующий период"
        >
          →
        </button>
      </div>

      <input
        type="date"
        value={selectedDate}
        onChange={event => {
          if (event.target.value) {
            onDateChange(event.target.value)
          }
        }}
        className="rounded-lg border border-border-input bg-input-bg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
      />
    </div>
  )
}
