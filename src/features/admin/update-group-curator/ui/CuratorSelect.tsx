'use client'

import { useEffect } from 'react'

import { useForm } from 'react-hook-form'

import type { Teacher } from '@/entities/teacher'
import { zodResolver } from '@hookform/resolvers/zod'

import { type CuratorFormValues, curatorSchema } from '../model/curator.schema'
import { useUpdateGroupCurator } from '../model/mutations'

type CuratorSelectProps = {
  groupId: string
  curatorId: string | null
  teachers: Teacher[]
  teachersLoading: boolean
}

export function CuratorSelect({
  groupId,
  curatorId,
  teachers,
  teachersLoading
}: CuratorSelectProps) {
  const updateCurator = useUpdateGroupCurator()

  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<CuratorFormValues>({
    resolver: zodResolver(curatorSchema),
    defaultValues: {
      curatorId: curatorId ?? ''
    }
  })

  // Синхронизируем значение с актуальными данными группы
  useEffect(() => {
    reset({
      curatorId: curatorId ?? ''
    })
  }, [curatorId, reset])

  async function onSubmit(values: CuratorFormValues) {
    try {
      await updateCurator.mutateAsync({
        groupId,
        curatorId: values.curatorId || null
      })
    } catch (error) {
      console.error('Ошибка назначения куратора:', error)
    }
  }

  return (
    <form
      onChange={handleSubmit(onSubmit)}
      className="flex flex-col gap-1 sm:w-64"
    >
      <label
        htmlFor={`curator-${groupId}`}
        className="text-sm font-medium text-foreground"
      >
        Преподаватель-куратор
      </label>

      <select
        id={`curator-${groupId}`}
        {...register('curatorId')}
        disabled={teachersLoading || updateCurator.isPending || isSubmitting}
        className="rounded-lg border border-border-input bg-input-bg px-3 py-2 text-sm text-foreground outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Без куратора</option>

        {teachers.map(teacher => (
          <option
            key={teacher.id}
            value={teacher.id}
          >
            {teacher.fullName}
          </option>
        ))}
      </select>

      {updateCurator.isError && (
        <p className="text-sm text-danger-text">Не удалось изменить куратора</p>
      )}
    </form>
  )
}
