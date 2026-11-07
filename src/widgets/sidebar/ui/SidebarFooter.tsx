'use client'

import { useState } from 'react'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SidebarFooter() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    try {
      setIsLoading(true)

      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      })

      if (response.ok) {
        router.push('/login')
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-6 border-t border-sidebar-border pt-4 md:mt-8 md:pt-5">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className="
          flex w-full items-center justify-center gap-3
          rounded-md px-4 py-3 text-sm
          text-sidebar-foreground/80 transition-colors
          hover:bg-danger/15 hover:text-danger
          disabled:cursor-not-allowed disabled:opacity-50
          md:justify-start
        "
      >
        <LogOut size={19} />
        {isLoading ? 'Выход...' : 'Выйти'}
      </button>
    </div>
  )
}
