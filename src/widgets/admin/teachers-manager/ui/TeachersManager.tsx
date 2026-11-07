'use client'

import { useTeachers } from '@/entities/teacher'
import { TeacherCreateForm } from '@/features/admin/create-teacher'

import { TeachersList } from './TeachersList'

export function TeachersManager() {
  // Получаем список преподавателей
  const { data: teachers = [], isLoading, isError } = useTeachers()

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-bold text-heading">Преподаватели</h1>

        <p className="mt-1 text-sm text-text-muted">
          Создание и управление учётными записями преподавателей
        </p>
      </div>

      {/* Форма создания */}
      <TeacherCreateForm />

      {/* Список преподавателей */}
      <TeachersList
        teachers={teachers}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  )
}
