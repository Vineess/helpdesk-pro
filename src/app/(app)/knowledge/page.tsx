"use client"
import { RequireAuth } from "@/components/app/require-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function KnowledgePage() {
  return (
    <RequireAuth>
      <Card>
        <CardHeader><CardTitle>Base de conhecimento</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Categorias, artigos e busca serão adicionados.</p>
        </CardContent>
      </Card>
    </RequireAuth>
  )
}
