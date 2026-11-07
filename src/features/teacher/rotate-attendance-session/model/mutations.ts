'use client'

import { useMutation } from '@tanstack/react-query'

import { rotateAttendanceSession } from '../api/rotate-session-api'

export function useRotateAttendanceSession() {
  return useMutation({
    mutationFn: (sessionId: string) => rotateAttendanceSession(sessionId)
  })
}
