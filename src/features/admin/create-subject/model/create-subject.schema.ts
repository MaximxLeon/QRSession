import { z } from 'zod'

export const createSubjectSchema = z.object({
  name: z.string().trim().min(1, 'Введите название предмета'),
  code: z.string().trim()
})

export type CreateSubjectFormValues = z.infer<typeof createSubjectSchema>
