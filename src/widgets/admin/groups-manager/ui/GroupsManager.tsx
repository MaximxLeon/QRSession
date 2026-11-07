'use client'

import { useGroups } from '@/entities/group'
import { useTeachers } from '@/entities/teacher'
import { GroupCreateForm } from '@/features/admin/create-group'
import { DeleteGroupButton } from '@/features/admin/delete-group'
import { CuratorSelect } from '@/features/admin/update-group-curator'

import { GroupsList } from './GroupsList'

export function GroupsManager() {
  // Получаем группы и преподавателей
  const { data: groups = [], isLoading, isError } = useGroups()

  const { data: teachers = [], isLoading: teachersLoading } = useTeachers()

  return (
    <div className="space-y-6">
      {/* Заголовок виджета */}
      <div>
        <h1 className="text-2xl font-bold text-heading">Учебные группы</h1>

        <p className="mt-1 text-sm text-text-muted">
          Создание и управление учебными группами
        </p>
      </div>

      {/* Создание группы */}
      <GroupCreateForm />

      {/* Список групп */}
      <GroupsList
        groups={groups}
        isLoading={isLoading}
        isError={isError}
        renderActions={group => (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            {/* Назначение куратора */}
            <CuratorSelect
              groupId={group.id}
              curatorId={group.curator?.id ?? null}
              teachers={teachers}
              teachersLoading={teachersLoading}
            />

            {/* Удаление группы */}
            <DeleteGroupButton
              groupId={group.id}
              groupName={group.name}
            />
          </div>
        )}
      />
    </div>
  )
}
