'use client'

import type { UpdateStudentAttendanceData } from '@/entities/teacher-lesson'
import { teacherLessonKeys } from '@/entities/teacher-lesson'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateStudentAttendance } from '../api/update-attendance-api'

export function useUpdateStudentAttendance(date: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      data: UpdateStudentAttendanceData & {
        lessonId: string
      }
    ) => {
      const { lessonId, ...attendanceData } = data

      return updateStudentAttendance(lessonId, attendanceData)
    },

    // Обновляем посещаемость после сохранения.
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherLessonKeys.byDate(date)
      })
    }
  })
}
