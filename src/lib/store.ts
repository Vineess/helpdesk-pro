import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

/* ---------- UI ---------- */
type UIState = {
  sidebarOpen: boolean
  toggleSidebar: () => void
}
export const useUI = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))

/* ---------- AUTH ---------- */
type User = { name: string; email: string; role: "admin" | "agent" | "viewer" } | null

type AuthState = {
  user: User
  login: (email: string, _password: string) => Promise<boolean>
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: async (email, _password) => {
        await new Promise((r) => setTimeout(r, 300))
        const ok = !!email
        if (ok) set({ user: { name: "Vinicius", email, role: "admin" } })
        return ok
      },
      logout: () => set({ user: null }),
    }),
    {
      name: "helpdesk-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ user: s.user }),
    }
  )
)
