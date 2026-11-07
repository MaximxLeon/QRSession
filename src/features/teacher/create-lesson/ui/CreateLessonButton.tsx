'use client'

type CreateLessonButtonProps = {
  isPending: boolean
  onClick: () => void
}

export function CreateLessonButton({
  isPending,
  onClick
}: CreateLessonButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className="
        inline-flex items-center justify-center gap-2
        rounded-lg bg-primary px-4 py-2.5
        text-sm font-medium text-primary-foreground
        transition-colors hover:bg-primary-hover
        disabled:cursor-not-allowed disabled:opacity-60
      "
    >
      {isPending ? 'Создание...' : 'Создать занятие'}
    </button>
  )
}
