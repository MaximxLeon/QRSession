'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import {
  type CreateTeacherFormValues,
  createTeacherSchema
} from '../model/create-teacher.schema'
import { useCreateTeacher } from '../model/mutations'

export function TeacherCreateForm() {
  const createTeacher = useCreateTeacher()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateTeacherFormValues>({
    resolver: zodResolver(createTeacherSchema),

    defaultValues: {
      fullName: '',
      login: '',
      password: ''
    }
  })

  async function onSubmit(values: CreateTeacherFormValues) {
    try {
      await createTeacher.mutateAsync({
        fullName: values.fullName.trim(),
        login: values.login.trim(),
        password: values.password
      })

      // Очищаем форму после успешного создания
      reset()
    } catch (error) {
      console.error('Ошибка создания преподавателя:', error)
    }
  }

  return (
    <div className="space-y-3">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 rounded-xl border border-border bg-card p-5 shadow-sm md:grid-cols-2"
      >
        {/* ФИО */}
        <div>
          <input
            {...register('fullName')}
            placeholder="ФИО преподавателя"
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

        {/* Кнопка */}
        <button
          type="submit"
          disabled={isSubmitting || createTeacher.isPending}
          className="rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting || createTeacher.isPending
            ? 'Создание...'
            : 'Добавить преподавателя'}
        </button>

        {/* Ошибка API */}
        {createTeacher.isError && (
          <p className="text-sm text-danger-text md:col-span-2">
            Не удалось создать преподавателя. Возможно, логин уже занят.
          </p>
        )}
      </form>
    </div>
  )
}
