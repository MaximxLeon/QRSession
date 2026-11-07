import type { StudentLesson } from '@/entities/student-schedule'

import {
  formatTime,
  getLessonPosition,
  isCurrentLesson
} from '../model/schedule-utils'

type LessonCardProps = {
  lesson: StudentLesson
}

export function LessonCard({ lesson }: LessonCardProps) {
  const isCurrent = isCurrentLesson(lesson)
  const isCancelled = lesson.status === 'CANCELLED'

  const { top, height } = getLessonPosition(lesson)

  return (
    <article
      className={`absolute left-1 right-1 z-10 overflow-hidden rounded-lg border p-2 transition-colors ${
        isCancelled
          ? 'border-danger/30 bg-danger-bg opacity-70'
          : isCurrent
            ? 'border-primary bg-primary-light'
            : 'border-border bg-card-hover'
      }`}
      style={{
        top,
        height,
        minHeight: 36
      }}
    >
      <p className="truncate text-xs font-bold text-heading">
        {lesson.schedule.subject.name}
      </p>

      {isCancelled && (
        <p className="mt-1 text-xs font-medium text-danger-text">Отменено</p>
      )}

      {height >= 55 && (
        <>
          <p className="mt-1 truncate text-xs text-foreground">
            {formatTime(lesson.startsAt)} – {formatTime(lesson.endsAt)}
          </p>

          <p className="mt-1 truncate text-xs text-text-muted">
            {lesson.schedule.teacher.fullName}
          </p>

          <p className="truncate text-xs text-text-muted">
            {lesson.classroom || 'Аудитория не указана'}
          </p>
        </>
      )}

      {isCurrent && !isCancelled && (
        <span className="absolute bottom-1 right-2 text-[10px] font-semibold text-primary">
          Сейчас
        </span>
      )}
    </article>
  )
}
