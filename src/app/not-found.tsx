import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative w-full max-w-lg text-center">
        <div className="relative mb-6">
          <span className="select-none text-[160px] font-black leading-none tracking-tighter text-primary/10 sm:text-[200px]">
            404
          </span>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-extrabold tracking-tight text-primary">
              404
            </span>
          </div>
        </div>

        <h1 className="mb-3 text-2xl font-bold text-heading sm:text-3xl">
          Страница не найдена
        </h1>

        <p className="mx-auto mb-9 max-w-sm text-sm leading-6 text-text-muted sm:text-base">
          Похоже, такой страницы не существует или она была перемещена.
          Проверьте адрес или вернитесь на главную.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          На главную
        </Link>

        <p className="mt-16 text-xs text-text-muted">
          Attendance · University system
        </p>
      </div>
    </main>
  )
}
