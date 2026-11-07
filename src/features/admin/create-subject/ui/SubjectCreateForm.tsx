'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import {
  type CreateSubjectFormValues,
  createSubjectSchema
} from '../model/create-subject.schema'
import { useCreateSubject } from '../model/mutations'

export function SubjectCreateForm() {
  const createSubject = useCreateSubject()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateSubjectFormValues>({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: {
      name: '',
      code: ''
    }
  })

  const onSubmit = async (values: CreateSubjectFormValues) => {
    try {
      await createSubject.mutateAsync({
        name: values.name,
        code: values.code.trim() || undefined
      })

      reset()
    } catch {
      // Ошибка отображается ниже через состояние mutation.
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
    >
      <h2 className="text-lg font-semibold text-heading">Добавить предмет</h2>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="subject-name"
          className="text-sm font-medium text-foreground"
        >
          Название предмета
        </label>

        <input
          id="subject-name"
          {...register('name')}
          placeholder="Например, Математический анализ"
          className="rounded-lg border border-border-input bg-input-bg px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-focus-ring/20"
        />

        {errors.name && (
          <p className="text-sm text-danger-text">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="subject-code"
          className="text-sm font-medium text-foreground"
        >
          Код предмета
        </label>

        <input
          id="subject-code"
          {...register('code')}
          placeholder="Например, MAT-101"
          className="rounded-lg border border-border-input bg-input-bg px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-focus-ring/20"
        />

        {errors.code && (
          <p className="text-sm text-danger-text">{errors.code.message}</p>
        )}
      </div>

      {createSubject.isError && (
        <p className="text-sm text-danger-text">
          Не удалось создать предмет. Попробуйте ещё раз.
        </p>
      )}

      <button
        type="submit"
        disabled={createSubject.isPending}
        className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {createSubject.isPending ? 'Создание...' : 'Создать предмет'}
      </button>
    </form>
  )
}
