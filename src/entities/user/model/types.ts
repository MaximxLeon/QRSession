export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT'

export type User = {
  id: string
  fullName: string
  login: string
  role: UserRole
}
