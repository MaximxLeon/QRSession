'use client'

import type { LessonType } from '@/entities/teacher-lesson'
import { teacherLessonKeys } from '@/entities/teacher-lesson'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createLesson } from '../api/create-lesson-api'

export function useCreateLesson(date: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { scheduleId: string; lessonType: LessonType }) =>
      createLesson({
        ...data,
        date
      }),

    // Обновляем список занятий после создания.
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherLessonKeys.byDate(date)
      })
    }
  })
}
