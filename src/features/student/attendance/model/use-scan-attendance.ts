'use client'

import { useMutation } from '@tanstack/react-query'

import { scanAttendance } from '../api/attendance-api'

export function useScanAttendance() {
  return useMutation({
    mutationFn: scanAttendance
  })
}
