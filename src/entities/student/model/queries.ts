import { useQuery } from '@tanstack/react-query'

import { getStudents } from '../api/students-api'

export const studentsKeys = {
  all: ['students'] as const
}

export function useStudents() {
  return useQuery({
    queryKey: studentsKeys.all,
    queryFn: getStudents
  })
}
