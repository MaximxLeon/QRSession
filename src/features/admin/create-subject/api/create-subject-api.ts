import type { Subject } from '@/entities/subject'
import { api } from '@/shared/api/instance'

export type CreateSubjectData = {
  name: string
  code?: string
}

export async function createSubject(
  subject: CreateSubjectData
): Promise<Subject> {
  const { data } = await api.post<Subject>('/admin/subjects', subject)

  return data
}
