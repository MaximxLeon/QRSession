import type { SidebarItem } from '../model/'

export const teacherMenu: SidebarItem[] = [
  {
    title: 'Главная',
    href: '/teacher',
    icon: 'dashboard'
  },
  {
    title: 'Мои занятия',
    href: '/teacher/lessons',
    icon: 'calendar'
  }
]
