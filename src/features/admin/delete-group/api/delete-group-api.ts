import { api } from '@/shared/api/instance'

// Удаление группы
export async function deleteGroup(groupId: string): Promise<void> {
  await api.delete(`/admin/groups/${groupId}`)
}
