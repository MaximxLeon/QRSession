export type Group = {
  id: string
  name: string
  curator: {
    id: string
    fullName: string
  } | null
  _count: {
    students: number
  }
}
