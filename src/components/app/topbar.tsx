"use client"
import { useAuth, useUI } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "./theme-toggle"

export function Topbar() {
  const { user, logout } = useAuth()

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="text-sm text-muted-foreground">Bem-vindo ao Help Desk PRO</div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {user && (
          <>
            <div className="hidden sm:block text-sm">
              <div className="font-medium leading-none">{user.name}</div>
              <div className="text-muted-foreground">{user.email}</div>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={logout}>Sair</Button>
          </>
        )}
      </div>
    </header>
  )
}
