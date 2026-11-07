import { api } from '@/shared/api/instance'

import type { StudentLesson } from '../model/types'

type GetStudentScheduleParams = {
  from: string
  to: string
}

export async function getStudentSchedule({
  from,
  to
}: GetStudentScheduleParams): Promise<StudentLesson[]> {
  const { data } = await api.get<StudentLesson[]>('/student/schedule', {
    params: { from, to }
  })

  return data
}
