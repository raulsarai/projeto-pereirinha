"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck } from "lucide-react";

export function VisibilitySettings({ settings, setSettings }: any) {
  // Lista de seções opcionais (possuem switch)
  const optionalSections = [
    { id: "info", label: "Informações Gerais" },
    { id: "registration", label: "Ficha de Inscrição" },
    { id: "stats", label: "Estatísticas" },
    { id: "social", label: "Redes Sociais" },
    { id: "comunicados", label: "Mural de Comunicados" },
    { id: "cta", label: "Botão Google Forms" },
    { id: "faq", label: "Perguntas (FAQ)" },
    { id: "testimonials", label: "Depoimentos" },
    { id: "partners", label: "Parceiros/Logos" },
    { id: "video", label: "Vídeo Promocional" },
    { id: "gallery", label: "Galeria de Fotos" },
    { id: "checkout", label: "Checkout/Vendas" },
    { id: "pricing", label: "Tabela de Preços" },
    { id: "booking", label: "Agendamento Online" },
    { id: "popup", label: "Popup de Leads" }
  ];

  // Seções obrigatórias (apenas informativo)
  const requiredSections = [
    { id: "hero", label: "Seção Hero (Principal)" },
    { id: "footer", label: "Rodapé do Site" }
  ];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Visibilidade dos Módulos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Grid de Seções Obrigatórias */}
        <div className="grid gap-4 md:grid-cols-2">
          {requiredSections.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-4 border border-dashed rounded-xl bg-muted/30 opacity-80">
              <div className="space-y-0.5">
                <Label className="font-bold text-muted-foreground">{s.label}</Label>
                <p className="text-[10px] text-accent font-black uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck size={10} /> Módulo Obrigatório
                </p>
              </div>
              <div className="bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                <span className="text-[10px] font-bold text-accent">ATIVO</span>
              </div>
            </div>
          ))}
        </div>

        <div className="h-px bg-border w-full my-4" />

        {/* Grid de Seções Opcionais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {optionalSections.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-4 border rounded-xl bg-card hover:bg-muted/50 transition-colors">
              <div className="space-y-0.5">
                <Label className="font-bold">{s.label}</Label>
                <p className="text-[10px] text-muted-foreground uppercase">Módulo {s.id}</p>
              </div>
              <Switch 
                checked={settings[`section_${s.id}_active`] === "true"} 
                onCheckedChange={(c) => setSettings({ ...settings, [`section_${s.id}_active`]: String(c) })} 
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}