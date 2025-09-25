import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/lib/theme-provider"
import { Toaster } from "sonner"            // <- troque para sonner

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Help Desk PRO",
  description: "Front-end de um Help Desk moderno (Next + Tailwind + shadcn/ui)",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors />             {/* <- sonner */}
        </ThemeProvider>
      </body>
    </html>
  )
}
