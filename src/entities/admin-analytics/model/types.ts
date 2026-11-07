export type AnalyticsStats = {
  total: number
  attended: number
  absent: number
  late: number
  excused: number
  lessonsCount: number
  studentsCount: number
  rate: number
}

export type AnalyticsSummary = AnalyticsStats & {
  totalStudents: number
  totalGroups: number
  totalTeachers: number
  totalSubjects: number
  completedLessons: number
}

export type StudentAnalytics = AnalyticsStats & {
  id: string
  fullName: string
  login: string
  studentNumber: string | null
  groupId: string
  groupName: string
}

export type GroupAnalytics = AnalyticsStats & {
  groupId: string
  groupName: string
}

export type SubjectStudentAnalytics = StudentAnalytics

export type SubjectAnalytics = AnalyticsStats & {
  subjectId: string
  subjectName: string
  groups: GroupAnalytics[]
  students: SubjectStudentAnalytics[]
}

export type TeacherSubjectAnalytics = AnalyticsStats & {
  subjectId: string
  subjectName: string
}

export type TeacherAnalytics = AnalyticsStats & {
  teacherId: string
  teacherName: string
  groups: GroupAnalytics[]
  subjects: TeacherSubjectAnalytics[]
}

export type WeekdayAnalytics = AnalyticsStats & {
  day: string
}

export type TimeAnalytics = AnalyticsStats & {
  time: string
}

export type LessonAnalytics = {
  id: string
  date: string
  startsAt: string
  endsAt: string
  classroom: string
  subjectId: string
  subjectName: string
  groupId: string
  groupName: string
  teacherId: string
  teacherName: string
  attended: number
  absent: number
  late: number
  excused: number
  total: number
  rate: number
}

export type AdminAnalytics = {
  filters: {
    from: string
    to: string
    threshold: number | null
  }
  summary: AnalyticsSummary
  byGroup: GroupAnalytics[]
  bySubject: SubjectAnalytics[]
  byTeacher: TeacherAnalytics[]
  students: StudentAnalytics[]
  lowAttendanceStudents: StudentAnalytics[]
  byWeekday: WeekdayAnalytics[]
  byTime: TimeAnalytics[]
  lessons: LessonAnalytics[]
}

export type AdminAnalyticsParams = {
  from: string
  to: string
  threshold?: number | 'all'
}
