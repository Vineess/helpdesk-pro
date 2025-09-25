import { create } from "zustand"

type UIState = {
  sidebarOpen: boolean
  toggleSidebar: () => void
}
export const useUI = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))

type User = { name: string; email: string; role: "admin" | "agent" | "viewer" } | null

type AuthState = {
  user: User
  login: (email: string, _password: string) => Promise<boolean>
  logout: () => void
}
export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: async (email, _password) => {
    // mock simples de login
    await new Promise((r) => setTimeout(r, 600))
    const ok = !!email
    if (ok) set({ user: { name: "Vinicius", email, role: "admin" } })
    return ok
  },
  logout: () => set({ user: null }),
}))
