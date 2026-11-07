import type { Subject } from '../model/types'

type SubjectItemProps = {
  subject: Subject
}

export function SubjectItem({ subject }: SubjectItemProps) {
  return (
    <div className="flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center">
      <p className="font-medium text-heading">{subject.name}</p>

      <span className="text-sm text-text-muted">
        Код: {subject.code || 'Не указан'}
      </span>
    </div>
  )
}
