"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/store"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useAuth((s) => s.user)
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // estado inicial (pode já vir hidratado)
    setReady(useAuth.persist.hasHydrated())
    // quando terminar de hidratar, re-renderiza
    const unsub = useAuth.persist.onFinishHydration(() => setReady(true))
    return () => { unsub() }
  }, [])

  useEffect(() => {
    if (!ready) return
    if (!user) router.replace("/login")
  }, [ready, user, router])

  if (!ready) return null
  if (!user) return null

  return <>{children}</>
}
