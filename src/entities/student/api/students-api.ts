import { api } from '@/shared/api/instance'

import type { Student } from '../model/types'

// Получение списка студентов
export async function getStudents(): Promise<Student[]> {
  const { data } = await api.get<Student[]>('/admin/students')

  return data
}
