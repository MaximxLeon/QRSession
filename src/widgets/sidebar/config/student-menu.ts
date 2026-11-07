import type { SidebarItem } from '../model/'

export const studentMenu: SidebarItem[] = [
  {
    title: 'Главная',
    href: '/student',
    icon: 'dashboard'
  },
  {
    title: 'Моё расписание',
    href: '/student/schedule',
    icon: 'calendar-days'
  },
  {
    title: 'Посещаемость',
    href: '/student/attendance',
    icon: 'clipboard-check'
  },
  {
    title: 'Уведомления',
    href: '/student/notifications',
    icon: 'bell'
  }
]
