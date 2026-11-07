import './globals.css'

import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'

import { QueryProvider } from './providers'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Attendance',
  description: 'University attendance system'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={manrope.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
