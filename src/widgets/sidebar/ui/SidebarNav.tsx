'use client'

import { usePathname } from 'next/navigation'

import type { SidebarItem } from '../model'
import { SidebarNavItem } from './SidebarNavItem'

interface SidebarNavProps {
  items: SidebarItem[]
  onNavigate?: () => void
}

export function SidebarNav({ items, onNavigate }: SidebarNavProps) {
  const pathname = usePathname()

  function isItemActive(href: string) {
    const isHomePage = ['/teacher', '/student', '/admin'].includes(href)

    if (isHomePage) {
      return pathname === href
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav className="flex flex-1 flex-col gap-1">
      {items.map(item => (
        <SidebarNavItem
          key={item.href}
          item={item}
          isActive={isItemActive(item.href)}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  )
}
