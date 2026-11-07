import { api } from '@/shared/api/instance'

import type { AttendanceAnalytics } from '../model/types'

type GetAttendanceAnalyticsParams = {
  from: string
  to: string
}

export async function getStudentAttendanceAnalytics(
  params: GetAttendanceAnalyticsParams
): Promise<AttendanceAnalytics> {
  const { data } = await api.get<AttendanceAnalytics>(
    '/student/attendance/analytics',
    {
      params
    }
  )

  return data
}
