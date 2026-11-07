import type { RotateSessionResponse } from '@/entities/teacher-lesson'
import { api } from '@/shared/api/instance'

export async function rotateAttendanceSession(
  sessionId: string
): Promise<RotateSessionResponse> {
  const { data } = await api.post<RotateSessionResponse>(
    `/teacher/sessions/${sessionId}/rotate`
  )

  return data
}
