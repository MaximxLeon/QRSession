import type { StartSessionResponse } from '@/entities/teacher-lesson'
import { api } from '@/shared/api/instance'

export async function startAttendanceSession(
  lessonId: string
): Promise<StartSessionResponse> {
  const { data } = await api.post<StartSessionResponse>(
    `/teacher/lessons/${lessonId}/sessions`
  )

  return data
}
