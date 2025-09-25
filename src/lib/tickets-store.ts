import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Ticket, Priority, Status, Activity, ActivityKind } from "./tickets"

type TicketsState = {
  tickets: Ticket[]
  activities: Record<string, Activity[]> // por ticketId
  add: (t: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => Ticket
  update: (id: string, patch: Partial<Ticket>, actor?: string) => void
  remove: (id: string) => void
  addComment: (id: string, message: string, author: string) => void
  seedIfEmpty: () => void
}

function nextId(last = 8420) {
  const n = last + Math.floor(Math.random() * 3 + 1)
  return `#${n}`
}

function pushActivity(state: TicketsState, a: Activity) {
  const list = state.activities[a.ticketId] ?? []
  return { ...state.activities, [a.ticketId]: [a, ...list] }
}

export const useTickets = create<TicketsState>()(
  persist(
    (set, get) => ({
      tickets: [],
      activities: {},

      add: (t) => {
        const now = new Date().toISOString()
        const last = Number((get().tickets.at(-1)?.id || "#8420").replace("#", ""))
        const ticket: Ticket = {
          id: nextId(last),
          createdAt: now,
          updatedAt: now,
          ...t,
        }
        set((s) => ({
          tickets: [ticket, ...s.tickets],
          activities: pushActivity(s, {
            id: crypto.randomUUID(),
            ticketId: ticket.id,
            kind: "created",
            at: now,
            by: "Vinicius",
          }),
        }))
        return ticket
      },

      update: (id, patch, actor = "Vinicius") =>
        set((s) => {
          const now = new Date().toISOString()
          const before = s.tickets.find((tk) => tk.id === id)
          const updated = s.tickets.map((tk) =>
            tk.id === id ? { ...tk, ...patch, updatedAt: now } : tk
          )

          let acts = s.activities
          if (before) {
            if (patch.priority && patch.priority !== before.priority) {
              acts = pushActivity({ ...s, activities: acts } as any, {
                id: crypto.randomUUID(),
                ticketId: id,
                kind: "priority_changed",
                at: now,
                by: actor,
                from: before.priority,
                to: patch.priority,
              })
            }
            if (patch.status && patch.status !== before.status) {
              acts = pushActivity({ ...s, activities: acts } as any, {
                id: crypto.randomUUID(),
                ticketId: id,
                kind: "status_changed",
                at: now,
                by: actor,
                from: before.status,
                to: patch.status,
              })
            }
            if (patch.agent !== undefined && patch.agent !== before.agent) {
              acts = pushActivity({ ...s, activities: acts } as any, {
                id: crypto.randomUUID(),
                ticketId: id,
                kind: "agent_changed",
                at: now,
                by: actor,
                from: before.agent ?? "—",
                to: patch.agent ?? "—",
              })
            }
          }

          return { tickets: updated, activities: acts }
        }),

      remove: (id) =>
        set((s) => ({
          tickets: s.tickets.filter((tk) => tk.id !== id),
          activities: Object.fromEntries(Object.entries(s.activities).filter(([k]) => k !== id)),
        })),

      addComment: (id, message, author) =>
        set((s) => ({
          activities: pushActivity(s, {
            id: crypto.randomUUID(),
            ticketId: id,
            kind: "comment",
            at: new Date().toISOString(),
            by: author,
            message,
          }),
        })),

      seedIfEmpty: () => {
        if (get().tickets.length > 0) return
        const now = new Date().toISOString()
        const seed: Ticket[] = [
          {
            id: "#8423",
            subject: "Reset de senha",
            description: "Usuário esqueceu a senha",
            priority: "Baixa",
            status: "Aguardando cliente",
            agent: "Bianca",
            requester: "joao@acme.com",
            createdAt: now,
            updatedAt: now,
          },
          {
            id: "#8422",
            subject: "E-mail não envia",
            description: "SMTP 550",
            priority: "Média",
            status: "Em progresso",
            agent: "Carlos",
            requester: "ana@acme.com",
            createdAt: now,
            updatedAt: now,
          },
          {
            id: "#8421",
            subject: "Erro ao logar",
            description: "401 em produção",
            priority: "Alta",
            status: "Aberto",
            agent: "Ana",
            requester: "maria@acme.com",
            createdAt: now,
            updatedAt: now,
          },
        ]
        set((s) => ({
          tickets: seed,
          activities: seed.reduce<Record<string, Activity[]>>((acc, t) => {
            acc[t.id] = [{
              id: crypto.randomUUID(),
              ticketId: t.id,
              kind: "created",
              at: now,
              by: "Vinicius",
            }]
            return acc
          }, {}),
        }))
      },
    }),
    { name: "helpdesk-tickets" }
  )
)
