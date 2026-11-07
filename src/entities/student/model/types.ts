export type Student = {
  id: string
  studentNumber: string | null
  isHead?: boolean

  user: {
    id: string
    fullName: string
    login: string
    isActive: boolean
  }

  group: {
    id: string
    name: string
  }
}
