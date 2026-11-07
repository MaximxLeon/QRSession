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
    title: 'Статистика',
    href: '/student/statistics',
    icon: 'chart-no-axes-combined'
  },
  {
    title: 'Моя группа',
    href: '/student/group',
    icon: 'users'
  },
  {
    title: 'Уведомления',
    href: '/student/notifications',
    icon: 'bell'
  },
  {
    title: 'Мой профиль',
    href: '/student/profile',
    icon: 'user-round'
  }
]
