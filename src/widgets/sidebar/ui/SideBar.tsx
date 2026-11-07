'use client'

import { useEffect, useState } from 'react'

import type { SidebarProps } from '../model'
import { SidebarFooter } from './SidebarFooter'
import { SidebarHeader } from './SidebarHeader'
import { SidebarMobileHeader } from './SidebarMobileHeader'
import { SidebarMobileMenu } from './SidebarMobileMenu'
import { SidebarNav } from './SidebarNav'

export function Sidebar({
  items,
  title = 'Attendance',
  subtitle = 'University system'
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Закрываем меню клавишей Escape.
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      {/* Мобильная шапка */}
      <SidebarMobileHeader
        title={title}
        onOpen={() => setIsOpen(true)}
      />

      {/* Мобильное меню */}
      <SidebarMobileMenu
        items={items}
        title={title}
        subtitle={subtitle}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      {/* Постоянный Sidebar на компьютере */}
      <aside
        className="
          hidden w-64 shrink-0 flex-col
          bg-sidebar p-5 text-sidebar-foreground
          md:flex md:min-h-screen
        "
      >
        <SidebarHeader
          title={title}
          subtitle={subtitle}
        />

        <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          Основное меню
        </div>

        <SidebarNav items={items} />

        <SidebarFooter />
      </aside>
    </>
  )
}
