import { Suspense } from 'react'

import { redirect } from 'next/navigation'

import { LoginForm } from '@/features/auth/login'
import { getCurrentUser } from '@/server/auth'

// Определяем главную страницу пользователя
function getRoleHome(role: string) {
  switch (role) {
    case 'ADMIN':
      return '/admin'
    case 'TEACHER':
      return '/teacher'
    case 'STUDENT':
      return '/student'
    default:
      return '/login'
  }
}

// Проверяем авторизацию внутри Suspense
async function LoginGuard() {
  const user = await getCurrentUser()

  if (user) {
    redirect(getRoleHome(user.role))
  }

  return <LoginForm />
}

// Страница авторизации
export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 py-10">
      {/* Декоративные фоновые элементы */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <Suspense
          fallback={
            <div className="flex min-h-105 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
                <p className="text-sm text-text-muted">Загрузка...</p>
              </div>
            </div>
          }
        >
          <LoginGuard />
        </Suspense>

        <p className="mt-6 text-center text-xs text-text-muted">
          Система учёта посещаемости университета
        </p>
      </div>
    </main>
  )
}
