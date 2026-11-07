import { z } from 'zod'

export const createStudentSchema = z.object({
  fullName: z.string().trim().min(1, 'Введите ФИО студента'),

  login: z.string().trim().min(1, 'Введите логин'),

  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),

  groupId: z.string().min(1, 'Выберите учебную группу'),

  studentNumber: z.string().trim()
})

export type CreateStudentFormValues = z.infer<typeof createStudentSchema>
