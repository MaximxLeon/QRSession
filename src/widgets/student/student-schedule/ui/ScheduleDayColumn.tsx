import type { StudentLesson } from '@/entities/student-schedule'

import {
  formatDate,
  getLessonDateKey,
  LESSON_HEIGHT,
  lessonTimes
} from '../model/schedule-utils'
import { LessonCard } from './LessonCard'

type ScheduleDayColumnProps = {
  date: Date
  lessons: StudentLesson[]
}

export function ScheduleDayColumn({ date, lessons }: ScheduleDayColumnProps) {
  const dateKey = getLessonDateKey

  const dayLessons = lessons.filter(
    lesson => dateKey(lesson) === formatDate(date)
  )

  return (
    <div
      className="relative border-r border-border-light"
      style={{ height: LESSON_HEIGHT * lessonTimes.length }}
    >
      {lessonTimes.map(lesson => (
        <div
          key={lesson.number}
          className="border-b border-border-light"
          style={{ height: LESSON_HEIGHT }}
        />
      ))}

      {dayLessons.map(lesson => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
        />
      ))}
    </div>
  )
}
