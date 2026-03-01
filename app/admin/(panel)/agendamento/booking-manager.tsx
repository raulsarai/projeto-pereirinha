"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateSiteSetting } from "@/app/admin/actions";
import { toast } from "sonner";

export function BookingManager({ settings }: { settings: any }) {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(settings.section_booking_active === "true");

  async function handleSave(formData: FormData) {
    setLoading(true);
    try {
      await updateSiteSetting("section_booking_active", active ? "true" : "false");
      await updateSiteSetting("section_booking_type", formData.get("type") as string);
      await updateSiteSetting("section_booking_url", formData.get("url") as string);
      await updateSiteSetting("section_booking_title", formData.get("title") as string);
      toast.success("Configurações de agendamento salvas!");
    } catch {
      toast.error("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSave} className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2">
        <Switch checked={active} onCheckedChange={setActive} />
        <Label>Ativar Seção de Agendamento</Label>
      </div>

      <div className="grid gap-4">
        <div>
          <Label>Título da Seção</Label>
          <Input name="title" defaultValue={settings.section_booking_title} />
        </div>
        <div>
          <Label>Tipo de Integração</Label>
          <Select name="type" defaultValue={settings.section_booking_type || "calendly"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calendly">Calendly (Iframe)</SelectItem>
              <SelectItem value="google">Google Calendar (Público)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>URL do Agendamento</Label>
          <Input name="url" placeholder="https://calendly.com/seu-link" defaultValue={settings.section_booking_url} />
          <p className="text-xs text-muted-foreground mt-1">
            No Google, use a "URL pública deste calendário" disponível nas configurações do Google Agenda.
          </p>
        </div>
      </div>

      <Button type="submit" disabled={loading}>Salvar</Button>
    </form>
  );
}