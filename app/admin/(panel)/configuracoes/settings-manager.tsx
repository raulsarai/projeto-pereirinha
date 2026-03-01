"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateMultipleSiteSettings, updateSettingImage, updateSettingMedia, updateSiteSetting } from "@/app/admin/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, Globe, ImageIcon, Palette, ListTodo, Eye, Share2, MessageCircle, Sparkles, ShieldCheck, Layout } from "lucide-react";
import { HeroSettings } from "./sections/heroSettings";
import { StatsSettings } from "./sections/StatsSettings";
import { SocialSettings } from "./sections/SocialSettings";
import { LegalSettings } from "./sections/LegalSettings";
import { GeralSettings } from "./sections/GeralSettings";
import { VisibilitySettings } from "./sections/VisibilitySettings";
import { MarketingSettings } from "./sections/MarketingSettings";
import { EffectsSettings } from "./sections/EffectsSettings";
import { AdminDesignSettings } from "./sections/AdminDesignSettings";
import { DesignSettings } from "./sections/DesignSettings";



export function SettingsManager({ settings: initialSettings }: { settings: Record<string, string> }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState(initialSettings);

  const save = () => startTransition(async () => {
    await updateMultipleSiteSettings(settings);
    toast({ title: "Configurações salvas!" });
    router.refresh();
  });

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>, chave: string) {
    if (!e.target.files?.[0]) return;
    const fd = new FormData();
    fd.append("image", e.target.files[0]);
    const res = await updateSettingImage(fd, chave);
    if (res.success) {
      setSettings(prev => ({ ...prev, [chave]: res.url! }));
      toast({ title: "Imagem atualizada!" });
    }
  }

  // Props compartilhadas para facilitar
  const commonProps = { settings, setSettings, handleImage, isPending, updateSettingMedia };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel de Controle</h1>
          <p className="text-muted-foreground">Gerencie todos os aspectos do seu site Whitelabel.</p>
        </div>
        <Button onClick={save} disabled={isPending} className="bg-accent text-accent-foreground font-bold h-12 px-8">
          <Save className="mr-2 h-5 w-5" /> {isPending ? "Salvando..." : "Salvar Tudo"}
        </Button>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="bg-muted p-1 overflow-x-auto flex-nowrap h-14">
          <TabsTrigger value="hero" className="gap-2"><ImageIcon size={16} /> Hero</TabsTrigger>
          <TabsTrigger value="geral" className="gap-2"><Globe size={16} /> Geral</TabsTrigger>
          <TabsTrigger value="design" className="gap-2"><Palette size={16} /> Design</TabsTrigger>
          <TabsTrigger value="stats" className="gap-2"><ListTodo size={16} /> Métricas</TabsTrigger>
          <TabsTrigger value="visibilidade" className="gap-2"><Eye size={16} /> Visibilidade</TabsTrigger>
          <TabsTrigger value="social" className="gap-2"><Share2 size={16} /> Social</TabsTrigger>
          <TabsTrigger value="marketing" className="gap-2"><MessageCircle size={16} /> Marketing</TabsTrigger>
          <TabsTrigger value="efeitos" className="gap-2"><Sparkles size={16} /> Efeitos</TabsTrigger>
          <TabsTrigger value="legal" className="gap-2"><ShieldCheck size={16} /> Jurídico</TabsTrigger>
          <TabsTrigger value="admin" className="gap-2"><Layout size={16} /> Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="hero"><HeroSettings {...commonProps} /></TabsContent>
        <TabsContent value="geral"><GeralSettings {...commonProps} /></TabsContent>
        <TabsContent value="design"><DesignSettings {...commonProps} /></TabsContent>
        <TabsContent value="stats"><StatsSettings {...commonProps} /></TabsContent>
        <TabsContent value="visibilidade"><VisibilitySettings {...commonProps} /></TabsContent>
        <TabsContent value="social"><SocialSettings {...commonProps} /></TabsContent>
        <TabsContent value="marketing"><MarketingSettings {...commonProps} /></TabsContent>
        <TabsContent value="efeitos"><EffectsSettings {...commonProps} /></TabsContent>
        <TabsContent value="legal"><LegalSettings {...commonProps} /></TabsContent>
        <TabsContent value="admin"><AdminDesignSettings {...commonProps} /></TabsContent>
      </Tabs>
    </div>
  );
}