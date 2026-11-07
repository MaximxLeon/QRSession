'use client'

import { useMutation } from '@tanstack/react-query'

import { startAttendanceSession } from '../api/start-session-api'

export function useStartAttendanceSession() {
  return useMutation({
    mutationFn: (lessonId: string) => startAttendanceSession(lessonId)
  })
}
