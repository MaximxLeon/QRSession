import { subjectsKeys } from '@/entities/subject'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createSubject } from '../api/create-subject-api'

export function useCreateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSubject,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: subjectsKeys.all
      })
    }
  })
}
