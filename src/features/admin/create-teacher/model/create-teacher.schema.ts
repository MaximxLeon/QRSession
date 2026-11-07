import { z } from 'zod'

export const createTeacherSchema = z.object({
  fullName: z.string().trim().min(1, 'Введите ФИО преподавателя'),

  login: z.string().trim().min(1, 'Введите логин'),

  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов')
})

export type CreateTeacherFormValues = z.infer<typeof createTeacherSchema>
