import type { Group } from '@/entities/group'
import { GroupItem } from '@/entities/group'

type GroupsListProps = {
  groups: Group[]
  isLoading: boolean
  isError: boolean
  renderActions: (group: Group) => React.ReactNode
}

export function GroupsList({
  groups,
  isLoading,
  isError,
  renderActions
}: GroupsListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {isLoading ? (
        <p className="p-5 text-text-muted">Загрузка...</p>
      ) : isError ? (
        <p className="p-5 text-danger-text">Не удалось загрузить группы</p>
      ) : groups.length === 0 ? (
        <p className="p-5 text-text-muted">Групп пока нет</p>
      ) : (
        <div className="divide-y divide-border-light">
          {groups.map(group => (
            <GroupItem
              key={group.id}
              group={group}
            >
              {renderActions(group)}
            </GroupItem>
          ))}
        </div>
      )}
    </div>
  )
}
