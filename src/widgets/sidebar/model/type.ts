export type SidebarIcon =
  | 'dashboard'
  | 'users'
  | 'graduation'
  | 'book'
  | 'calendar'
  | 'calendar-days'
  | 'clipboard-check'
  | 'chart-no-axes-combined'
  | 'bell'
  | 'user-round'
  | 'clock'
  | 'settings'
  | 'book-open'
  | 'clipboard-list'
  | 'chart-bar'
  | 'file-text'
  | 'building-2'
  | 'user-check'
  | 'calendar-check'
  | 'qr-code'

export type SidebarItem = {
  title: string
  href: string
  icon: SidebarIcon
}

export type SidebarProps = {
  title: string
  subtitle?: string
  items: SidebarItem[]
}
