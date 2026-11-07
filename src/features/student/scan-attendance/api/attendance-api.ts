import type {
  ScanAttendanceData,
  ScanAttendanceResponse
} from '@/entities/attendance'
import { api } from '@/shared/api/instance'

export async function scanAttendance(
  data: ScanAttendanceData
): Promise<ScanAttendanceResponse> {
  const { data: result } = await api.post<ScanAttendanceResponse>(
    '/student/attendance/scan',
    data
  )

  return result
}
