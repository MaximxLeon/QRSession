import { useQuery } from '@tanstack/react-query'

import { getSchedule } from '../api/schedule-api'

export const scheduleKeys = {
  all: ['schedule'] as const
}

export function useSchedule() {
  return useQuery({
    queryKey: scheduleKeys.all,
    queryFn: getSchedule
  })
}
