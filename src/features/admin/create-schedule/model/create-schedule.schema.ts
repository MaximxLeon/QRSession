import { z } from 'zod'

export const createScheduleSchema = z
  .object({
    groupId: z.string().min(1, 'Выберите группу'),
    subjectId: z.string().min(1, 'Выберите предмет'),
    teacherId: z.string().min(1, 'Выберите преподавателя'),

    dayOfWeek: z.enum([
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY'
    ]),

    startTime: z.string().min(1, 'Укажите время начала'),
    endTime: z.string().min(1, 'Укажите время окончания'),

    classroom: z.string().trim().min(1, 'Укажите аудиторию'),

    validFrom: z.string().min(1, 'Укажите дату начала'),
    validTo: z.string()
  })
  .refine(data => data.startTime < data.endTime, {
    message: 'Время окончания должно быть позже времени начала',
    path: ['endTime']
  })
  .refine(data => !data.validTo || data.validTo >= data.validFrom, {
    message: 'Дата окончания не может быть раньше даты начала',
    path: ['validTo']
  })

export type CreateScheduleFormValues = z.infer<typeof createScheduleSchema>
