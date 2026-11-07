import { useQuery } from '@tanstack/react-query'

import { getGroups } from '../api/groups-api'

// Ключи кэша групп
export const groupsKeys = {
  all: ['groups'] as const
}

// Получение списка групп
export function useGroups() {
  return useQuery({
    queryKey: groupsKeys.all,
    queryFn: getGroups
  })
}
