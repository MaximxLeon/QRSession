import { Suspense } from 'react'

import { requireRole } from '@/server/auth'
import { teacherMenu } from '@/widgets/sidebar/config'
import { Sidebar } from '@/widgets/sidebar/ui'

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
        <div className="min-h-screen bg-background lg:flex lg:h-screen lg:min-h-0 lg:overflow-hidden">
          <Sidebar
            title="QRSession"
            subtitle="Панель преподавателя"
            items={teacherMenu}
          />

          <main className="min-w-0 flex-1 p-6 md:p-8 lg:overflow-y-auto">
            {children}
          </main>
        </div>
      </TeacherGuard>
    </Suspense>
  )
}
