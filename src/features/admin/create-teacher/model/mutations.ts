import { teachersKeys } from '@/entities/teacher'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createTeacher } from '../api/create-teacher-api'

// Хук создания преподавателя
export function useCreateTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTeacher,

    // Обновляем список после успешного создания
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teachersKeys.all
      })
    }
  })
}
