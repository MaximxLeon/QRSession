import { Suspense } from 'react'

import { requireRole } from '@/server/auth'
import { studentMenu } from '@/widgets/sidebar/config'
import { Sidebar } from '@/widgets/sidebar/ui'

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
        <div className="min-h-screen bg-background lg:flex lg:h-screen lg:min-h-0 lg:overflow-hidden">
          <Sidebar
            title="QRSession"
            subtitle="Панель студента"
            items={studentMenu}
          />

          <main className="min-w-0 flex-1 p-6 md:p-8 lg:overflow-y-auto">
            {children}
          </main>
        </div>
      </StudentGuard>
    </Suspense>
  )
}
