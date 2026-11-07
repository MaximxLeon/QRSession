import { scheduleKeys } from '@/entities/schedule'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createSchedule } from '../api/create-schedule-api'

export function useCreateSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSchedule,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: scheduleKeys.all
      })
    }
  })
}
