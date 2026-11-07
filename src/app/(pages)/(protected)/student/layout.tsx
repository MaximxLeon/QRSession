import { Suspense } from 'react'

import { requireRole } from '@/server/auth'
import { studentMenu } from '@/widgets/sidebar/config'
import { Sidebar } from '@/widgets/sidebar/ui'

// Проверяем, что пользователь авторизован и имеет роль студента.
async function StudentGuard({ children }: { children: React.ReactNode }) {
  await requireRole(['STUDENT'])

  return <>{children}</>
}

export default function StudentLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<div className="p-6">Загрузка...</div>}>
      <StudentGuard>
        <div className="min-h-screen bg-slate-100 md:flex">
          <Sidebar
            title="Attendance"
            subtitle="Панель студента"
            items={studentMenu}
          />

          <main className="min-w-0 flex-1 p-6 md:p-8">{children}</main>
        </div>
      </StudentGuard>
    </Suspense>
  )
}
