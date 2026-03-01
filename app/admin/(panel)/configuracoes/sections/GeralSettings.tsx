"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function GeralSettings({ settings, setSettings }: any) {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>SEO e Meta Tags</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Título do Site</Label>
              <Input value={settings.seo_title || ""} onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Descrição SEO</Label>
              <Textarea value={settings.seo_description || ""} onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Localização e Timer</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Data de Encerramento (Timer Global)</Label>
              <Input type="datetime-local" value={settings.global_timer_date || ""} onChange={(e) => setSettings({ ...settings, global_timer_date: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Endereço</Label>
              <Input value={settings.endereco || ""} onChange={(e) => setSettings({ ...settings, endereco: e.target.value })} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}