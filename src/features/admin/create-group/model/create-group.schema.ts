import { z } from 'zod'

// Схема создания учебной группы
export const createGroupSchema = z.object({
  name: z.string().trim().min(1, 'Введите название группы')
})

// Тип данных формы выводится из схемы
export type CreateGroupFormValues = z.infer<typeof createGroupSchema>
