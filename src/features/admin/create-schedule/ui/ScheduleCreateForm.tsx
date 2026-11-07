'use client'

import { useForm } from 'react-hook-form'

import { useGroups } from '@/entities/group'
import { useSubjects } from '@/entities/subject'
import { useTeachers } from '@/entities/teacher'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  type CreateScheduleFormValues,
  createScheduleSchema
} from '../model/create-schedule.schema'
import { useCreateSchedule } from '../model/mutations'

const weekDays = [
  { value: 'MONDAY', label: 'Понедельник' },
  { value: 'TUESDAY', label: 'Вторник' },
  { value: 'WEDNESDAY', label: 'Среда' },
  { value: 'THURSDAY', label: 'Четверг' },
  { value: 'FRIDAY', label: 'Пятница' },
  { value: 'SATURDAY', label: 'Суббота' },
  { value: 'SUNDAY', label: 'Воскресенье' }
]

const inputClassName =
  'mt-1 w-full rounded-lg border border-border-input bg-input-bg px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-focus-ring/20'

const labelClassName = 'text-sm font-medium text-foreground'

export function ScheduleCreateForm() {
  const groupsQuery = useGroups()
  const subjectsQuery = useSubjects()
  const teachersQuery = useTeachers()

  const createSchedule = useCreateSchedule()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateScheduleFormValues>({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: {
      groupId: '',
      subjectId: '',
      teacherId: '',
      dayOfWeek: 'MONDAY',
      startTime: '09:00',
      endTime: '10:30',
      classroom: '',
      validFrom: '',
      validTo: ''
    }
  })

  const referencesLoading =
    groupsQuery.isLoading || subjectsQuery.isLoading || teachersQuery.isLoading

  const referencesError =
    groupsQuery.isError || subjectsQuery.isError || teachersQuery.isError

  const onSubmit = async (values: CreateScheduleFormValues) => {
    try {
      await createSchedule.mutateAsync({
        ...values,
        validTo: values.validTo || undefined
      })

      reset()
    } catch {
      // Ошибка отображается ниже через состояние mutation.
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border border-border bg-card p-5 sm:p-6"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-heading">Добавить занятие</h2>

        <p className="mt-1 text-sm text-text-muted">
          Заполните данные для добавления занятия в расписание.
        </p>
      </div>

      {referencesLoading ? (
        <p className="text-sm text-text-muted">Загрузка справочников...</p>
      ) : referencesError ? (
        <div className="rounded-lg bg-danger-bg p-3">
          <p className="text-sm text-danger-text">
            Не удалось загрузить группы, предметы или преподавателей.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Группа */}
            <label className={labelClassName}>
              Группа
              <select
                {...register('groupId')}
                className={inputClassName}
              >
                <option value="">Выберите группу</option>

                {groupsQuery.data?.map(group => (
                  <option
                    key={group.id}
                    value={group.id}
                  >
                    {group.name}
                  </option>
                ))}
              </select>
              {errors.groupId && (
                <span className="mt-1 block text-sm text-danger-text">
                  {errors.groupId.message}
                </span>
              )}
            </label>

            {/* Предмет */}
            <label className={labelClassName}>
              Предмет
              <select
                {...register('subjectId')}
                className={inputClassName}
              >
                <option value="">Выберите предмет</option>

                {subjectsQuery.data?.map(subject => (
                  <option
                    key={subject.id}
                    value={subject.id}
                  >
                    {subject.name}
                  </option>
                ))}
              </select>
              {errors.subjectId && (
                <span className="mt-1 block text-sm text-danger-text">
                  {errors.subjectId.message}
                </span>
              )}
            </label>

            {/* Преподаватель */}
            <label className={labelClassName}>
              Преподаватель
              <select
                {...register('teacherId')}
                className={inputClassName}
              >
                <option value="">Выберите преподавателя</option>

                {teachersQuery.data?.map(teacher => (
                  <option
                    key={teacher.id}
                    value={teacher.id}
                  >
                    {teacher.fullName}
                  </option>
                ))}
              </select>
              {errors.teacherId && (
                <span className="mt-1 block text-sm text-danger-text">
                  {errors.teacherId.message}
                </span>
              )}
            </label>

            {/* День недели */}
            <label className={labelClassName}>
              День недели
              <select
                {...register('dayOfWeek')}
                className={inputClassName}
              >
                {weekDays.map(day => (
                  <option
                    key={day.value}
                    value={day.value}
                  >
                    {day.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Начало */}
            <label className={labelClassName}>
              Начало
              <input
                type="time"
                {...register('startTime')}
                className={inputClassName}
              />
              {errors.startTime && (
                <span className="mt-1 block text-sm text-danger-text">
                  {errors.startTime.message}
                </span>
              )}
            </label>

            {/* Окончание */}
            <label className={labelClassName}>
              Окончание
              <input
                type="time"
                {...register('endTime')}
                className={inputClassName}
              />
              {errors.endTime && (
                <span className="mt-1 block text-sm text-danger-text">
                  {errors.endTime.message}
                </span>
              )}
            </label>

            {/* Аудитория */}
            <label className={labelClassName}>
              Аудитория
              <input
                {...register('classroom')}
                placeholder="Например, 305"
                className={inputClassName}
              />
              {errors.classroom && (
                <span className="mt-1 block text-sm text-danger-text">
                  {errors.classroom.message}
                </span>
              )}
            </label>

            {/* Дата начала */}
            <label className={labelClassName}>
              Действует с
              <input
                type="date"
                {...register('validFrom')}
                className={inputClassName}
              />
              {errors.validFrom && (
                <span className="mt-1 block text-sm text-danger-text">
                  {errors.validFrom.message}
                </span>
              )}
            </label>

            {/* Дата окончания */}
            <label className={labelClassName}>
              Действует до
              <input
                type="date"
                {...register('validTo')}
                className={inputClassName}
              />
              {errors.validTo && (
                <span className="mt-1 block text-sm text-danger-text">
                  {errors.validTo.message}
                </span>
              )}
            </label>
          </div>

          {createSchedule.isError && (
            <p className="mt-4 text-sm text-danger-text">
              Не удалось добавить занятие. Проверьте введённые данные.
            </p>
          )}

          <button
            type="submit"
            disabled={createSchedule.isPending}
            className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createSchedule.isPending ? 'Сохранение...' : 'Добавить занятие'}
          </button>
        </>
      )}
    </form>
  )
}
