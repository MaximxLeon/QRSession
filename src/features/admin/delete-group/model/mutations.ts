import { groupsKeys } from '@/entities/group'
import { api } from '@/shared/api/instance'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// Удаление учебной группы
async function deleteGroup(groupId: string): Promise<void> {
  await api.delete(`/admin/groups/${groupId}`)
}

export function useDeleteGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteGroup,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: groupsKeys.all
      })
    }
  })
}
