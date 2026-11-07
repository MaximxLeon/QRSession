interface SidebarHeaderProps {
  title: string
  subtitle: string
}

export function SidebarHeader({ title, subtitle }: SidebarHeaderProps) {
  return (
    <div className="mb-6 md:mb-10">
      <h1 className="text-xl font-bold tracking-tight text-sidebar-foreground md:text-2xl">
        {title}
      </h1>

      <p className="mt-1 text-xs text-sidebar-foreground/65">{subtitle}</p>
    </div>
  )
}
