import { groupsKeys } from '@/entities/group'
import { api } from '@/shared/api/instance'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// Создание группы
async function createGroup(name: string) {
  const { data } = await api.post('/admin/groups', { name })

  return data
}

export function useCreateGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGroup,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: groupsKeys.all
      })
    }
  })
}
