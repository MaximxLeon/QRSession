import { useQuery } from '@tanstack/react-query'

import { getTeacherSchedule } from '../api/schedule-api'

// Ключ для кеширования расписания.
export const teacherScheduleKeys = {
  all: ['teacher-schedule'] as const
}

// Хук получения недельного расписания.
export function useTeacherSchedule() {
  return useQuery({
    queryKey: teacherScheduleKeys.all,
    queryFn: getTeacherSchedule
  })
}
