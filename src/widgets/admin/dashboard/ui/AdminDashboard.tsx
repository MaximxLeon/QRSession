'use client'

import { useState } from 'react'

type Period = 'week' | 'month' | 'semester' | 'custom'

type Threshold = 'all' | '50' | '60' | '70' | '75' | '80' | '90'

const statistics = [
  { title: 'Всего студентов', value: '—', description: 'Активные студенты' },
  { title: 'Учебных групп', value: '—', description: 'Активные группы' },
  {
    title: 'Проведено занятий',
    value: '—',
    description: 'За выбранный период'
  },
  { title: 'Средняя посещаемость', value: '—', description: 'По университету' }
]

const thresholdOptions = [
  { value: 'all', label: 'Все студенты' },
  { value: '50', label: 'Ниже 50%' },
  { value: '60', label: 'Ниже 60%' },
  { value: '70', label: 'Ниже 70%' },
  { value: '75', label: 'Ниже 75%' },
  { value: '80', label: 'Ниже 80%' },
  { value: '90', label: 'Ниже 90%' }
]

export function AdminDashboard() {
  const [period, setPeriod] = useState<Period>('month')
  const [threshold, setThreshold] = useState<Threshold>('all')

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-bold text-heading sm:text-3xl">
          Панель администратора
        </h1>

        <p className="mt-2 text-sm text-text-muted">
          Общая статистика и аналитика посещаемости университета
        </p>
      </div>

      {/* Фильтры */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4">
          <h2 className="font-semibold text-heading">Фильтры аналитики</h2>
          <p className="mt-1 text-sm text-text-muted">
            Настройте период и минимальный порог посещаемости
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="dashboard-period"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Учебный период
            </label>

            <select
              id="dashboard-period"
              value={period}
              onChange={event => setPeriod(event.target.value as Period)}
              className="w-full rounded-lg border border-border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="week">Последние 7 дней</option>
              <option value="month">Последние 30 дней</option>
              <option value="semester">Семестр</option>
              <option value="custom">Произвольный период</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="dashboard-threshold"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Порог посещаемости
            </label>

            <select
              id="dashboard-threshold"
              value={threshold}
              onChange={event => setThreshold(event.target.value as Threshold)}
              className="w-full rounded-lg border border-border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              {thresholdOptions.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {period === 'custom' && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                С
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-border-input bg-card px-3 py-2.5 text-sm text-foreground"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                По
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-border-input bg-card px-3 py-2.5 text-sm text-foreground"
              />
            </div>
          </div>
        )}
      </section>

      {/* Общая статистика */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-heading">
          Общая статистика
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map(item => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <p className="text-sm text-text-muted">{item.title}</p>

              <p className="mt-3 text-3xl font-bold text-heading">
                {item.value}
              </p>

              <p className="mt-2 text-xs text-text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Динамика посещаемости */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <div>
          <h2 className="text-lg font-semibold text-heading">
            Динамика посещаемости
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Изменение процента посещаемости за выбранный период
          </p>
        </div>

        <div className="flex min-h-64 items-center justify-center">
          <p className="text-sm text-text-muted">
            Здесь будет график посещаемости
          </p>
        </div>
      </section>

      {/* Нижние блоки */}
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-heading">
            Посещаемость по группам
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Сравнение групп по проценту посещаемости
          </p>

          <div className="flex min-h-52 items-center justify-center">
            <p className="text-sm text-text-muted">Здесь будет рейтинг групп</p>
          </div>
        </section>

        {/* Посещаемость по предметам */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <div>
            <h2 className="text-lg font-semibold text-heading">
              Посещаемость по предметам
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Сравнение посещаемости по учебным дисциплинам
            </p>
          </div>

          <div className="mt-5 flex min-h-52 items-center justify-center">
            <p className="text-sm text-text-muted">
              Здесь будет рейтинг предметов
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-heading">
            Студенты с низкой посещаемостью
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Студенты, не достигшие выбранного порога
          </p>

          <div className="flex min-h-52 items-center justify-center">
            <p className="text-sm text-text-muted">
              Здесь будет список студентов
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
