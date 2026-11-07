import { useQuery } from '@tanstack/react-query'

import { getTeachers } from '../api/teachers-api'

// Ключи кэша преподавателей
export const teachersKeys = {
  all: ['teachers'] as const
}

// Получение списка преподавателей
export function useTeachers() {
  return useQuery({
    queryKey: teachersKeys.all,
    queryFn: getTeachers
  })
}
