"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ImageIcon, Type, MousePointer2, CheckCircle2, 
  Plus, Trash2, Italic, Underline, Sparkles, AlignCenter, AlignLeft, AlignRight, Loader2 
} from "lucide-react";

const GOOGLE_FONTS = [
  { name: "Inter", value: "Inter" },
  { name: "Montserrat", value: "Montserrat" },
  { name: "Oswald", value: "Oswald" },
  { name: "Archivo Black", value: "Archivo Black" },
  { name: "Playfair Display", value: "Playfair Display" },
  { name: "Poppins", value: "Poppins" },
];

const AVAILABLE_ICONS = ["CheckCircle2", "Star", "ShieldCheck", "Users", "Trophy", "Zap"];

export function HeroSettings({ settings, setSettings, handleImage, updateSettingMedia, isPending }: any) {
  const [loadingStates, setLoadingStates] = useState({ logo: false, banner: false, video: false });

  const updateLoading = (key: string, val: boolean) => setLoadingStates(prev => ({ ...prev, [key]: val }));
  const footerChips = JSON.parse(settings.hero_footer_chips_data || "[]");
  const updateChips = (items: any[]) => setSettings({ ...settings, hero_footer_chips_data: JSON.stringify(items) });

  const TypographyBlock = ({ title, prefix, value, visibleKey }: any) => (
    <div className="space-y-4 p-6 border rounded-3xl bg-card shadow-sm">
      <div className="flex justify-between items-center">
        <Label className="font-black text-accent uppercase tracking-tighter">{title}</Label>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold opacity-50">VISÍVEL</span>
          <Switch checked={settings[visibleKey] !== "false"} onCheckedChange={(c) => setSettings({...settings, [visibleKey]: String(c)})} />
        </div>
      </div>
      <Textarea value={value ?? ""} onChange={(e) => setSettings({...settings, [`hero_${prefix}`]: e.target.value})} className="font-bold h-20" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-[10px] font-bold">FONTE</Label>
          <Select value={settings[`hero_${prefix}_font`] || "Inter"} onValueChange={(v) => setSettings({...settings, [`hero_${prefix}_font`]: v})}>
            <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
            <SelectContent>{GOOGLE_FONTS.map(f => <SelectItem key={f.value} value={f.value}>{f.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] font-bold">TAMANHO</Label>
          <Input value={settings[`hero_${prefix}_size`] || ""} onChange={(e) => setSettings({...settings, [`hero_${prefix}_size`]: e.target.value})} className="h-8" placeholder="ex: 5rem" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant={settings[`hero_${prefix}_italic`] === "true" ? "default" : "outline"} size="sm" className="flex-1" onClick={() => setSettings({...settings, [`hero_${prefix}_italic`]: settings[`hero_${prefix}_italic`] === "true" ? "false" : "true"})}><Italic size={14}/></Button>
        <Button variant={settings[`hero_${prefix}_underline`] === "true" ? "default" : "outline"} size="sm" className="flex-1" onClick={() => setSettings({...settings, [`hero_${prefix}_underline`]: settings[`hero_${prefix}_underline`] === "true" ? "false" : "true"})}><Underline size={14}/></Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 mt-6">
      {/* 1. MÍDIA E IDENTIDADE */}
      <Card className="rounded-[2rem] border-accent/20 overflow-hidden shadow-xl">
        <CardHeader className="bg-muted/30 p-8"><CardTitle className="flex items-center gap-2"><ImageIcon className="text-accent" /> 1. Identidade e Mídia</CardTitle></CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Bloco Logo */}
            <div className="space-y-4 border p-4 rounded-xl bg-muted/5 relative">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <Label className="font-bold">Logo</Label>
                  <div className="flex items-center gap-2"><span className="text-[10px] opacity-50">VISÍVEL</span><Switch checked={settings.hero_logo_visible !== "false"} onCheckedChange={(c) => setSettings({...settings, hero_logo_visible: String(c)})} /></div>
                </div>
                {settings.logo_url && !isPending && <Button variant="destructive" size="icon" className="h-7 w-7 rounded-full" onClick={() => setSettings({ ...settings, logo_url: "" })}><Trash2 size={14} /></Button>}
              </div>
              <Input type="file" accept="image/*" disabled={isPending} onChange={async (e) => { updateLoading('logo', true); await handleImage(e, "logo_url"); updateLoading('logo', false); }} />
              <div className="relative w-full h-32 flex items-center justify-center bg-white/5 rounded-lg overflow-hidden border border-dashed">
                {(isPending || loadingStates.logo) ? <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"><Loader2 className="h-6 w-6 animate-spin text-accent" /><span className="text-[10px] mt-2 font-bold animate-pulse">PROCESSANDO...</span></div> : settings.logo_url ? <img src={settings.logo_url} className="max-h-full max-w-full object-contain p-2" alt="Logo" /> : <span className="opacity-40 text-xs italic">Sem Logo</span>}
              </div>
            </div>

            {/* Bloco Banner */}
            <div className="space-y-4 border p-4 rounded-xl bg-muted/5 relative">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <Label className="font-bold">Banner</Label>
                  <div className="flex items-center gap-2"><span className="text-[10px] opacity-50">VISÍVEL</span><Switch checked={settings.hero_media_visible !== "false"} onCheckedChange={(c) => setSettings({...settings, hero_media_visible: String(c)})} /></div>
                </div>
                {settings.hero_image_url && !isPending && <Button variant="destructive" size="icon" className="h-7 w-7 rounded-full" onClick={() => setSettings({ ...settings, hero_image_url: "" })}><Trash2 size={14} /></Button>}
              </div>
              <Input type="file" accept="image/*" disabled={isPending} onChange={async (e) => { updateLoading('banner', true); await handleImage(e, "hero_image_url"); updateLoading('banner', false); }} />
              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-dashed flex items-center justify-center">
                {(isPending || loadingStates.banner) ? <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"><Loader2 className="h-6 w-6 animate-spin text-accent" /><span className="text-[10px] mt-2 font-bold animate-pulse">ENVIANDO...</span></div> : settings.hero_image_url ? <img src={settings.hero_image_url} className="w-full h-full object-cover" alt="Banner" /> : <span className="opacity-40 text-xs italic">Sem Imagem</span>}
              </div>
            </div>

            {/* Bloco Vídeo */}
            <div className="space-y-4 border p-4 rounded-xl bg-accent/5 relative">
              <div className="flex justify-between items-center text-accent">
                <div className="flex flex-col gap-1">
                  <Label className="font-bold">Vídeo</Label>
                  <div className="flex items-center gap-2"><span className="text-[10px] opacity-50">VISÍVEL</span><Switch checked={settings.hero_video_visible !== "false"} onCheckedChange={(c) => setSettings({...settings, hero_video_visible: String(c)})} /></div>
                </div>
                {settings.hero_video_url && !isPending && <Button variant="destructive" size="icon" className="h-7 w-7 rounded-full" onClick={() => setSettings({ ...settings, hero_video_url: "" })}><Trash2 size={14} /></Button>}
              </div>
              <Input type="file" accept="video/mp4,video/webm" disabled={isPending} onChange={async (e) => { if (!e.target.files?.[0]) return; updateLoading('video', true); const fd = new FormData(); fd.append("media", e.target.files[0]); const res = await updateSettingMedia(fd, "hero_video_url"); if (res.success) setSettings({ ...settings, hero_video_url: res.url }); updateLoading('video', false); }} />
              <div className="relative w-full h-32 rounded-lg overflow-hidden bg-black border border-dashed flex items-center justify-center">
                {(isPending || loadingStates.video) ? <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"><Loader2 className="h-6 w-6 animate-spin text-accent" /><span className="text-[10px] mt-2 font-bold animate-pulse text-white">SUBINDO VÍDEO...</span></div> : settings.hero_video_url ? <video src={settings.hero_video_url} className="w-full h-full object-cover" muted /> : <span className="opacity-40 text-xs italic text-white">Sem Vídeo</span>}
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="space-y-1"><Label>Tamanho Logo</Label><Input type="number" value={settings.hero_logo_size || "192"} onChange={(e)=>setSettings({...settings, hero_logo_size: e.target.value})} /></div>
            <div className="space-y-1"><Label>Horizontal</Label><Select value={settings.hero_align_h} onValueChange={(v)=>setSettings({...settings, hero_align_h: v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="start">Esquerda</SelectItem><SelectItem value="center">Centro</SelectItem><SelectItem value="end">Direita</SelectItem></SelectContent></Select></div>
            <div className="space-y-1"><Label>Vertical</Label><Select value={settings.hero_align_v} onValueChange={(v)=>setSettings({...settings, hero_align_v: v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="start">Topo</SelectItem><SelectItem value="center">Meio</SelectItem><SelectItem value="end">Base</SelectItem></SelectContent></Select></div>
            <div className="space-y-1"><Label>Estilo Logo</Label><Select value={settings.hero_logo_style} onValueChange={(v)=>setSettings({...settings, hero_logo_style: v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="rounded-full">Circular</SelectItem><SelectItem value="rounded-2xl">Arredondado</SelectItem></SelectContent></Select></div>
          </div>
        </CardContent>
      </Card>

      {/* 2. TIPOGRAFIA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TypographyBlock title="Título" prefix="title" value={settings.hero_title} visibleKey="hero_title_visible" />
        <TypographyBlock title="Subtítulo" prefix="subtitle" value={settings.hero_subtitle} visibleKey="hero_subtitle_visible" />
        <TypographyBlock title="Descrição" prefix="description" value={settings.hero_description} visibleKey="hero_desc_visible" />
      </div>

      {/* 3. AÇÕES */}
      <Card className="rounded-[2rem] border-accent/20 overflow-hidden shadow-xl">
        <CardHeader className="bg-muted/30 p-8"><CardTitle className="flex items-center gap-2"><MousePointer2 className="text-accent" /> 3. Ações e Botões</CardTitle></CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 p-6 border rounded-3xl bg-accent/5">
              <div className="flex justify-between items-center"><Label className="font-bold">Botão Primário</Label><Switch checked={settings.hero_button_visible !== "false"} onCheckedChange={(c)=>setSettings({...settings, hero_button_visible: String(c)})} /></div>
              <Input placeholder="Texto" value={settings.hero_button_text || ""} onChange={(e) => setSettings({...settings, hero_button_text: e.target.value})} />
              <Input placeholder="Link" value={settings.hero_button_link || ""} onChange={(e) => setSettings({...settings, hero_button_link: e.target.value})} />
            </div>
            <div className="space-y-4 p-6 border rounded-3xl">
              <div className="flex justify-between items-center"><Label className="font-bold">Botão Secundário</Label><Switch checked={settings.hero_button_2_active === "true"} onCheckedChange={(c)=>setSettings({...settings, hero_button_2_active: String(c)})} /></div>
              <Input placeholder="Texto" value={settings.hero_button_2_text || ""} onChange={(e) => setSettings({...settings, hero_button_2_text: e.target.value})} />
              <Input placeholder="Link" value={settings.hero_button_2_link || ""} onChange={(e) => setSettings({...settings, hero_button_2_link: e.target.value})} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}