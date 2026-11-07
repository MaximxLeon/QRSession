import { studentsKeys } from '@/entities/student'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createStudent } from '../api/create-student-api'

export function useCreateStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStudent,

    // Обновляем список студентов после создания
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentsKeys.all
      })
    }
  })
}
