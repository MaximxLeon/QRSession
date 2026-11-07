import { AttendanceScanner } from '@/features/student/attendance/ui'

export default function StudentAttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Посещаемость</h1>
        <p className="text-gray-500">Отметь своё присутствие на занятии.</p>
      </div>

      <AttendanceScanner />
    </div>
  )
}
