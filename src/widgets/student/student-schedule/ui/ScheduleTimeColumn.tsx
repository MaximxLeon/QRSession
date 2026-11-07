import { LESSON_HEIGHT, lessonTimes } from '../model/schedule-utils'

export function ScheduleTimeColumn() {
  return (
    <div className="sticky left-0 z-20 bg-card">
      {lessonTimes.map(lesson => (
        <div
          key={lesson.number}
          className="flex flex-col items-center justify-center border-b border-border-light px-2 text-center"
          style={{ height: LESSON_HEIGHT }}
        >
          <span className="text-sm font-bold text-heading">
            {lesson.number} пара
          </span>

          <span className="mt-1 text-xs text-text-muted">
            {lesson.start}–{lesson.end}
          </span>
        </div>
      ))}
    </div>
  )
}
