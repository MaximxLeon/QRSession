// Обычное недельное расписание преподавателя.
export type TeacherSchedule = {
  id: string
  groupId: string
  subjectId: string
  teacherId: string
  dayOfWeek: string
  startTime: string
  endTime: string
  classroom: string
  validFrom: string
  validTo: string | null

  group: {
    id: string
    name: string
  }

  subject: {
    id: string
    name: string
  }
}
