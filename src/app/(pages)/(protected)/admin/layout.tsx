import { Suspense } from 'react'

import { requireRole } from '@/server/auth'
import { adminMenu } from '@/widgets/sidebar/config/admin-menu'
import { Sidebar } from '@/widgets/sidebar/ui'

async function AdminGuard({ children }: { children: React.ReactNode }) {
  await requireRole(['ADMIN'])

  return <>{children}</>
}

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <AdminGuard>
        <div className="min-h-screen bg-slate-100 md:flex">
          <Sidebar
            title="Attendance"
            subtitle="Панель администратора"
            items={adminMenu}
          />

          <main className="min-w-0 flex-1 p-6 md:p-8">{children}</main>
        </div>
      </AdminGuard>
    </Suspense>
  )
}
