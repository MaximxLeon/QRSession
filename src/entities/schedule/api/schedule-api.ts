import { api } from '@/shared/api/instance'

import type { Schedule } from '../model/types'

export async function getSchedule(): Promise<Schedule[]> {
  const { data } = await api.get<Schedule[]>('/admin/schedule')

  return data
}
