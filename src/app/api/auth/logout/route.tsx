import { NextResponse } from 'next/server'

import { logout } from '@/server/auth'

export async function POST() {
  try {
    await logout()
  } catch (error) {
    // redirect() из Next.js выбрасывает специальное исключение.
    // Не перехватываем его как обычную ошибку.
    throw error
  }

  return NextResponse.json({ success: true })
}
