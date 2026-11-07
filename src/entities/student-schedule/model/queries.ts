import { useQuery } from '@tanstack/react-query'

import { getStudentSchedule } from '../api/schedule-api'

export const studentScheduleKeys = {
  all: ['student-schedule'] as const,
  byPeriod: (from: string, to: string) =>
    [...studentScheduleKeys.all, from, to] as const
}

type UseStudentScheduleParams = {
  from: string
  to: string
}

export function useStudentSchedule({ from, to }: UseStudentScheduleParams) {
  return useQuery({
    queryKey: studentScheduleKeys.byPeriod(from, to),
    queryFn: () => getStudentSchedule({ from, to }),
    enabled: Boolean(from && to)
  })
}
