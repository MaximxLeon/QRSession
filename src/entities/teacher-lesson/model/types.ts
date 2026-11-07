// Типы занятия.
export type LessonType =
  | 'LECTURE'
  | 'PRACTICE'
  | 'LAB'
  | 'COURSE_WORK'
  | 'EXAM'
  | 'CREDIT'
  | 'THESIS'
  | 'CONSULTATION'
  | 'OTHER'

// Статусы занятия.
export type LessonStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

// Статусы посещаемости студента.
export type AttendanceStatus =
  | 'UNMARKED'
  | 'PRESENT'
  | 'ABSENT'
  | 'LATE'
  | 'EXCUSED'

// Студент группы.
export type TeacherGroupStudent = {
  id: string
  studentNumber: string
  isHead: boolean
  user: {
    fullName: string
  }
}

// Запись о посещаемости.
export type LessonAttendance = {
  studentId: string
  status: AttendanceStatus
  source: string
  markedAt: string | null
}

// Конкретное занятие.
export type Lesson = {
  id: string
  status: LessonStatus
  lessonType: LessonType
  attendance: LessonAttendance[]
}

// Расписание преподавателя на конкретную дату.
export type TeacherLessonSchedule = {
  id: string
  groupId: string
  subjectId: string
  teacherId: string
  dayOfWeek: string
  startTime: string
  endTime: string
  classroom: string

  group: {
    id: string
    name: string
    students: TeacherGroupStudent[]
  }

  subject: {
    id: string
    name: string
  }

  lessons: Lesson[]
}

// Ответ при создании QR-сессии.
export type StartSessionResponse = {
  sessionId: string
  token: string
  confirmationCode: string
  tokenExpiresAt: string
}

// Ответ при обновлении QR.
export type RotateSessionResponse = {
  token: string
  confirmationCode: string
  tokenExpiresAt: string
}

// Данные для создания занятия.
export type CreateLessonData = {
  scheduleId: string
  date: string
  lessonType: LessonType
}

// Данные для ручного изменения посещаемости.
export type UpdateStudentAttendanceData = {
  studentId: string
  present: boolean
}
