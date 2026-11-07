import { Suspense } from 'react'

import { requireAuth } from '@/server/auth'

async function AuthGuard({ children }: { children: React.ReactNode }) {
  await requireAuth()

  return <>{children}</>
}

export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  )
}
