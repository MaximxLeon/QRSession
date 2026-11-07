import { AttendanceAnalytics } from '@/widgets/student/attendance-analytics'

export default function StudentAttendancePage() {
  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-heading sm:text-3xl">
          Моя посещаемость
        </h1>

        <p className="mt-2 text-sm text-text-muted">
          Статистика посещения занятий и пропусков
        </p>
      </div>

      <AttendanceAnalytics />
    </main>
  )
}
