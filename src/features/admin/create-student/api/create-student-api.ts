import type { Student } from '@/entities/student'
import { api } from '@/shared/api/instance'

// Данные для создания студента
export type CreateStudentData = {
  fullName: string
  login: string
  password: string
  groupId: string
  studentNumber?: string
}

// Создание студента
export async function createStudent(
  student: CreateStudentData
): Promise<Student> {
  const { data } = await api.post<Student>('/admin/students', student)

  return data
}
