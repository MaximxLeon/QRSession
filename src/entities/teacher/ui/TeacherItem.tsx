import type { Teacher } from '../model/types'

type TeacherItemProps = {
  teacher: Teacher
}

export function TeacherItem({ teacher }: TeacherItemProps) {
  return (
    <div className="flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center">
      <div>
        <p className="font-medium text-heading">{teacher.fullName}</p>

        <p className="text-sm text-text-muted">Логин: {teacher.login}</p>
      </div>

      <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
        Преподаватель
      </span>
    </div>
  )
}
