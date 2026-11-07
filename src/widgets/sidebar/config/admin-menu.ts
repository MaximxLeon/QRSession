import type { SidebarItem } from '../model/'

export const adminMenu: SidebarItem[] = [
  {
    title: 'Главная',
    href: '/admin',
    icon: 'dashboard'
  },
  {
    title: 'Группы',
    href: '/admin/groups',
    icon: 'users'
  },
  {
    title: 'Преподаватели',
    href: '/admin/teachers',
    icon: 'graduation'
  },
  {
    title: 'Студенты',
    href: '/admin/students',
    icon: 'graduation'
  },
  {
    title: 'Предметы',
    href: '/admin/subjects',
    icon: 'book'
  },
  {
    title: 'Расписание',
    href: '/admin/schedule',
    icon: 'calendar'
  }
]
