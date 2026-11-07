import { api } from '@/shared/api/instance'

import type { Subject } from '../model/types'

// Получение списка предметов
export async function getSubjects(): Promise<Subject[]> {
  const { data } = await api.get<Subject[]>('/admin/subjects')

  return data
}
