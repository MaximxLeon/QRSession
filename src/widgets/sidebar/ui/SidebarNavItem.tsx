import Link from 'next/link'

import type { SidebarItem } from '../model'
import { sidebarIcons } from './sidebar-icons'

interface SidebarNavItemProps {
  item: SidebarItem
  isActive: boolean
  onNavigate?: () => void
}

export function SidebarNavItem({
  item,
  isActive,
  onNavigate
}: SidebarNavItemProps) {
  const Icon = sidebarIcons[item.icon]

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={`
        flex min-w-0 items-center gap-3 rounded-md
        px-3 py-3 text-sm font-medium transition-colors md:px-4
        ${
          isActive
            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }
      `}
    >
      {Icon && (
        <Icon
          size={19}
          className="shrink-0"
        />
      )}
      <span className="truncate">{item.title}</span>
    </Link>
  )
}
