'use client'

import type { Lesson, TeacherLessonSchedule } from '@/entities/teacher-lesson'
import { useCompleteLesson } from '@/features/teacher/complete-lesson'
import { CreateLessonButton } from '@/features/teacher/create-lesson'
import { AttendanceList } from '@/features/teacher/update-student-attendance'

import { QrSession } from '../../qr-session'

type TeacherLessonCardProps = {
  item: TeacherLessonSchedule
  lesson?: Lesson
  isCreatePending: boolean
  onCreateLesson: (scheduleId: string) => void
  attendancePending: boolean
  attendanceVariables?: {
    lessonId: string
    studentId: string
    present: boolean
  }
  onAttendanceChange: (
    lessonId: string,
    studentId: string,
    present: boolean
  ) => void
}

const lessonStatusLabels: Record<string, string> = {
  PLANNED: 'Запланировано',
  IN_PROGRESS: 'Идёт занятие',
  COMPLETED: 'Завершено',
  CANCELLED: 'Отменено'
}

const lessonStatusStyles: Record<string, string> = {
  PLANNED: 'bg-info-bg text-info-text',
  IN_PROGRESS: 'bg-success-bg text-success-text',
  COMPLETED: 'bg-muted-bg text-text-muted',
  CANCELLED: 'bg-danger-bg text-danger-text'
}

export function TeacherLessonCard({
  item,
  lesson,
  isCreatePending,
  onCreateLesson,
  attendancePending,
  attendanceVariables,
  onAttendanceChange
}: TeacherLessonCardProps) {
  const students = item.group.students ?? []
  const attendance = lesson?.attendance ?? []

  const completeMutation = useCompleteLesson()

  const handleCompleteLesson = () => {
    if (!lesson || lesson.status !== 'IN_PROGRESS') return

    const confirmed = window.confirm(
      'Завершить пару? Все неотмеченные студенты будут отмечены как отсутствующие.'
    )

    if (!confirmed) return

    completeMutation.mutate(lesson.id)
  }

  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
      {/* Основная информация о занятии */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-heading">
            {item.subject.name}
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Группа: {item.group.name}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-muted">
            <span>
              {item.startTime} — {item.endTime}
            </span>

            <span>Аудитория: {item.classroom}</span>
          </div>
        </div>

        {lesson && (
          <span
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              lessonStatusStyles[lesson.status]
            }`}
          >
            {lessonStatusLabels[lesson.status]}
          </span>
        )}
      </div>

      {/* Если занятие ещё не создано */}
      {!lesson && (
        <div className="mt-5 border-t border-border-light pt-4">
          <CreateLessonButton
            isPending={isCreatePending}
            onClick={() => onCreateLesson(item.id)}
          />
        </div>
      )}

      {/* QR-сессия */}
      {lesson &&
        lesson.status !== 'COMPLETED' &&
        lesson.status !== 'CANCELLED' && (
          <div className="mt-5 border-t border-border-light pt-4">
            <QrSession lessonId={lesson.id} />
          </div>
        )}

      {/* Завершение пары */}
      {lesson?.status === 'IN_PROGRESS' && (
        <div className="mt-5 border-t border-border-light pt-4">
          <button
            type="button"
            onClick={handleCompleteLesson}
            disabled={completeMutation.isPending}
            className="w-full rounded-xl bg-danger-bg px-4 py-3 text-sm font-semibold text-danger-text transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {completeMutation.isPending
              ? 'Завершение пары...'
              : 'Завершить пару'}
          </button>

          {completeMutation.isError && (
            <p className="mt-2 text-sm text-danger-text">
              {completeMutation.error instanceof Error
                ? completeMutation.error.message
                : 'Не удалось завершить занятие. Попробуйте ещё раз.'}
            </p>
          )}
        </div>
      )}

      {/* Посещаемость */}
      {lesson && lesson.status !== 'CANCELLED' && (
        <AttendanceList
          lessonId={lesson.id}
          lessonStatus={lesson.status}
          students={students}
          attendance={attendance}
          isPending={attendancePending}
          pendingVariables={attendanceVariables}
          onAttendanceChange={onAttendanceChange}
        />
      )}
    </article>
  )
}
