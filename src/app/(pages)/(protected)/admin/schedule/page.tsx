import { ScheduleManager } from '@/widgets/admin/schedule-manager'

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">Расписание</h1>

        <p className="mt-1 text-sm text-text-muted">
          Создание и просмотр расписания занятий
        </p>
      </div>

      <ScheduleManager />
    </div>
  )
}
