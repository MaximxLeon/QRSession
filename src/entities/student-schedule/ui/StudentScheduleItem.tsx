import type { StudentLesson } from '../model/types'

type StudentScheduleItemProps = {
  lesson: StudentLesson
  isCurrent?: boolean
}

export function StudentScheduleItem({
  lesson,
  isCurrent = false
}: StudentScheduleItemProps) {
  const startTime = new Date(lesson.startsAt).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })

  const endTime = new Date(lesson.endsAt).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <article
      className={`rounded-xl border bg-card p-4 transition-colors ${
        isCurrent ? 'border-primary shadow-sm' : 'border-border-light'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <p className="text-lg font-semibold text-heading">{startTime}</p>

          <p className="text-sm text-text-muted">{endTime}</p>
        </div>

        <div className="min-w-0 flex-1 border-l border-border pl-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-heading">
              {lesson.schedule.subject.name}
            </h3>

            {isCurrent && (
              <span className="rounded-full bg-success-bg px-2 py-1 text-xs font-medium text-success-text">
                Сейчас
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-text-muted">
            Преподаватель: {lesson.schedule.teacher.fullName}
          </p>

          <div className="mt-2 flex flex-wrap gap-3 text-sm text-text-muted">
            <span>Аудитория: {lesson.classroom || 'Не указана'}</span>

            <span>Группа: {lesson.schedule.group.name}</span>
          </div>

          {lesson.status === 'CANCELLED' && (
            <span className="mt-2 inline-block rounded-full bg-danger-bg px-2 py-1 text-xs font-medium text-danger-text">
              Занятие отменено
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
