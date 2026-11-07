'use client'

import { Menu } from 'lucide-react'

interface SidebarMobileHeaderProps {
  title: string
  onOpen: () => void
}

export function SidebarMobileHeader({
  title,
  onOpen
}: SidebarMobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:hidden">
      <h1 className="text-lg font-bold text-heading">{title}</h1>

      <button
        type="button"
        onClick={onOpen}
        aria-label="Открыть меню"
        className="flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted-bg"
      >
        <Menu size={24} />
      </button>
    </header>
  )
}
