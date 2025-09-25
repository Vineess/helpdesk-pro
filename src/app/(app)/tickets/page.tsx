"use client"
import { RequireAuth } from "@/components/app/require-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function TicketsPage() {
  return (
    <RequireAuth>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Tickets</CardTitle>
          <Button><Plus className="mr-2 h-4 w-4" /> Novo ticket</Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Lista e filtros virão aqui…</p>
        </CardContent>
      </Card>
    </RequireAuth>
  )
}
