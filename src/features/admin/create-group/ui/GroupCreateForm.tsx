'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import {
  type CreateGroupFormValues,
  createGroupSchema
} from '../model/create-group.schema'
import { useCreateGroup } from '../model/mutations'

export function GroupCreateForm() {
  const createGroup = useCreateGroup()

  // Инициализация React Hook Form с Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: ''
    }
  })

  // Отправка формы
  async function onSubmit(values: CreateGroupFormValues) {
    try {
      await createGroup.mutateAsync(values.name)
      reset()
    } catch (error) {
      console.error('Ошибка создания группы:', error)
    }
  }

  return (
    <div className="space-y-3">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row"
      >
        <div className="min-w-0 flex-1">
          <input
            {...register('name')}
            placeholder="Например, ИС-21"
            aria-invalid={!!errors.name}
            className="w-full rounded-lg border border-border-input bg-input-bg px-4 py-2 text-foreground outline-none placeholder:text-placeholder focus:border-primary"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-danger-text">
              {errors.name.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || createGroup.isPending}
          className="rounded-lg bg-primary px-5 py-2 font-medium text-text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting || createGroup.isPending
            ? 'Создание...'
            : 'Добавить группу'}
        </button>
      </form>

      {createGroup.isError && (
        <p className="rounded-lg bg-danger-bg p-3 text-sm text-danger-text">
          Не удалось создать группу
        </p>
      )}
    </div>
  )
}
