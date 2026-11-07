'use client'

import { useState } from 'react'

import { useStudentAttendanceAnalytics } from '@/entities/student-attendance'

import { AttendanceCharts } from './AttendanceCharts'
import { AttendanceSummary } from './AttendanceSummary'

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function AttendanceAnalytics() {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), 0, 1)

  const [from, setFrom] = useState(formatDate(firstDay))
  const [to, setTo] = useState(formatDate(today))

  const { data, isLoading, isError, refetch } = useStudentAttendanceAnalytics({
    from,
    to
  })

  return (
    <div className="space-y-6">
      {/* Выбор периода */}
      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor="attendance-from"
            className="mb-2 block text-sm font-medium text-heading"
          >
            Начало периода
          </label>

          <input
            id="attendance-from"
            type="date"
            value={from}
            max={to}
            onChange={event => setFrom(event.target.value)}
            className="w-full rounded-xl border border-border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
          />
        </div>

        <div className="flex-1">
          <label
            htmlFor="attendance-to"
            className="mb-2 block text-sm font-medium text-heading"
          >
            Конец периода
          </label>

          <input
            id="attendance-to"
            type="date"
            value={to}
            min={from}
            max={formatDate(today)}
            onChange={event => setTo(event.target.value)}
            className="w-full rounded-xl border border-border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
          />
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover active:bg-primary-active"
        >
          Применить
        </button>
      </section>

      {/* Загрузка */}
      {isLoading && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-light border-t-primary" />

          <p className="mt-4 text-sm text-text-muted">
            Загружаем статистику посещаемости...
          </p>
        </div>
      )}

      {/* Ошибка */}
      {isError && (
        <div className="rounded-2xl border border-danger bg-card p-8 text-center">
          <p className="font-medium text-danger-text">
            Не удалось загрузить статистику
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
          >
            Повторить
          </button>
        </div>
      )}

      {/* Данные */}
      {data && !isLoading && !isError && (
        <>
          <AttendanceSummary summary={data.summary} />

          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-heading">
                Подробная аналитика
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Разбор посещаемости по разным показателям
              </p>
            </div>

            <AttendanceCharts data={data} />
          </div>
        </>
      )}
    </div>
  )
}
