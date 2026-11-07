import type { Schedule } from '@/entities/schedule'
import { api } from '@/shared/api/instance'

export type CreateScheduleData = {
  groupId: string
  subjectId: string
  teacherId: string
  dayOfWeek: string
  startTime: string
  endTime: string
  classroom: string
  validFrom: string
  validTo?: string
}

export async function createSchedule(
  schedule: CreateScheduleData
): Promise<Schedule> {
  const { data } = await api.post<Schedule>('/admin/schedule', schedule)

  return data
}
