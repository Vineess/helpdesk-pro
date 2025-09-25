"use client"
import { useAuth } from "@/lib/store"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!user) router.replace("/login")
  }, [user, router])
  if (!user) return null
  return <>{children}</>
}
