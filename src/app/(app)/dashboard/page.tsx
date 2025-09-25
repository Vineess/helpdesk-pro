"use client"
import { RequireAuth } from "@/components/app/require-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const kpis = [
  { title: "Tickets abertos", value: 37 },
  { title: "SLA em risco", value: 5 },
  { title: "Aguardando cliente", value: 12 },
  { title: "Agentes online", value: 4 },
]

const tickets = [
  { id: "#8421", assunto: "Erro ao logar", prioridade: "Alta", status: "Aberto", agente: "Ana" },
  { id: "#8422", assunto: "E-mail não envia", prioridade: "Média", status: "Em progresso", agente: "Carlos" },
  { id: "#8423", assunto: "Reset de senha", prioridade: "Baixa", status: "Aguardando cliente", agente: "Bianca" },
]

export default function DashboardPage() {
  return (
    <RequireAuth>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <Card key={k.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">{k.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{k.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Últimos tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Agente</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.assunto}</TableCell>
                    <TableCell>
                      <Badge variant={
                        t.prioridade === "Alta" ? "destructive" : t.prioridade === "Média" ? "default" : "secondary"
                      }>
                        {t.prioridade}
                      </Badge>
                    </TableCell>
                    <TableCell>{t.status}</TableCell>
                    <TableCell>{t.agente}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  )
}
