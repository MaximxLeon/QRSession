import { type Student, StudentItem } from '@/entities/student'

type StudentsListProps = {
  students: Student[]
  isLoading: boolean
  isError: boolean
}

export function StudentsList({
  students,
  isLoading,
  isError
}: StudentsListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Заголовок списка */}
      <div className="border-b border-border-light p-5">
        <h2 className="font-semibold text-heading">Список студентов</h2>
      </div>

      {isLoading ? (
        <p className="p-5 text-text-muted">Загрузка...</p>
      ) : isError ? (
        <p className="p-5 text-danger-text">Не удалось загрузить студентов</p>
      ) : students.length === 0 ? (
        <p className="p-5 text-text-muted">Студентов пока нет</p>
      ) : (
        <div className="divide-y divide-border-light">
          {students.map(student => (
            <StudentItem
              key={student.id}
              student={student}
            />
          ))}
        </div>
      )}
    </div>
  )
}
