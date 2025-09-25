import Sidebar from "@/components/app/sidebar"
import { Topbar } from "@/components/app/topbar"
import { redirect } from "next/navigation"
import { useAuth } from "@/lib/store"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Apenas front: faremos uma verificação client-side dentro da página
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}
