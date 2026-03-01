"use client";
import * as LucideIcons from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

const AVAILABLE_ICONS = [
  "Users", "Trophy", "Heart", "Star", "Instagram", "Youtube", "Facebook", "Zap", "ShieldCheck", "Clock"
];

export function StatsSettings({ settings, setSettings }: any) {
  const stats = JSON.parse(settings.section_stats_data || "[]");
  const updateStats = (items: any[]) => setSettings({ ...settings, section_stats_data: JSON.stringify(items) });

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Métricas Dinâmicas</CardTitle>
        <Button onClick={() => updateStats([...stats, { id: crypto.randomUUID(), label: "Métrica", value: "0", icon: "Users" }])} size="sm">
          <Plus size={16} className="mr-2"/> Adicionar Card
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((s: any) => (
          <div key={s.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-xl items-end bg-muted/5">
            <div className="space-y-2">
              <Label>Ícone</Label>
              <Select value={s.icon} onValueChange={(v) => updateStats(stats.map((x: any) => x.id === s.id ? { ...x, icon: v } : x))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_ICONS.map(iconName => {
                    const Icon = (LucideIcons as any)[iconName];
                    return (
                      <SelectItem key={iconName} value={iconName}>
                        <div className="flex items-center gap-2">
                          {Icon && <Icon size={14} />} {iconName}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Título</Label><Input value={s.label} onChange={(e) => updateStats(stats.map((x: any) => x.id === s.id ? { ...x, label: e.target.value } : x))} /></div>
            <div className="space-y-2"><Label>Valor</Label><Input value={s.value} onChange={(e) => updateStats(stats.map((x: any) => x.id === s.id ? { ...x, value: e.target.value } : x))} /></div>
            <Button variant="destructive" size="icon" onClick={() => updateStats(stats.filter((x: any) => x.id !== s.id))}><Trash2 size={16} /></Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}