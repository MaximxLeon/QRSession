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
    <Suspense fallback={<div className="p-6">Загрузка...</div>}>
      <AdminGuard>
        <div className="min-h-screen bg-background lg:flex lg:h-screen lg:min-h-0 lg:overflow-hidden">
          <Sidebar
            title="QRSession"
            subtitle="Панель администратора"
            items={adminMenu}
          />

          <main className="min-w-0 flex-1 p-6 md:p-8 lg:overflow-y-auto">
            {children}
          </main>
        </div>
      </AdminGuard>
    </Suspense>
  )
}
