import { api } from '@/shared/api/instance'

export type ScanAttendanceData = {
  sessionId: string
  token: string
  confirmationCode: string
}

export type ScanAttendanceResponse = {
  message: string
  attendance: {
    id: string
    status: string
    markedAt: string
  }
}

export async function scanAttendance(data: ScanAttendanceData) {
  const { data: result } = await api.post<ScanAttendanceResponse>(
    '/student/attendance/scan',
    data
  )

  return result
}
