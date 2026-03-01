"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Sparkles, MousePointer2 } from "lucide-react";

export function EffectsSettings({ settings, setSettings }: any) {
  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="text-accent" size={18}/> Animações de Scroll</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/5">
            <Label>Ativar Revelação (Scroll Reveal)</Label>
            <Switch 
              checked={settings.effects_animations_active === "true"} 
              onCheckedChange={(c) => setSettings({ ...settings, effects_animations_active: String(c) })} 
            />
          </div>
          <div className="grid gap-2">
            <Label>Velocidade (Segundos)</Label>
            <Input type="number" step="0.1" value={settings.effects_scroll_reveal_speed || "0.5"} onChange={(e) => setSettings({ ...settings, effects_scroll_reveal_speed: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MousePointer2 className="text-accent" size={18}/> Efeitos Especiais</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/5">
            <div className="space-y-0.5">
              <Label>Efeito Paralax no Hero</Label>
              <p className="text-xs text-muted-foreground">A imagem de fundo move-se levemente ao rolar.</p>
            </div>
            <Switch 
              checked={settings.hero_parallax_active === "true"} 
              onCheckedChange={(c) => setSettings({ ...settings, hero_parallax_active: String(c) })} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}