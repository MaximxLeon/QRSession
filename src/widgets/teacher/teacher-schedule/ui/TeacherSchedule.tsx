'use client'

import { CalendarDays } from 'lucide-react'

import {
  TeacherScheduleItem,
  useTeacherSchedule
} from '@/entities/teacher-schedule'

export function TeacherSchedule() {
  const { data, isLoading, error } = useTeacherSchedule()

  // Состояние загрузки.
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-6 text-text-muted">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
        <p>Загрузка расписания...</p>
      </div>
    )
  }

  // Состояние ошибки.
  if (error) {
    return (
      <div className="rounded-xl border border-danger/20 bg-danger-bg p-5">
        <p className="font-medium text-danger-text">
          Не удалось загрузить расписание.
        </p>
        <p className="mt-1 text-sm text-danger-text">
          Попробуйте обновить страницу позже.
        </p>
      </div>
    )
  }

  // Пустое расписание.
  if (!data?.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <CalendarDays
          className="mx-auto mb-3 text-text-muted"
          size={36}
        />

        <p className="font-medium text-heading">Расписание пока пустое</p>

        <p className="mt-1 text-sm text-text-muted">
          Обратитесь к администратору, чтобы вам назначили занятия.
        </p>
      </div>
    )
  }

  // Список занятий.
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data.map(lesson => (
        <TeacherScheduleItem
          key={lesson.id}
          lesson={lesson}
        />
      ))}
    </div>
  )
}
