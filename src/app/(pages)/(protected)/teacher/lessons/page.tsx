import { TeacherLessons } from '@/widgets/teacher/teacher-lessons'

export default function TeacherLessonsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Мои занятия</h1>

      <TeacherLessons />
    </div>
  )
}
