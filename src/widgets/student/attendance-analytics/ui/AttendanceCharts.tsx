'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import type { AttendanceAnalytics as AttendanceAnalyticsType } from '@/entities/student-attendance'

type Props = {
  data: AttendanceAnalyticsType
}

const chartColor = 'var(--primary)'
const successColor = 'var(--success)'
const dangerColor = 'var(--danger)'
const mutedColor = 'var(--text-muted)'

const tooltipStyle = {
  backgroundColor: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  color: 'var(--foreground)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
}

function ChartEmpty() {
  return (
    <div className="flex h-70 items-center justify-center">
      <p className="text-sm text-text-muted">
        Пока недостаточно данных для графика
      </p>
    </div>
  )
}

function ChartCard({
  title,
  description,
  children
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="font-semibold text-heading">{title}</h3>
        <p className="mt-1 text-xs text-text-muted">{description}</p>
      </div>

      {children}
    </section>
  )
}

export function AttendanceCharts({ data }: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {/* Посещаемость по предметам */}
      <ChartCard
        title="Посещаемость по предметам"
        description="Процент посещённых занятий по каждому предмету"
      >
        {data.bySubject.length === 0 ? (
          <ChartEmpty />
        ) : (
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={data.bySubject}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                stroke="var(--border-light)"
                strokeDasharray="3 3"
                horizontal={false}
              />

              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={value => `${value}%`}
                tick={{ fill: mutedColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                type="category"
                dataKey="subjectName"
                width={110}
                tick={{ fill: 'var(--foreground)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={tooltipStyle}
                formatter={value => [`${value}%`, 'Посещаемость']}
              />

              <Bar
                dataKey="rate"
                fill={chartColor}
                radius={[0, 8, 8, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Динамика посещаемости */}
      <ChartCard
        title="Динамика посещаемости"
        description="Изменение процента посещаемости по периодам"
      >
        {data.byPeriod.length === 0 ? (
          <ChartEmpty />
        ) : (
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <LineChart
              data={data.byPeriod}
              margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                stroke="var(--border-light)"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="period"
                tick={{ fill: mutedColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tickFormatter={value => `${value}%`}
                tick={{ fill: mutedColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={tooltipStyle}
                formatter={value => [`${value}%`, 'Посещаемость']}
              />

              <Line
                type="monotone"
                dataKey="rate"
                name="Посещаемость"
                stroke={chartColor}
                strokeWidth={3}
                dot={{ r: 4, fill: chartColor, strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* По дням недели */}
      <ChartCard
        title="Посещаемость по дням недели"
        description="Сравнение посещённых и пропущенных занятий"
      >
        {data.byWeekday.length === 0 ? (
          <ChartEmpty />
        ) : (
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={data.byWeekday}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                stroke="var(--border-light)"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                tick={{ fill: mutedColor, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fill: mutedColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip contentStyle={tooltipStyle} />

              <Bar
                dataKey="attended"
                name="Посещено"
                stackId="attendance"
                fill={successColor}
                radius={[0, 0, 0, 0]}
              />

              <Bar
                dataKey="absent"
                name="Пропущено"
                stackId="attendance"
                fill={dangerColor}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        <div className="mt-3 flex justify-center gap-5">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="h-2.5 w-2.5 rounded-full bg-success" />
            Посещено
          </div>

          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="h-2.5 w-2.5 rounded-full bg-danger" />
            Пропущено
          </div>
        </div>
      </ChartCard>

      {/* По времени */}
      <ChartCard
        title="Посещаемость по времени"
        description="Количество занятий в зависимости от времени начала"
      >
        {data.byTime.length === 0 ? (
          <ChartEmpty />
        ) : (
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={data.byTime}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                stroke="var(--border-light)"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tick={{ fill: mutedColor, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fill: mutedColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip contentStyle={tooltipStyle} />

              <Bar
                dataKey="attended"
                name="Посещено"
                fill={successColor}
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />

              <Bar
                dataKey="absent"
                name="Пропущено"
                fill={dangerColor}
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  )
}
