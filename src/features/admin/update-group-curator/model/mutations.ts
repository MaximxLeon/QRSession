import { groupsKeys } from '@/entities/group'
import { api } from '@/shared/api/instance'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// Изменение куратора группы
async function updateGroupCurator({
  groupId,
  curatorId
}: {
  groupId: string
  curatorId: string | null
}) {
  const { data } = await api.patch(`/admin/groups/${groupId}`, { curatorId })

  return data
}

export function useUpdateGroupCurator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateGroupCurator,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: groupsKeys.all
      })
    }
  })
}
