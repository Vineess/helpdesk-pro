"use client"
import { RequireAuth } from "@/components/app/require-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useTickets } from "@/lib/tickets-store"
import { PRIORITIES, STATUSES, AGENTS, Priority, Status } from "@/lib/tickets"
import { TicketForm, TicketFormData } from "@/components/app/ticket-form"
import { toast } from "sonner"
import { InlineSelect, NONE } from "@/components/app/inline-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SortKey = "createdAt" | "priority" | "status"
type SortDir = "asc" | "desc"
const ALL = "__all"
const PAGE_SIZE = 10

export default function TicketsPage() {
  const { tickets, add, update, seedIfEmpty } = useTickets()
  const [q, setQ] = useState("")
  const [priority, setPriority] = useState<Priority | "">("")
  const [status, setStatus] = useState<Status | "">("")
  const [sortKey, setSortKey] = useState<SortKey>("createdAt")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => { seedIfEmpty() }, [seedIfEmpty])

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase()
    let arr = tickets.filter((t) =>
      (!text || t.subject.toLowerCase().includes(text) || t.requester.toLowerCase().includes(text)) &&
      (!priority || t.priority === priority) &&
      (!status || t.status === status)
    )

    arr = arr.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1
      if (sortKey === "createdAt") return a.createdAt.localeCompare(b.createdAt) * dir
      if (sortKey === "priority") {
        const order: Record<Priority, number> = { "Alta": 3, "Média": 2, "Baixa": 1 }
        return (order[a.priority] - order[b.priority]) * dir
      }
      if (sortKey === "status") return a.status.localeCompare(b.status) * dir
      return 0
    })
    return arr
  }, [tickets, q, priority, status, sortKey, sortDir])

  // paginação
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  useEffect(() => { if (page > totalPages) setPage(totalPages) }, [totalPages, page])

  function toggleSort(k: SortKey) {
    if (k === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(k); setSortDir("asc") }
  }

  async function handleCreate(data: TicketFormData) {
    add({
      subject: data.subject,
      description: data.description,
      priority: data.priority,
      status: data.status,
      agent: data.agent || undefined,
      requester: data.requester,
    })
    toast.success("Ticket criado com sucesso")
    setOpen(false)
  }

  return (
    <RequireAuth>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Tickets</CardTitle>

          <div className="flex gap-2">
            <Input
              className="w-56"
              placeholder="Buscar por assunto/solicitante"
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1) }}
            />

            {/* PRIORIDADE */}
            <Select
              value={priority || ALL}
              onValueChange={(v) => { setPriority(v === ALL ? "" : (v as Priority)); setPage(1) }}
            >
              <SelectTrigger className="w-36"><SelectValue placeholder="Prioridade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todas</SelectItem>
                {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* STATUS */}
            <Select
              value={status || ALL}
              onValueChange={(v) => { setStatus(v === ALL ? "" : (v as Status)); setPage(1) }}
            >
              <SelectTrigger className="w-48"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => toggleSort("createdAt")} title="Ordenar por data">
              <ArrowUpDown className="mr-2 h-4 w-4" /> Data
            </Button>
            <Button variant="outline" onClick={() => toggleSort("priority")} title="Ordenar por prioridade">
              <ArrowUpDown className="mr-2 h-4 w-4" /> Prioridade
            </Button>
            <Button variant="outline" onClick={() => toggleSort("status")} title="Ordenar por status">
              <ArrowUpDown className="mr-2 h-4 w-4" /> Status
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> Novo ticket</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>Novo ticket</DialogTitle></DialogHeader>
                <TicketForm onSubmit={handleCreate} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Agente</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <Link href={`/tickets/${encodeURIComponent(t.id.replace("#",""))}`} className="underline-offset-2 hover:underline">
                      {t.id}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[320px] truncate">{t.subject}</TableCell>
                  <TableCell>
                    <InlineSelect
                      value={t.priority}
                      items={PRIORITIES}
                      onChange={(v) => v && update(t.id, { priority: v as Priority })}
                    />
                  </TableCell>
                  <TableCell>
                    <InlineSelect
                      value={t.status}
                      items={STATUSES}
                      onChange={(v) => v && update(t.id, { status: v as Status })}
                    />
                  </TableCell>
                  <TableCell>
                    <InlineSelect
                      value={t.agent}
                      items={AGENTS}
                      onChange={(v) => update(t.id, { agent: v })}
                      allowNone
                    />
                  </TableCell>
                  <TableCell className="truncate max-w-[200px]">{t.requester}</TableCell>
                  <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {pageItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                    Nenhum resultado para os filtros aplicados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* paginação */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </span>
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Anterior
            </Button>
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Próxima
            </Button>
          </div>
        </CardContent>
      </Card>
    </RequireAuth>
  )
}
