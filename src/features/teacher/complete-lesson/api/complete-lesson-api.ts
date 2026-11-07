import { api } from '@/shared/api/instance'

type CompleteLessonResponse = {
  message: string
  lesson: {
    id: string
    status: 'COMPLETED'
  }
  markedAbsent: number
}

export async function completeLesson(
  lessonId: string
): Promise<CompleteLessonResponse> {
  const { data } = await api.patch<CompleteLessonResponse>(
    `/teacher/lessons/${lessonId}/complete`
  )

  return data
}
