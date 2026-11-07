import { api } from '@/shared/api/instance'

import type { TeacherSchedule } from '../model/types'

// Получаем обычное недельное расписание.
export async function getTeacherSchedule(): Promise<TeacherSchedule[]> {
  const { data } = await api.get<TeacherSchedule[]>('/teacher/schedule')

  return data
}
