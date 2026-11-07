import { redirect } from 'next/navigation'

export default function Home() {
  // При открытии главной страницы перенаправляем пользователя на авторизацию
  redirect('/login')
}
