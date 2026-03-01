"use client";

import { useState, useTransition } from "react";
import { updateMultipleSiteSettings, updateSettingImage } from "@/app/admin/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, ImageIcon, Loader2 } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
}

export function PartnersManager({ settings }: { settings: Record<string, string> }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(settings.section_partners_active === "true");
  
  const [items, setItems] = useState<Partner[]>(() => {
    try {
      return JSON.parse(settings.section_partners_data || "[]");
    } catch { return []; }
  });

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), name: "", logo_url: "" }]);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingId(id);
    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await updateSettingImage(fd, `partner_${id}`);
      if (res.success) {
        setItems(items.map(item => item.id === id ? { ...item, logo_url: res.url! } : item));
        toast({ title: "Logo atualizada!" });
      }
    } finally {
      setUploadingId(null);
    }
  };

  const save = () => {
    startTransition(async () => {
      await updateMultipleSiteSettings({
        section_partners_active: String(isActive),
        section_partners_data: JSON.stringify(items),
      });
      toast({ title: "Lista de parceiros salva!" });
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Configuração</CardTitle>
          <div className="flex items-center gap-2">
            <Label>Ativar Seção no Site</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="relative group">
            <CardContent className="pt-6 space-y-4">
              <Label className="cursor-pointer block">
                <div className="h-32 w-full border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-muted relative">
                  {item.logo_url ? (
                    <img src={item.logo_url} className="h-full w-full object-contain p-4" alt={item.name} />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                  )}
                  {uploadingId === item.id && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <Loader2 className="animate-spin" />
                    </div>
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, item.id)} />
              </Label>
              <Input 
                placeholder="Nome da Empresa" 
                value={item.name || ""} 
                onChange={(e) => setItems(items.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))} 
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-destructive"
                onClick={() => setItems(items.filter(i => i.id !== item.id))}
              >
                <Trash2 size={16} className="mr-2" /> Remover
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
        <Button variant="outline" onClick={addItem} className="gap-2"><Plus size={18} /> Novo Parceiro</Button>
        <Button onClick={save} disabled={isPending} className="gap-2 bg-accent text-accent-foreground font-bold px-8">
          <Save size={18} /> {isPending ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}