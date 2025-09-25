"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/layout/logo"
import {
  LayoutDashboard, Ticket, BookOpen, Settings, ChevronLeft, ChevronRight
} from "lucide-react"
import { useUI } from "@/lib/store"
import { Button } from "@/components/ui/button"

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tickets", label: "Tickets", icon: Ticket },
  { href: "/knowledge", label: "Base de conhecimento", icon: BookOpen },
  { href: "/settings", label: "Configurações", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useUI()

  return (
    <aside className={cn(
      "border-r bg-card transition-all duration-200",
      sidebarOpen ? "w-64" : "w-16"
    )}>
      <div className="flex items-center justify-between p-3">
        <div className={cn("truncate", !sidebarOpen && "opacity-0 pointer-events-none")}>
          <Logo />
        </div>
        <Button size="icon" variant="ghost" onClick={toggleSidebar} aria-label="Alternar menu">
          {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      <nav className="px-2 py-2">
        {NAV.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
                active && "bg-accent text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className={cn(!sidebarOpen && "hidden")}>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
