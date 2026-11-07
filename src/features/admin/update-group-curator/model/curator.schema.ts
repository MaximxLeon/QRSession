import { z } from 'zod'

export const curatorSchema = z.object({
  curatorId: z.string()
})

export type CuratorFormValues = z.infer<typeof curatorSchema>
