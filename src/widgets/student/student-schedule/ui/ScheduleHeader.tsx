type ViewMode = 'day' | 'week'

type ScheduleHeaderProps = {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function ScheduleHeader({
  viewMode,
  onViewModeChange
}: ScheduleHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-heading">Моё расписание</h1>

        <p className="mt-1 text-sm text-text-muted">Занятия вашей группы</p>
      </div>

      <div className="flex rounded-lg border border-border bg-card p-1">
        <button
          type="button"
          onClick={() => onViewModeChange('day')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            viewMode === 'day'
              ? 'bg-primary text-white'
              : 'text-text-muted hover:bg-card-hover'
          }`}
        >
          День
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange('week')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            viewMode === 'week'
              ? 'bg-primary text-white'
              : 'text-text-muted hover:bg-card-hover'
          }`}
        >
          Неделя
        </button>
      </div>
    </div>
  )
}
