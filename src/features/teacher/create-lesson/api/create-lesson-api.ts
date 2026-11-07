import type { CreateLessonData } from '@/entities/teacher-lesson'
import { api } from '@/shared/api/instance'

export async function createLesson(data: CreateLessonData) {
  const { data: result } = await api.post('/teacher/lessons/create', data)

  return result
}
