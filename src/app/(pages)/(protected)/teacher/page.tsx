import { TeacherSchedule } from '@/widgets/teacher/teacher-schedule'

export default function TeacherPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Панель преподавателя
      </h1>

      <TeacherSchedule />
    </div>
  )
}
