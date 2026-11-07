'use client'

import { useState } from 'react'

import { Trash2 } from 'lucide-react'

import { useDeleteGroup } from '../model/mutations'

type DeleteGroupButtonProps = {
  groupId: string
  groupName: string
}

export function DeleteGroupButton({
  groupId,
  groupName
}: DeleteGroupButtonProps) {
  const [errorMessage, setErrorMessage] = useState('')

  const deleteGroup = useDeleteGroup()

  async function handleDelete() {
    const confirmed = window.confirm(`Удалить группу «${groupName}»?`)

    if (!confirmed) return

    setErrorMessage('')

    try {
      await deleteGroup.mutateAsync(groupId)
    } catch (error) {
      console.error('Ошибка удаления группы:', error)

      setErrorMessage(
        'Не удалось удалить группу. Возможно, в ней уже есть студенты или расписание.'
      )
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleteGroup.isPending}
        aria-label={`Удалить группу ${groupName}`}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-danger-text transition-colors hover:bg-danger-bg disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 size={16} />

        {deleteGroup.isPending ? 'Удаление...' : 'Удалить'}
      </button>

      {errorMessage && (
        <p className="max-w-64 text-xs text-danger-text">{errorMessage}</p>
      )}
    </div>
  )
}
