'use client'

import { useSchedule } from '@/entities/schedule'
import { ScheduleCreateForm } from '@/features/admin/create-schedule'

import { ScheduleList } from './ScheduleList'

export function ScheduleManager() {
  const { data: schedules = [], isLoading, isError } = useSchedule()

  return (
    <div className="flex flex-col gap-6">
      <ScheduleCreateForm />

      <ScheduleList
        schedules={schedules}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  )
}
