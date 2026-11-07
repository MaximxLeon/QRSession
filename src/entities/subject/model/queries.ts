import { useQuery } from '@tanstack/react-query'

import { getSubjects } from '../api/subjects-api'

export const subjectsKeys = {
  all: ['subjects'] as const
}

export function useSubjects() {
  return useQuery({
    queryKey: subjectsKeys.all,
    queryFn: getSubjects
  })
}
