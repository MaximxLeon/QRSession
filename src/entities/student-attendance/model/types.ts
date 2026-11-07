export type AttendanceSummary = {
  totalLessons: number
  attended: number
  absent: number
  late: number
  excused: number
  attendanceRate: number
}

export type AttendanceBySubject = {
  subjectId: string
  subjectName: string
  total: number
  attended: number
  absent: number
  late: number
  excused: number
  rate: number
}

export type AttendanceByPeriod = {
  period: string
  attended: number
  absent: number
  late: number
  excused: number
  total: number
  rate: number
}

export type AttendanceByWeekday = {
  day: string
  attended: number
  absent: number
  total: number
  rate: number
}

export type AttendanceByTime = {
  time: string
  attended: number
  absent: number
  total: number
  rate: number
}

export type AttendanceAnalytics = {
  summary: AttendanceSummary
  bySubject: AttendanceBySubject[]
  byPeriod: AttendanceByPeriod[]
  byWeekday: AttendanceByWeekday[]
  byTime: AttendanceByTime[]
}
