"use client";

import { useState, useTransition } from "react";
import { updateMultipleSiteSettings } from "@/app/admin/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save, Youtube, MousePointer2, Clock, Trash2 } from "lucide-react";

export function VideoManager({ settings }: { settings: Record<string, string> }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isActive, setIsActive] = useState(settings.section_video_active === "true");

  const [data, setData] = useState(() => {
    try {
      return JSON.parse(settings.section_video_data || "{}");
    } catch {
      return {
        video_url: "",
        cta_active: "false",
        cta_text: "Quero garantir minha vaga!",
        cta_link: "",
        cta_color: "", // Vazio para herdar a cor dinâmica
        timer_active: "false",
        youtube_controls: "true"
      };
    }
  });

  const save = () => {
    startTransition(async () => {
      await updateMultipleSiteSettings({
        section_video_active: String(isActive),
        section_video_data: JSON.stringify(data),
      });
      toast({ title: "Configurações de vídeo salvas!" });
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Status da Seção</CardTitle>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Youtube className="h-5 w-5 text-red-600" /> Vídeo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Link do YouTube</Label>
              <Input value={data.video_url || ""} onChange={(e) => setData({ ...data, video_url: e.target.value })} />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label>Exibir Controles</Label>
              <Switch checked={data.youtube_controls === "true"} onCheckedChange={(c) => setData({ ...data, youtube_controls: String(c) })} />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <Label>Ativar Timer Global</Label>
                <p className="text-[10px] text-muted-foreground font-bold uppercase">Sincronizado com o site</p>
              </div>
              <Switch checked={data.timer_active === "true"} onCheckedChange={(c) => setData({ ...data, timer_active: String(c) })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MousePointer2 className="h-5 w-5 text-accent" /> Botão CTA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Ativar Botão</Label>
              <Switch checked={data.cta_active === "true"} onCheckedChange={(c) => setData({ ...data, cta_active: String(c) })} />
            </div>
            <div className="grid gap-2"><Label>Texto</Label><Input value={data.cta_text || ""} onChange={(e) => setData({ ...data, cta_text: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Link</Label><Input value={data.cta_link || ""} onChange={(e) => setData({ ...data, cta_link: e.target.value })} /></div>
            
            <div className="space-y-2">
              <Label>Cor (Deixe vazio para usar a cor do site)</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  className="w-14 h-10 p-1" 
                  value={data.cta_color || "#22c55e"} 
                  onChange={(e) => setData({ ...data, cta_color: e.target.value })} 
                />
                <Input 
                  className="flex-1" 
                  placeholder="Ex: #22c55e"
                  value={data.cta_color || ""} 
                  onChange={(e) => setData({ ...data, cta_color: e.target.value })} 
                />
                {data.cta_color && (
                  <Button variant="ghost" size="icon" onClick={() => setData({ ...data, cta_color: "" })}><Trash2 size={14} /></Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={save} disabled={isPending} className="bg-accent text-accent-foreground font-bold h-12 px-10">
          <Save className="mr-2 h-5 w-5" /> Salvar Tudo
        </Button>
      </div>
    </div>
  );
}