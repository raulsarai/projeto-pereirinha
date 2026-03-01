"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function DesignSettings({ settings, setSettings }: any) {
  return (
    <Card className="mt-6">
      <CardHeader><CardTitle>Cores do Site Público</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Cor de Fundo Principal</Label>
          <div className="flex gap-2">
            <Input type="color" className="w-14 h-10 p-1" value={settings.theme_bg_color || "#111111"} onChange={(e) => setSettings({ ...settings, theme_bg_color: e.target.value })} />
            <Input value={settings.theme_bg_color || "#111111"} readOnly />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Cor de Destaque (Accent)</Label>
          <div className="flex gap-2">
            <Input type="color" className="w-14 h-10 p-1" value={settings.theme_accent_color || "#22c55e"} onChange={(e) => setSettings({ ...settings, theme_accent_color: e.target.value })} />
            <Input value={settings.theme_accent_color || "#22c55e"} readOnly />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}