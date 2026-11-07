'use client'

import { useMemo, useState } from 'react'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { useAdminAnalytics } from '@/entities/admin-analytics'

type Period = 'week' | 'month' | 'semester' | 'year'
type SubjectTab = 'summary' | 'groups' | 'students'

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getPeriodDates(period: Period) {
  const today = new Date()
  const from = new Date(today)

  if (period === 'week') {
    from.setDate(today.getDate() - 6)
  } else if (period === 'month') {
    from.setDate(1)
  } else if (period === 'semester') {
    from.setMonth(today.getMonth() - 5, 1)
  } else {
    from.setMonth(0, 1)
  }

  return {
    from: formatDate(from),
    to: formatDate(today)
  }
}

function formatPercent(value: number) {
  return `${Number(value || 0).toFixed(1)}%`
}

function getRateColor(rate: number) {
  if (rate < 60) return 'text-danger-text'
  if (rate < 75) return 'text-warning'
  if (rate < 90) return 'text-secondary'
  return 'text-success'
}

function RateBar({ rate }: { rate: number }) {
  const color =
    rate < 60
      ? 'bg-danger'
      : rate < 75
        ? 'bg-warning'
        : rate < 90
          ? 'bg-secondary'
          : 'bg-success'

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 min-w-20 flex-1 overflow-hidden rounded-full bg-muted-bg">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.min(Math.max(rate, 0), 100)}%` }}
        />
      </div>
      <span
        className={`w-14 text-right text-sm font-semibold ${getRateColor(rate)}`}
      >
        {formatPercent(rate)}
      </span>
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  accent
}: {
  title: string
  value: string | number
  description: string
  accent?: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm font-medium text-text-muted">{title}</p>
      <p className={`mt-3 text-3xl font-bold ${accent || 'text-heading'}`}>
        {value}
      </p>
      <p className="mt-2 text-xs text-text-muted">{description}</p>
    </div>
  )
}

