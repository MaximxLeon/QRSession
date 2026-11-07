'use client'

import { useSubjects } from '@/entities/subject'
import { SubjectCreateForm } from '@/features/admin/create-subject'

import { SubjectsList } from './SubjectsList'

export function SubjectsManager() {
  const { data: subjects = [], isLoading, isError } = useSubjects()

  return (
    <div className="flex flex-col gap-6">
      <SubjectCreateForm />

      <SubjectsList
        subjects={subjects}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  )
}
