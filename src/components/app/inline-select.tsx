"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const NONE = "__none"

type Props = {
  value?: string | null
  placeholder?: string
  items: string[]
  onChange: (v: string | undefined) => void
  allowNone?: boolean
}

export function InlineSelect({ value, placeholder, items, onChange, allowNone }: Props) {
  const val = value ?? (allowNone ? NONE : items[0])
  return (
    <Select
      value={val}
      onValueChange={(v) => onChange(allowNone && v === NONE ? undefined : v)}
    >
      <SelectTrigger className="h-8 w-[160px]">
        <SelectValue placeholder={placeholder ?? "Selecionar"} />
      </SelectTrigger>
      <SelectContent>
        {allowNone && <SelectItem value={NONE}>Não atribuído</SelectItem>}
        {items.map((it) => (
          <SelectItem key={it} value={it}>{it}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
