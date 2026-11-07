import { Suspense } from 'react'

import { requireRole } from '@/server/auth'
import { teacherMenu } from '@/widgets/sidebar/config'
import { Sidebar } from '@/widgets/sidebar/ui'

// Проверяем, что пользователь авторизован и имеет роль преподавателя.
async function TeacherGuard({ children }: { children: React.ReactNode }) {
  await requireRole(['TEACHER'])

  return <>{children}</>
}

export default function TeacherLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<div className="p-6">Загрузка...</div>}>
      <TeacherGuard>
        <div className="min-h-screen bg-slate-100 md:flex">
          <Sidebar
            title="Attendance"
            subtitle="Панель преподавателя"
            items={teacherMenu}
          />

          <main className="min-w-0 flex-1 p-6 md:p-8">{children}</main>
        </div>
      </TeacherGuard>
    </Suspense>
  )
}