function Section({
  title,
  description,
  children
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-heading">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-text-muted">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

export default function AdminPage() {
  const [period, setPeriod] = useState<Period>('month')
  const [threshold, setThreshold] = useState(75)
  const [subjectTab, setSubjectTab] = useState<SubjectTab>('summary')
  const [selectedSubjectId, setSelectedSubjectId] = useState('')

  const dates = useMemo(() => getPeriodDates(period), [period])

  const { data, isLoading, isError, error } = useAdminAnalytics({
    ...dates,
    threshold
  })

  const selectedSubject =
    data?.bySubject.find(subject => subject.subjectId === selectedSubjectId) ??
    data?.bySubject[0]

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-sm font-medium text-text-muted">
          Загружаем аналитику...
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-danger/20 bg-danger-bg p-6">
        <h2 className="font-semibold text-danger-text">
          Не удалось загрузить аналитику
        </h2>
        <p className="mt-2 text-sm text-danger-text">
          {error instanceof Error ? error.message : 'Неизвестная ошибка'}
        </p>
      </div>
    )
  }

  const { summary } = data

  return (
    <div className="space-y-6 pb-10">
      {/* Заголовок и фильтры */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-heading">
            Аналитика университета
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Общая статистика успеваемости и посещаемости
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value as Period)}
            className="rounded-xl border border-border-input bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="week">Последние 7 дней</option>
            <option value="month">Текущий месяц</option>
            <option value="semester">Последние 6 месяцев</option>
            <option value="year">Текущий год</option>
          </select>

          <select
            value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
            className="rounded-xl border border-border-input bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          >
            <option value={50}>Порог: 50%</option>
            <option value={60}>Порог: 60%</option>
            <option value={70}>Порог: 70%</option>
            <option value={75}>Порог: 75%</option>
            <option value={80}>Порог: 80%</option>
            <option value={90}>Порог: 90%</option>
          </select>
        </div>
      </div>

      <div className="text-xs text-text-muted">
        Период: {dates.from} — {dates.to}
      </div>

      {/* Основные показатели */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Студенты"
          value={summary.totalStudents}
          description="Активных студентов"
        />
        <StatCard
          title="Учебные группы"
          value={summary.totalGroups}
          description="Всего групп в системе"
        />
        <StatCard
          title="Преподаватели"
          value={summary.totalTeachers}
          description="Активных преподавателей"
        />
        <StatCard
          title="Предметы"
          value={summary.totalSubjects}
          description="Дисциплин в системе"
        />
        <StatCard
          title="Проведено занятий"
          value={summary.completedLessons}
          description="За выбранный период"
        />
        <StatCard
          title="Средняя посещаемость"
          value={formatPercent(summary.rate)}
          description="По всем проведённым занятиям"
          accent={getRateColor(summary.rate)}
        />
        <StatCard
          title="Присутствовали"
          value={summary.attended}
          description="Отметки PRESENT и LATE"
          accent="text-success"
        />
        <StatCard
          title="Отсутствовали"
          value={summary.absent}
          description="Неявки за период"
          accent="text-danger-text"
        />
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Section
          title="Посещаемость по дням недели"
          description="Процент присутствия студентов на занятиях"
        >
          {data.byWeekday.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={data.byWeekday}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={value => [
                      `${Number(value).toFixed(1)}%`,
                      'Посещаемость'
                    ]}
                  />
                  <Bar
                    dataKey="rate"
                    fill="var(--secondary)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-text-muted">
              Нет данных за выбранный период
            </p>
          )}
        </Section>

        <Section
          title="Посещаемость по времени"
          description="Сравнение посещаемости в разные часы начала занятий"
        >
          {data.byTime.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart data={data.byTime}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                  />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={value => [
                      `${Number(value).toFixed(1)}%`,
                      'Посещаемость'
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="var(--primary)"
                    fill="var(--primary-light)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-text-muted">
              Нет данных за выбранный период
            </p>
          )}
        </Section>
      </div>

      {/* Группы */}
      <Section
        title="Посещаемость по группам"
        description="Рейтинг групп по проценту посещаемости"
      >
        {data.byGroup.length > 0 ? (
          <div className="space-y-5">
            {[...data.byGroup]
              .sort((a, b) => b.rate - a.rate)
              .map(group => (
                <div
                  key={group.groupId}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-[160px_1fr_110px] sm:items-center"
                >
                  <span className="font-medium text-heading">
                    {group.groupName}
                  </span>
                  <RateBar rate={group.rate} />
                  <span className="text-xs text-text-muted sm:text-right">
                    {group.lessonsCount} занятий
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-text-muted">
            За этот период ещё нет завершённых занятий
          </p>
        )}
      </Section>

      {/* Аналитика предметов */}
      <Section
        title="Аналитика по предметам"
        description="Сравнение посещаемости дисциплин, групп и студентов"
      >
        {data.bySubject.length > 0 ? (
          <div className="space-y-5">
            <select
              value={selectedSubject?.subjectId ?? ''}
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="w-full max-w-sm rounded-xl border border-border-input bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              {data.bySubject.map(subject => (
                <option
                  key={subject.subjectId}
                  value={subject.subjectId}
                >
                  {subject.subjectName}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2 border-b border-border pb-3">
              {(
                [
                  ['summary', 'Общая статистика'],
                  ['groups', 'По группам'],
                  ['students', 'По студентам']
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setSubjectTab(value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    subjectTab === value
                      ? 'bg-primary text-white'
                      : 'bg-muted-bg text-foreground hover:bg-primary-light'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {selectedSubject && subjectTab === 'summary' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-muted-bg p-4">
                  <p className="text-sm text-text-muted">Посещаемость</p>
                  <p
                    className={`mt-2 text-2xl font-bold ${getRateColor(selectedSubject.rate)}`}
                  >
                    {formatPercent(selectedSubject.rate)}
                  </p>
                </div>
                <div className="rounded-xl bg-muted-bg p-4">
                  <p className="text-sm text-text-muted">Занятий</p>
                  <p className="mt-2 text-2xl font-bold text-heading">
                    {selectedSubject.lessonsCount}
                  </p>
                </div>
                <div className="rounded-xl bg-muted-bg p-4">
                  <p className="text-sm text-text-muted">Отсутствия</p>
                  <p className="mt-2 text-2xl font-bold text-danger-text">
                    {selectedSubject.absent}
                  </p>
                </div>
              </div>
            )}

            {selectedSubject && subjectTab === 'groups' && (
              <div className="space-y-4">
                {selectedSubject.groups.length > 0 ? (
                  selectedSubject.groups
                    .slice()
                    .sort((a, b) => b.rate - a.rate)
                    .map(group => (
                      <div
                        key={group.groupId}
                        className="grid grid-cols-1 gap-2 sm:grid-cols-[160px_1fr]"
                      >
                        <span className="text-sm font-medium text-heading">
                          {group.groupName}
                        </span>
                        <RateBar rate={group.rate} />
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-text-muted">
                    Нет данных по группам
                  </p>
                )}
              </div>
            )}

            {selectedSubject && subjectTab === 'students' && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-125 text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-text-muted">
                      <th className="pb-3 pr-4 font-medium">Студент</th>
                      <th className="pb-3 pr-4 font-medium">Группа</th>
                      <th className="pb-3 pr-4 font-medium">Занятий</th>
                      <th className="pb-3 font-medium">Посещаемость</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSubject.students
                      .slice()
                      .sort((a, b) => a.rate - b.rate)
                      .map(student => (
                        <tr
                          key={student.id}
                          className="border-b border-border-light last:border-0"
                        >
                          <td className="py-3 pr-4 font-medium text-heading">
                            {student.fullName}
                          </td>
                          <td className="py-3 pr-4 text-text-muted">
                            {student.groupName}
                          </td>
                          <td className="py-3 pr-4 text-text-muted">
                            {student.lessonsCount}
                          </td>
                          <td className="py-3">
                            <RateBar rate={student.rate} />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-text-muted">
            Нет данных по предметам за выбранный период
          </p>
        )}
      </Section>

      {/* Преподаватели */}
      <Section
        title="Аналитика преподавателей"
        description="Количество проведённых занятий и посещаемость студентов"
      >
        {data.byTeacher.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-125 text-left text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="pb-3 pr-4 font-medium">Преподаватель</th>
                  <th className="pb-3 pr-4 font-medium">Занятий</th>
                  <th className="pb-3 pr-4 font-medium">
                    Студенческих отметок
                  </th>
                  <th className="pb-3 font-medium">Посещаемость</th>
                </tr>
              </thead>
              <tbody>
                {data.byTeacher
                  .slice()
                  .sort((a, b) => b.rate - a.rate)
                  .map(teacher => (
                    <tr
                      key={teacher.teacherId}
                      className="border-b border-border-light last:border-0"
                    >
                      <td className="py-3 pr-4 font-medium text-heading">
                        {teacher.teacherName}
                      </td>
                      <td className="py-3 pr-4 text-text-muted">
                        {teacher.lessonsCount}
                      </td>
                      <td className="py-3 pr-4 text-text-muted">
                        {teacher.total}
                      </td>
                      <td className="py-3">
                        <RateBar rate={teacher.rate} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-text-muted">
            Нет данных по преподавателям
          </p>
        )}
      </Section>

      {/* Студенты с низкой посещаемостью */}
      <Section
        title="Студенты с низкой посещаемостью"
        description={`Студенты, у которых посещаемость ниже ${threshold}%`}
      >
        {data.lowAttendanceStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-125 text-left text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="pb-3 pr-4 font-medium">Студент</th>
                  <th className="pb-3 pr-4 font-medium">Логин</th>
                  <th className="pb-3 pr-4 font-medium">Группа</th>
                  <th className="pb-3 font-medium">Посещаемость</th>
                </tr>
              </thead>
              <tbody>
                {data.lowAttendanceStudents
                  .slice()
                  .sort((a, b) => a.rate - b.rate)
                  .map(student => (
                    <tr
                      key={student.id}
                      className="border-b border-border-light last:border-0"
                    >
                      <td className="py-3 pr-4 font-medium text-heading">
                        {student.fullName}
                      </td>
                      <td className="py-3 pr-4 text-text-muted">
                        {student.login}
                      </td>
                      <td className="py-3 pr-4 text-text-muted">
                        {student.groupName}
                      </td>
                      <td className="py-3">
                        <RateBar rate={student.rate} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-text-muted">
            Нет студентов ниже выбранного порога
          </p>
        )}
      </Section>

      {/* Последние занятия */}
      <Section
        title="Последние проведённые занятия"
        description="Статистика по отдельным занятиям за выбранный период"
      >
        {data.lessons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-175 text-left text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="pb-3 pr-4 font-medium">Дата</th>
                  <th className="pb-3 pr-4 font-medium">Предмет</th>
                  <th className="pb-3 pr-4 font-medium">Группа</th>
                  <th className="pb-3 pr-4 font-medium">Время</th>
                  <th className="pb-3 pr-4 font-medium">Присутствовали</th>
                  <th className="pb-3 font-medium">Посещаемость</th>
                </tr>
              </thead>
              <tbody>
                {data.lessons.slice(0, 15).map(lesson => (
                  <tr
                    key={lesson.id}
                    className="border-b border-border-light last:border-0"
                  >
                    <td className="py-3 pr-4 text-text-muted">
                      {new Date(lesson.date).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="py-3 pr-4 font-medium text-heading">
                      {lesson.subjectName}
                    </td>
                    <td className="py-3 pr-4 text-text-muted">
                      {lesson.groupName}
                    </td>
                    <td className="py-3 pr-4 text-text-muted">
                      {lesson.startsAt}–{lesson.endsAt}
                    </td>
                    <td className="py-3 pr-4 text-text-muted">
                      {lesson.attended} / {lesson.total}
                    </td>
                    <td className="py-3">
                      <RateBar rate={lesson.rate} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-text-muted">
            Нет проведённых занятий за выбранный период
          </p>
        )}
      </Section>
    </div>
  )
}
