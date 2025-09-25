"use client"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PRIORITIES, STATUSES, AGENTS } from "@/lib/tickets"

const NONE = "__none"

const schema = z.object({
  subject: z.string().min(3, "Informe um assunto"),
  description: z.string().optional(),
  requester: z.string().email("E-mail do solicitante inválido"),
  priority: z.enum(["Baixa", "Média", "Alta"]),
  status: z.enum(["Aberto", "Em progresso", "Aguardando cliente", "Resolvido", "Fechado"]),
  agent: z.string().optional(),
})
export type TicketFormData = z.infer<typeof schema>

type Props = {
  onSubmit: (data: TicketFormData) => Promise<void> | void
  submitting?: boolean
}

export function TicketForm({ onSubmit, submitting }: Props) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TicketFormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: "Média", status: "Aberto" },
  })

  const priority = watch("priority")
  const status = watch("status")
  const agent = watch("agent") // pode ser undefined

  return (
    <form onSubmit={handleSubmit((d) => onSubmit(d))} className="space-y-3">
      <div className="space-y-1">
        <Label>Assunto</Label>
        <Input placeholder="Ex.: Falha ao autenticar via SSO" {...register("subject")} />
        {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>Descrição</Label>
        <Textarea rows={4} placeholder="Detalhe o problema..." {...register("description")} />
      </div>

      <div className="space-y-1">
        <Label>E-mail do solicitante</Label>
        <Input type="email" placeholder="cliente@empresa.com" {...register("requester")} />
        {errors.requester && <p className="text-xs text-red-500">{errors.requester.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label>Prioridade</Label>
          <Select value={priority} onValueChange={(v) => setValue("priority", v as any)}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setValue("status", v as any)}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Agente</Label>
          <Select
            // value pode ser undefined (mostra placeholder)
            value={agent ?? undefined}
            onValueChange={(v) => setValue("agent", v === NONE ? undefined : v)}
          >
            <SelectTrigger><SelectValue placeholder="Não atribuído" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Não atribuído</SelectItem>
              {AGENTS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Criando..." : "Criar ticket"}
        </Button>
      </div>
    </form>
  )
}
