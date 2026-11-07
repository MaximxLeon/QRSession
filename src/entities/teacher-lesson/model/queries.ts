'use client'

import { useQuery } from '@tanstack/react-query'

import { getTeacherLessons } from '../api/lesson-api'

// Ключи кеша React Query.
export const teacherLessonKeys = {
  all: ['teacher-lessons'] as const,
  byDate: (date: string) => ['teacher-lessons', date] as const
}

// Получение занятий на выбранную дату.
export function useTeacherLessons(date: string) {
  return useQuery({
    queryKey: teacherLessonKeys.byDate(date),
    queryFn: () => getTeacherLessons(date),
    enabled: Boolean(date)
  })
}
