import { api } from '@/shared/api/instance'

import { Group } from '../model/types'

// Получение списка групп
export async function getGroups(): Promise<Group[]> {
  const { data } = await api.get<Group[]>('/admin/groups')

  return data
}
