import type { Schedule } from '@/entities/schedule'

type ScheduleListProps = {
  schedules: Schedule[]
  isLoading: boolean
  isError: boolean
}

const weekDays = [
  { value: 'MONDAY', label: 'Понедельник' },
  { value: 'TUESDAY', label: 'Вторник' },
  { value: 'WEDNESDAY', label: 'Среда' },
  { value: 'THURSDAY', label: 'Четверг' },
  { value: 'FRIDAY', label: 'Пятница' },
  { value: 'SATURDAY', label: 'Суббота' },
  { value: 'SUNDAY', label: 'Воскресенье' }
]

export function ScheduleList({
  schedules,
  isLoading,
  isError
}: ScheduleListProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-text-muted">Загрузка расписания...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-border bg-danger-bg p-5">
        <p className="text-sm text-danger-text">
          Не удалось загрузить расписание.
        </p>
      </div>
    )
  }

  if (schedules.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-text-muted">Расписание пока пустое.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border-light p-5">
        <h2 className="text-lg font-semibold text-heading">Список занятий</h2>

        <p className="mt-1 text-sm text-text-muted">
          Всего записей: {schedules.length}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted-bg text-text-muted">
            <tr>
              <th className="p-4 font-medium">Группа</th>
              <th className="p-4 font-medium">Предмет</th>
              <th className="p-4 font-medium">Преподаватель</th>
              <th className="p-4 font-medium">День</th>
              <th className="p-4 font-medium">Время</th>
              <th className="p-4 font-medium">Аудитория</th>
              <th className="p-4 font-medium">Период</th>
            </tr>
          </thead>

          <tbody>
            {schedules.map(schedule => {
              const dayLabel =
                weekDays.find(day => day.value === schedule.dayOfWeek)?.label ??
                schedule.dayOfWeek

              return (
                <tr
                  key={schedule.id}
                  className="border-t border-border-light transition hover:bg-card-hover"
                >
                  <td className="p-4 font-medium text-foreground">
                    {schedule.group.name}
                  </td>

                  <td className="p-4 text-foreground">
                    {schedule.subject.name}
                  </td>

                  <td className="p-4 text-foreground">
                    {schedule.teacher.fullName}
                  </td>

                  <td className="p-4 text-foreground">{dayLabel}</td>

                  <td className="whitespace-nowrap p-4 text-foreground">
                    {schedule.startTime}–{schedule.endTime}
                  </td>

                  <td className="p-4 text-foreground">{schedule.classroom}</td>

                  <td className="whitespace-nowrap p-4 text-text-muted">
                    {schedule.validFrom}
                    {' — '}
                    {schedule.validTo ?? 'Без окончания'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
