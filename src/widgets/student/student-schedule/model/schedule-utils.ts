import type { StudentLesson } from '@/entities/student-schedule'

export const LESSON_HEIGHT = 90

export const lessonTimes = [
  { number: 1, start: '08:00', end: '09:30' },
  { number: 2, start: '09:50', end: '11:20' },
  { number: 3, start: '11:40', end: '13:10' },
  { number: 4, start: '13:40', end: '15:10' },
  { number: 5, start: '15:20', end: '16:50' },
  { number: 6, start: '17:00', end: '18:30' },
  { number: 7, start: '18:40', end: '20:10' }
]

export const weekDays = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье'
]

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function parseDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)

  return new Date(year, month - 1, day)
}

export function addDays(date: Date, amount: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)

  return result
}

export function getWeekDates(date: Date): Date[] {
  const day = date.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = addDays(date, mondayOffset)

  return Array.from({ length: 7 }, (_, index) => addDays(monday, index))
}

export function getMinutes(value: string): number {
  const date = new Date(value)

  return date.getHours() * 60 + date.getMinutes()
}

export function getLessonDateKey(lesson: StudentLesson): string {
  return lesson.date.slice(0, 10)
}

export function isCurrentLesson(lesson: StudentLesson): boolean {
  if (getLessonDateKey(lesson) !== formatDate(new Date())) {
    return false
  }

  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  return (
    currentMinutes >= getMinutes(lesson.startsAt) &&
    currentMinutes < getMinutes(lesson.endsAt)
  )
}

export function getLessonPosition(lesson: StudentLesson) {
  const start = getMinutes(lesson.startsAt)
  // const end = getMinutes(lesson.endsAt)

  const lessonIndex = lessonTimes.findIndex(item => {
    const [hours, minutes] = item.start.split(':').map(Number)
    const expectedStart = hours * 60 + minutes

    return Math.abs(start - expectedStart) <= 10
  })

  // Если время не совпало с расписанием, не отображаем карточку
  if (lessonIndex === -1) {
    return {
      top: 0,
      height: 0
    }
  }

  return {
    top: lessonIndex * LESSON_HEIGHT,
    height: LESSON_HEIGHT
  }
}

export function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getDayLabel(date: Date): string {
  return weekDays[(date.getDay() + 6) % 7]
}
