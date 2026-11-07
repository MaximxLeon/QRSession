import { useQuery } from '@tanstack/react-query'

import { getTeachers } from './teachers-api'

export const teachersKeys = {
  all: ['teachers'] as const
}

export function useTeachers() {
  return useQuery({
    queryKey: teachersKeys.all,
    queryFn: getTeachers
  })
}
