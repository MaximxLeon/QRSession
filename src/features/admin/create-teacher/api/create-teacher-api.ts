import type { Teacher } from '@/entities/teacher'
import { api } from '@/shared/api/instance'

// Данные для создания преподавателя
export type CreateTeacherData = {
  fullName: string
  login: string
  password: string
}

// Создание преподавателя
export async function createTeacher(
  teacher: CreateTeacherData
): Promise<Teacher> {
  const { data } = await api.post<Teacher>('/admin/teachers', teacher)

  return data
}
