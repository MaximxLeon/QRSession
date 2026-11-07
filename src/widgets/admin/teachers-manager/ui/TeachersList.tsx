import { type Teacher, TeacherItem } from '@/entities/teacher'

type TeachersListProps = {
  teachers: Teacher[]
  isLoading: boolean
  isError: boolean
}

export function TeachersList({
  teachers,
  isLoading,
  isError
}: TeachersListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Заголовок списка */}
      <div className="border-b border-border-light p-5">
        <h2 className="font-semibold text-heading">Список преподавателей</h2>
      </div>

      {isLoading ? (
        <p className="p-5 text-text-muted">Загрузка...</p>
      ) : isError ? (
        <p className="p-5 text-danger-text">
          Не удалось загрузить преподавателей
        </p>
      ) : teachers.length === 0 ? (
        <p className="p-5 text-text-muted">Преподавателей пока нет</p>
      ) : (
        <div className="divide-y divide-border-light">
          {teachers.map(teacher => (
            <TeacherItem
              key={teacher.id}
              teacher={teacher}
            />
          ))}
        </div>
      )}
    </div>
  )
}
