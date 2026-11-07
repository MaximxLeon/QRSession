'use client'

import { useMemo, useState } from 'react'

import { useStudentSchedule } from '@/entities/student-schedule'

import {
  addDays,
  formatDate,
  getWeekDates,
  parseDate
} from '../model/schedule-utils'
import { ScheduleGrid } from './ScheduleGrid'
import { ScheduleHeader } from './ScheduleHeader'
import { SchedulePeriodNavigation } from './SchedulePeriodNavigation'

type ViewMode = 'day' | 'week'

export function StudentSchedule() {
  const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()))

  const [viewMode, setViewMode] = useState<ViewMode>('week')

  const selectedDateObject = useMemo(
    () => parseDate(selectedDate),
    [selectedDate]
  )

  const visibleDates = useMemo(() => {
    if (viewMode === 'day') {
      return [selectedDateObject]
    }

    return getWeekDates(selectedDateObject)
  }, [viewMode, selectedDateObject])

  const from = formatDate(visibleDates[0])
  const to = formatDate(visibleDates[visibleDates.length - 1])

  const {
    data: lessons,
    isLoading,
    isError,
    refetch
  } = useStudentSchedule({ from, to })

  function changePeriod(direction: number) {
    const days = viewMode === 'day' ? 1 : 7

    setSelectedDate(formatDate(addDays(selectedDateObject, direction * days)))
  }

  return (
    <section className="space-y-6">
      <ScheduleHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <SchedulePeriodNavigation
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onPeriodChange={changePeriod}
      />

      <p className="text-sm font-medium text-heading">
        {viewMode === 'day'
          ? selectedDateObject.toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              weekday: 'long'
            })
          : `${visibleDates[0].toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long'
            })} — ${visibleDates[6].toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}`}
      </p>

      {isLoading && (
        <div className="rounded-xl border border-border-light bg-card p-8 text-center text-text-muted">
          Загружаем расписание...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-danger/20 bg-danger-bg p-6 text-center">
          <p className="text-sm text-danger-text">
            Не удалось загрузить расписание
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <ScheduleGrid
          dates={visibleDates}
          lessons={lessons ?? []}
          viewMode={viewMode}
        />
      )}
    </section>
  )
}
