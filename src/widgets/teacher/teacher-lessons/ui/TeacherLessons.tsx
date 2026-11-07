'use client'

import { useState } from 'react'

import { useTeacherLessons } from '@/entities/teacher-lesson'
import { useCreateLesson } from '@/features/teacher/create-lesson'
import { useUpdateStudentAttendance } from '@/features/teacher/update-student-attendance'

import { TeacherLessonCard } from './TeacherLessonCard'

function getTodayDate() {
  const date = new Date()
  const timezoneOffset = date.getTimezoneOffset() * 60_000

  return new Date(date.getTime() - timezoneOffset).toISOString().split('T')[0]
}

export function TeacherLessons() {
  const [date, setDate] = useState(getTodayDate)

  const { data: schedules = [], isLoading, isError } = useTeacherLessons(date)

  const createLesson = useCreateLesson(date)
  const updateAttendance = useUpdateStudentAttendance(date)

  // Создание занятия
  const handleCreateLesson = (scheduleId: string) => {
    createLesson.mutate({
      scheduleId,
      lessonType: 'PRACTICE'
    })
  }

  // Ручное изменение посещаемости
  const handleAttendanceChange = (
    lessonId: string,
    studentId: string,
    present: boolean
  ) => {
    updateAttendance.mutate({
      lessonId,
      studentId,
      present
    })
  }

  return (
    <div className="space-y-6">
      {/* Выбор даты */}
      <div className="rounded-xl border border-border bg-card p-5">
        <label
          htmlFor="lesson-date"
          className="mb-2 block text-sm font-medium text-heading"
        >
          Дата занятий
        </label>

        <input
          id="lesson-date"
          type="date"
          value={date}
          onChange={event => setDate(event.target.value)}
          className="
            w-full max-w-xs rounded-lg border border-border-input
            bg-input-bg px-3 py-2.5 text-sm text-foreground
            outline-none transition-colors
            focus:border-primary focus:ring-2 focus:ring-focus-ring/20
          "
        />
      </div>

      {/* Состояние загрузки */}
      {isLoading && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />

          <p className="mt-3 text-sm text-text-muted">Загружаем занятия...</p>
        </div>
      )}

      {/* Ошибка загрузки */}
      {isError && (
        <div className="rounded-xl border border-danger/20 bg-danger-bg p-5">
          <p className="text-sm font-medium text-danger-text">
            Не удалось загрузить занятия. Попробуйте обновить страницу.
          </p>
        </div>
      )}

      {/* Пустой список */}
      {!isLoading && !isError && schedules.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="font-semibold text-heading">Занятий нет</h2>

          <p className="mt-2 text-sm text-text-muted">
            На выбранную дату занятия не найдены.
          </p>
        </div>
      )}

      {/* Список занятий */}
      {!isLoading && !isError && schedules.length > 0 && (
        <div className="space-y-5">
          {schedules.map(item => {
            const lesson = item.lessons[0]

            return (
              <TeacherLessonCard
                key={item.id}
                item={item}
                lesson={lesson}
                isCreatePending={createLesson.isPending}
                onCreateLesson={handleCreateLesson}
                attendancePending={updateAttendance.isPending}
                attendanceVariables={updateAttendance.variables}
                onAttendanceChange={handleAttendanceChange}
              />
            )
          })}
        </div>
      )}

      {/* Ошибки и успешные действия */}
      {createLesson.isError && (
        <div className="rounded-lg bg-danger-bg p-3 text-sm text-danger-text">
          Не удалось создать занятие.
        </div>
      )}

      {createLesson.isSuccess && (
        <div className="rounded-lg bg-success-bg p-3 text-sm text-success-text">
          Занятие успешно создано.
        </div>
      )}

      {updateAttendance.isError && (
        <div className="rounded-lg bg-danger-bg p-3 text-sm text-danger-text">
          Не удалось обновить посещаемость.
        </div>
      )}
    </div>
  )
}
