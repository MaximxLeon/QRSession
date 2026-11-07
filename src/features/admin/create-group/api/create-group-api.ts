import type { Group } from '@/entities/group'
import { api } from '@/shared/api/instance'

// Создание группы
export async function createGroup(name: string): Promise<Group> {
  const { data } = await api.post<Group>('/admin/groups', { name })

  return data
}
