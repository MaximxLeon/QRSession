'use client'

import { useForm } from 'react-hook-form'

import { useGroups } from '@/entities/group'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  type CreateStudentFormValues,
  createStudentSchema
} from '../model/create-student.schema'
import { useCreateStudent } from '../model/mutations'

export function StudentCreateForm() {
  const createStudent = useCreateStudent()

  // Получаем существующие учебные группы
  const {
    data: groups = [],
    isLoading: groupsLoading,
    isError: groupsError
  } = useGroups()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema),

    defaultValues: {
      fullName: '',
      login: '',
      password: '',
      groupId: '',
      studentNumber: ''
    }
  })

  async function onSubmit(values: CreateStudentFormValues) {
    try {
      await createStudent.mutateAsync({
        fullName: values.fullName.trim(),
        login: values.login.trim(),
        password: values.password,
        groupId: values.groupId,
        studentNumber: values.studentNumber.trim() || undefined
      })

      // Очищаем форму после успешного создания
      reset()
    } catch (error) {
      console.error('Ошибка создания студента:', error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 rounded-xl border border-border bg-card p-5 shadow-sm md:grid-cols-2"
    >
      {/* ФИО */}
      <div>
        <input
          {...register('fullName')}
          placeholder="ФИО студента"
          aria-invalid={!!errors.fullName}
          className="w-full rounded-lg border border-border-input bg-input-bg px-4 py-2 text-foreground outline-none placeholder:text-placeholder focus:border-primary"
        />

        {errors.fullName && (
          <p className="mt-1 text-sm text-danger-text">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Логин */}
      <div>
        <input
          {...register('login')}
          placeholder="Логин"
          aria-invalid={!!errors.login}
          className="w-full rounded-lg border border-border-input bg-input-bg px-4 py-2 text-foreground outline-none placeholder:text-placeholder focus:border-primary"
        />

        {errors.login && (
          <p className="mt-1 text-sm text-danger-text">
            {errors.login.message}
          </p>
        )}
      </div>

      {/* Пароль */}
      <div>
        <input
          {...register('password')}
          type="password"
          placeholder="Пароль (минимум 8 символов)"
          aria-invalid={!!errors.password}
          className="w-full rounded-lg border border-border-input bg-input-bg px-4 py-2 text-foreground outline-none placeholder:text-placeholder focus:border-primary"
        />

        {errors.password && (
          <p className="mt-1 text-sm text-danger-text">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Учебная группа */}
      <div>
        <select
          {...register('groupId')}
          disabled={groupsLoading || groups.length === 0}
          aria-invalid={!!errors.groupId}
          className="w-full rounded-lg border border-border-input bg-input-bg px-4 py-2 text-foreground outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Выберите группу</option>

          {groups.map(group => (
            <option
              key={group.id}
              value={group.id}
            >
              {group.name}
            </option>
          ))}
        </select>

        {errors.groupId && (
          <p className="mt-1 text-sm text-danger-text">
            {errors.groupId.message}
          </p>
        )}

        {groupsError && (
          <p className="mt-1 text-sm text-danger-text">
            Не удалось загрузить группы
          </p>
        )}

        {!groupsLoading && !groupsError && groups.length === 0 && (
          <p className="mt-1 text-sm text-warning-text">
            Сначала создайте учебную группу
          </p>
        )}
      </div>

      {/* Номер студенческого билета */}
      <div className="md:col-span-2">
        <input
          {...register('studentNumber')}
          placeholder="Номер студенческого билета (необязательно)"
          className="w-full rounded-lg border border-border-input bg-input-bg px-4 py-2 text-foreground outline-none placeholder:text-placeholder focus:border-primary"
        />
      </div>

      {/* Кнопка создания */}
      <button
        type="submit"
        disabled={
          isSubmitting ||
          createStudent.isPending ||
          groupsLoading ||
          groups.length === 0 ||
          groupsError
        }
        className="rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2"
      >
        {isSubmitting || createStudent.isPending
          ? 'Создание...'
          : 'Добавить студента'}
      </button>

      {/* Ошибка создания */}
      {createStudent.isError && (
        <p className="text-sm text-danger-text md:col-span-2">
          Не удалось создать студента. Проверьте логин и введённые данные.
        </p>
      )}
    </form>
  )
}
