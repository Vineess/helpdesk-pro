export type Priority = "Baixa" | "Média" | "Alta"
export type Status = "Aberto" | "Em progresso" | "Aguardando cliente" | "Resolvido" | "Fechado"

export type Ticket = {
  id: string // ex: #8421
  subject: string
  description?: string
  priority: Priority
  status: Status
  agent?: string
  requester: string
  createdAt: string // ISO
  updatedAt: string // ISO
}

export const AGENTS = ["Ana", "Bianca", "Carlos", "Daniel", "Eduardo"]
export const PRIORITIES: Priority[] = ["Baixa", "Média", "Alta"]
export const STATUSES: Status[] = ["Aberto", "Em progresso", "Aguardando cliente", "Resolvido", "Fechado"]

/** -------- Timeline / Atividades -------- */
export type ActivityKind =
  | "created"
  | "comment"
  | "priority_changed"
  | "status_changed"
  | "agent_changed"

export type Activity = {
  id: string
  ticketId: string
  kind: ActivityKind
  at: string   // ISO
  by: string   // autor (p.ex. "Vinicius")
  message?: string
  from?: string
  to?: string
}
