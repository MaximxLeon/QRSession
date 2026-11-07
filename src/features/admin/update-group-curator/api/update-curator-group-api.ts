import type { Group } from '@/entities/group'
import { api } from '@/shared/api/instance'

// Назначение или снятие куратора
export async function updateGroupCurator(
  groupId: string,
  curatorId: string | null
): Promise<Group> {
  const { data } = await api.patch<Group>(`/admin/groups/${groupId}`, {
    curatorId
  })

  return data
}
