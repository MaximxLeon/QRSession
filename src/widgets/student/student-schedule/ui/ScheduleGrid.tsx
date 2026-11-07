import type { StudentLesson } from '@/entities/student-schedule'

import { getDayLabel } from '../model/schedule-utils'
import { ScheduleDayColumn } from './ScheduleDayColumn'
import { ScheduleTimeColumn } from './ScheduleTimeColumn'

type ScheduleGridProps = {
  dates: Date[]
  lessons: StudentLesson[]
  viewMode: 'day' | 'week'
}

export function ScheduleGrid({ dates, lessons, viewMode }: ScheduleGridProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <div
        className="min-w-full"
        style={{
          minWidth: viewMode === 'week' ? '1100px' : '400px'
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `64px repeat(${dates.length}, minmax(0, 1fr))`
          }}
        >
          {/* Заголовки дней */}
          <div className="border-b border-border bg-card p-3" />

          {dates.map(date => {
            const dateKey = [
              date.getFullYear(),
              String(date.getMonth() + 1).padStart(2, '0'),
              String(date.getDate()).padStart(2, '0')
            ].join('-')

            const dateLessons = lessons.filter(
              lesson => lesson.date.slice(0, 10) === dateKey
            )

            return (
              <div
                key={dateKey}
                className="border-b border-l border-border bg-card p-3 text-center"
              >
                <p className="text-sm font-semibold text-heading">
                  {getDayLabel(date)}
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  {date.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  {dateLessons.length} занятий
                </p>
              </div>
            )
          })}

          {/* Номера пар */}
          <ScheduleTimeColumn />

          {/* Колонки занятий */}
          {dates.map(date => (
            <ScheduleDayColumn
              key={date.toISOString()}
              date={date}
              lessons={lessons}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
