import type { UpdateStudentAttendanceData } from '@/entities/teacher-lesson'
import { api } from '@/shared/api/instance'

export async function updateStudentAttendance(
  lessonId: string,
  data: UpdateStudentAttendanceData
) {
  const { data: result } = await api.patch(
    `/teacher/lessons/${lessonId}/attendance`,
    data
  )

  return result
}
