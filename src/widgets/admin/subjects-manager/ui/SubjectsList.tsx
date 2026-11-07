import type { Subject } from '@/entities/subject'
import { SubjectItem } from '@/entities/subject'

type SubjectsListProps = {
  subjects: Subject[]
  isLoading: boolean
  isError: boolean
}

export function SubjectsList({
  subjects,
  isLoading,
  isError
}: SubjectsListProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-text-muted">Загрузка предметов...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-danger/20 bg-danger-bg p-5">
        <p className="text-sm text-danger-text">
          Не удалось загрузить список предметов.
        </p>
      </div>
    )
  }

  if (subjects.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-text-muted">Предметы пока не добавлены.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border-light px-5 py-4">
        <h2 className="font-semibold text-heading">Список предметов</h2>
        <p className="mt-1 text-sm text-text-muted">
          Всего предметов: {subjects.length}
        </p>
      </div>

      <div className="divide-y divide-border-light">
        {subjects.map(subject => (
          <SubjectItem
            key={subject.id}
            subject={subject}
          />
        ))}
      </div>
    </div>
  )
}
