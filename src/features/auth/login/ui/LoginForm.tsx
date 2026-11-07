'use client'

import { type FormEvent, useState } from 'react'

import { Eye, EyeOff, LockKeyhole, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { loginUser } from '../api/login-api'

export function LoginForm() {
  const router = useRouter()

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const data = await loginUser({ login, password })

      router.push(data.redirect)
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Не удалось подключиться к серверу'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <LockKeyhole size={26} />
        </div>

        <h1 className="text-2xl font-bold text-heading">Вход в систему</h1>

        <p className="mt-2 text-sm text-text-muted">
          Введите логин и пароль для продолжения
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <div>
          <label
            htmlFor="login"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Логин
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-text-muted"
            />

            <input
              id="login"
              type="text"
              value={login}
              onChange={event => setLogin(event.target.value)}
              placeholder="Введите логин"
              autoComplete="username"
              required
              disabled={loading}
              className="w-full rounded-lg border border-border-input bg-input-bg py-3 pr-4 pl-10 text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-focus-ring/20 disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Пароль
          </label>

          <div className="relative">
            <LockKeyhole
              size={18}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-text-muted"
            />

            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="Введите пароль"
              autoComplete="current-password"
              required
              disabled={loading}
              className="w-full rounded-lg border border-border-input bg-input-bg py-3 pr-12 pl-10 text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-focus-ring/20 disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() => setShowPassword(value => !value)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-text-muted transition hover:text-foreground"
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-danger-bg px-4 py-3 text-sm text-danger-text">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !login.trim() || !password}
          className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Выполняется вход...' : 'Войти'}
        </button>
      </form>
    </div>
  )
}
