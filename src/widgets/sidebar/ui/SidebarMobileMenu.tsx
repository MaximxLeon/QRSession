'use client'

import { X } from 'lucide-react'

import type { SidebarProps } from '../model'
import { SidebarFooter } from './SidebarFooter'
import { SidebarHeader } from './SidebarHeader'
import { SidebarNav } from './SidebarNav'

interface SidebarMobileMenuProps extends SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function SidebarMobileMenu({
  items,
  title = 'Attendance',
  subtitle = 'University system',
  isOpen,
  onClose
}: SidebarMobileMenuProps) {
  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${
        isOpen ? 'visible' : 'invisible pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Затемнение фона */}
      <button
        type="button"
        aria-label="Закрыть меню"
        onClick={onClose}
        className={`absolute inset-0 bg-[--overlay] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Выдвижная панель */}
      <aside
        className={`
          absolute inset-y-0 left-0 flex w-[min(85vw,320px)]
          flex-col bg-sidebar p-5 text-sidebar-foreground
          shadow-xl transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="mb-6 flex items-start justify-between">
          <SidebarHeader
            title={title}
            subtitle={subtitle}
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть меню"
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent"
          >
            <X size={21} />
          </button>
        </div>

        <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          Основное меню
        </div>

        <SidebarNav
          items={items}
          onNavigate={onClose}
        />

        <SidebarFooter />
      </aside>
    </div>
  )
}
