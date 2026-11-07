import { useQuery } from '@tanstack/react-query'

import { getStudentAttendanceAnalytics } from '../api/attendance-api'

type UseStudentAttendanceAnalyticsParams = {
  from: string
  to: string
}

export const studentAttendanceKeys = {
  all: ['student-attendance'] as const,
  analytics: (from: string, to: string) =>
    [...studentAttendanceKeys.all, 'analytics', from, to] as const
}

export function useStudentAttendanceAnalytics({
  from,
  to
}: UseStudentAttendanceAnalyticsParams) {
  return useQuery({
    queryKey: studentAttendanceKeys.analytics(from, to),
    queryFn: () => getStudentAttendanceAnalytics({ from, to }),
    enabled: Boolean(from && to)
  })
}
