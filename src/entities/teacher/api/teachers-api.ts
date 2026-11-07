import { api } from '@/shared/api/instance'

import type { Teacher } from '../model/types'

// Получение списка преподавателей
export async function getTeachers(): Promise<Teacher[]> {
  const { data } = await api.get<Teacher[]>('/admin/teachers')

  return data
}
