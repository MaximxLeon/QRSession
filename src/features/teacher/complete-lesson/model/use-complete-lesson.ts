import { useMutation } from '@tanstack/react-query'

import { completeLesson } from '../api/complete-lesson-api'

export function useCompleteLesson() {
  return useMutation({
    mutationFn: completeLesson
  })
}
