export type StudentLesson = {
  id: string
  date: string
  startsAt: string
  endsAt: string
  classroom: string
  lessonType: string
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  schedule: {
    id: string
    group: {
      id: string
      name: string
    }
    subject: {
      id: string
      name: string
    }
    teacher: {
      id: string
      fullName: string
    }
  }
}
