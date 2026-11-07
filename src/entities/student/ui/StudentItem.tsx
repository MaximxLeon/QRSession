import type { Student } from '../model/types'

type StudentItemProps = {
  student: Student
}

export function StudentItem({ student }: StudentItemProps) {
  return (
    <div className="flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center">
      {/* Информация о студенте */}
      <div>
        <p className="font-medium text-heading">{student.user.fullName}</p>

        <p className="text-sm text-text-muted">Логин: {student.user.login}</p>
      </div>

      {/* Информация о группе */}
      <div className="text-sm text-text-muted sm:text-right">
        <p>Группа: {student.group.name}</p>

        <p>Студенческий билет: {student.studentNumber || 'Не указан'}</p>
      </div>
    </div>
  )
}
