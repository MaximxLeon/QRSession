import { CalendarDays, Clock, MapPin, Users } from 'lucide-react'

import type { TeacherSchedule } from '../model/types'

const weekDays: Record<string, string> = {
  MONDAY: 'Понедельник',
  TUESDAY: 'Вторник',
  WEDNESDAY: 'Среда',
  THURSDAY: 'Четверг',
  FRIDAY: 'Пятница',
  SATURDAY: 'Суббота',
  SUNDAY: 'Воскресенье'
}

type TeacherScheduleItemProps = {
  lesson: TeacherSchedule
}

export function TeacherScheduleItem({ lesson }: TeacherScheduleItemProps) {
  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-border-strong hover:shadow-md">
      <h2 className="text-lg font-semibold text-heading">
        {lesson.subject.name}
      </h2>

      <div className="mt-4 space-y-3 text-sm text-text">
        <div className="flex items-center gap-2">
          <Users
            size={17}
            className="shrink-0 text-text-muted"
          />
          <span>Группа: {lesson.group.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays
            size={17}
            className="shrink-0 text-text-muted"
          />
          <span>{weekDays[lesson.dayOfWeek] ?? lesson.dayOfWeek}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock
            size={17}
            className="shrink-0 text-text-muted"
          />
          <span>
            {lesson.startTime} – {lesson.endTime}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin
            size={17}
            className="shrink-0 text-text-muted"
          />
          <span>Аудитория: {lesson.classroom}</span>
        </div>
      </div>
    </article>
  )
}
