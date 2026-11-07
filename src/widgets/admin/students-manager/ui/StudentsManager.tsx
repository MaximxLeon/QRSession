'use client'

import { useStudents } from '@/entities/student'
import { StudentCreateForm } from '@/features/admin/create-student'

import { StudentsList } from './StudentsList'

export function StudentsManager() {
  // Получаем список студентов
  const { data: students = [], isLoading, isError } = useStudents()

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-bold text-heading">Студенты</h1>

        <p className="mt-1 text-sm text-text-muted">
          Добавление студентов и управление их учётными записями
        </p>
      </div>

      {/* Форма создания */}
      <StudentCreateForm />

      {/* Список студентов */}
      <StudentsList
        students={students}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  )
}
