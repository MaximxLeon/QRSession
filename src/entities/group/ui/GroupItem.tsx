import type { Group } from '../model/types'

type GroupItemProps = {
  group: Group
  children?: React.ReactNode
}

export function GroupItem({ group, children }: GroupItemProps) {
  return (
    <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
      {/* Информация о группе */}
      <div>
        <h2 className="font-semibold text-heading">{group.name}</h2>

        <p className="text-sm text-text-muted">
          Студентов: {group._count.students}
        </p>
      </div>

      {/* Дополнительные действия с группой */}
      {children}
    </div>
  )
}
