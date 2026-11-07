import type { AttendanceSummary as AttendanceSummaryType } from '@/entities/student-attendance'

type Props = {
  summary: AttendanceSummaryType
}

export function AttendanceSummary({ summary }: Props) {
  const cards = [
    {
      label: 'Всего пар',
      value: summary.totalLessons,
      description: 'Проведено занятий',
      color: 'text-heading',
      bg: 'bg-muted-bg'
    },
    {
      label: 'Посещено',
      value: summary.attended,
      description: 'Включая опоздания',
      color: 'text-success-text',
      bg: 'bg-success-bg'
    },
    {
      label: 'Пропущено',
      value: summary.absent,
      description: 'Отсутствие',
      color: 'text-danger-text',
      bg: 'bg-danger-bg'
    },
    {
      label: 'Опоздания',
      value: summary.late,
      description: 'С опозданием',
      color: 'text-warning',
      bg: 'bg-warning-bg'
    }
  ]

  const rate = Math.min(100, Math.max(0, summary.attendanceRate))

  return (
    <section className="space-y-4">
      {/* Общий процент */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-sm font-medium text-text-muted">
              Общая посещаемость
            </p>

            <p className="mt-2 text-4xl font-bold tracking-tight text-heading sm:text-5xl">
              {summary.attendanceRate}%
            </p>

            <p className="mt-2 text-sm text-text-muted">
              Посещено {summary.attended} из {summary.totalLessons} занятий
            </p>
          </div>

          <div className="flex h-24 w-24 items-center justify-center rounded-full border-[7px] border-primary-light sm:h-28 sm:w-28">
            <span className="text-2xl font-bold text-primary">
              {summary.attendanceRate}%
            </span>
          </div>
        </div>

        <div className="relative z-10 mt-6 h-3 overflow-hidden rounded-full bg-muted-bg">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${rate}%` }}
          />
        </div>

        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-primary-light opacity-40 blur-3xl" />
      </div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map(card => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`inline-flex rounded-xl p-2.5 ${card.bg}`}>
              <span className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </span>
            </div>

            <p className="mt-3 font-semibold text-heading">{card.label}</p>

            <p className="mt-1 text-xs text-text-muted">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
