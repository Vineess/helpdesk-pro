"use client"
import { RequireAuth } from "@/components/app/require-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <RequireAuth>
      <Card>
        <CardHeader><CardTitle>Configurações</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Tema escuro por padrão</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label>Notificações por e-mail</Label>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </RequireAuth>
  )
}
