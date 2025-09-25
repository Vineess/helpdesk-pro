"use client"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { RequireAuth } from "@/components/app/require-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTickets } from "@/lib/tickets-store"
import { PRIORITIES, STATUSES, AGENTS, Priority, Status } from "@/lib/tickets"
import { InlineSelect } from "@/components/app/inline-select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleString() } catch { return iso }
}

export default function TicketDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const num = params.id
  const id = `#${num}`
  const { tickets, update, activities, addComment } = useTickets()
  const t = tickets.find((x) => x.id === id)

  const [message, setMessage] = useState("")

  if (!t) {
    return (
      <RequireAuth>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Ticket {id} não encontrado.</p>
          <Button asChild variant="outline"><Link href="/tickets">Voltar</Link></Button>
        </div>
      </RequireAuth>
    )
  }

  const acts = activities[id] ?? []

  async function handleSend() {
    const text = message.trim()
    if (!text) return
    addComment(id, text, "Vinicius")
    setMessage("")
    toast.success("Comentário adicionado")
  }

  return (
    <RequireAuth>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Ticket {t.id}</h1>
          <Button variant="outline" onClick={() => router.push("/tickets")}>Voltar para lista</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t.subject}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Solicitante</div>
                <div className="font-medium">{t.requester}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Criado em</div>
                <div className="font-medium">{formatDate(t.createdAt)}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Prioridade</div>
                <InlineSelect
                  value={t.priority}
                  items={PRIORITIES}
                  onChange={(v) => v && update(t.id, { priority: v as Priority })}
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Status</div>
                <InlineSelect
                  value={t.status}
                  items={STATUSES}
                  onChange={(v) => v && update(t.id, { status: v as Status })}
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Agente</div>
                <InlineSelect
                  value={t.agent}
                  items={AGENTS}
                  onChange={(v) => update(t.id, { agent: v })}
                  allowNone
                />
              </div>
            </div>

            {t.description && (
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Descrição</div>
                <p className="text-sm leading-relaxed">{t.description}</p>
              </div>
            )}

            <Separator />

            <div className="space-y-3">
              <div className="text-sm font-medium">Nova mensagem</div>
              <Textarea
                rows={3}
                placeholder="Escreva um comentário para o cliente ou registro interno…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={handleSend}>Enviar comentário</Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="text-sm font-medium">Timeline</div>
              <ul className="space-y-3">
                {acts.map((a) => (
                  <li key={a.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {a.kind === "created" && "Ticket criado"}
                        {a.kind === "comment" && `Comentário por ${a.by}`}
                        {a.kind === "priority_changed" && `Prioridade alterada por ${a.by}`}
                        {a.kind === "status_changed" && `Status alterado por ${a.by}`}
                        {a.kind === "agent_changed" && `Agente alterado por ${a.by}`}
                      </span>
                      <span>{formatDate(a.at)}</span>
                    </div>
                    {a.kind === "comment" ? (
                      <p className="mt-2 text-sm">{a.message}</p>
                    ) : (
                      (a.from || a.to) && (
                        <p className="mt-2 text-sm">
                          {a.from ?? "—"} → {a.to ?? "—"}
                        </p>
                      )
                    )}
                  </li>
                ))}
                {acts.length === 0 && (
                  <li className="text-sm text-muted-foreground">Sem atividades ainda.</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  )
}
