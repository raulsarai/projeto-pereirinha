"use client";

import { useState, useTransition } from "react";
import { updateMultipleSiteSettings, updateSettingImage } from "@/app/admin/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, Star, Image as ImageIcon, Loader2 } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar_url?: string;
}

export function TestimonialsManager({ settings }: { settings: Record<string, string> }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  
  const [isActive, setIsActive] = useState(settings.section_testimonials_active === "true");
  const [items, setItems] = useState<Testimonial[]>(() => {
    try {
      return JSON.parse(settings.section_testimonials_data || "[]");
    } catch { return []; }
  });

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), name: "", role: "", text: "", rating: 5 }]);
  };

  const updateItem = (id: string, field: keyof Testimonial, value: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(id);
    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await updateSettingImage(fd, `temp_avatar_${id}`);
      if (res.success) {
        updateItem(id, "avatar_url", res.url);
        toast({ title: "Foto enviada!" });
      }
    } finally {
      setUploadingId(null);
    }
  };

  const save = () => {
    startTransition(async () => {
      await updateMultipleSiteSettings({
        section_testimonials_active: String(isActive),
        section_testimonials_data: JSON.stringify(items),
      });
      toast({ title: "Depoimentos atualizados!" });
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Configurações de Prova Social</CardTitle>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {items.map((item) => (
          <Card key={item.id} className="relative overflow-hidden border-2 transition-all hover:border-accent/50">
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-[150px_1fr_auto]">
                <div className="flex flex-col items-center gap-2">
                  <Label className="cursor-pointer group relative">
                    <div className="h-24 w-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted">
                      {item.avatar_url ? (
                        <img src={item.avatar_url} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      )}
                      {uploadingId === item.id && (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                          <Loader2 className="animate-spin" />
                        </div>
                      )}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleAvatarUpload(e, item.id)} />
                  </Label>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Foto / Logo</span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      {/* Correção 1: Adicionado || "" para evitar erro de input controlado */}
                      <Input value={item.name || ""} onChange={(e) => updateItem(item.id, "name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Rating (0 a 5)</Label>
                      <div className="flex items-center gap-2">
                        {/* Correção 2: Tratamento de NaN e fallback para string vazia */}
                        <Input 
                          type="number" 
                          step="0.1" 
                          min="0" 
                          max="5" 
                          value={isNaN(item.rating) ? "" : item.rating} 
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            updateItem(item.id, "rating", isNaN(val) ? 0 : val);
                          }} 
                        />
                        <Star className="text-yellow-500 fill-yellow-500" size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Cargo / Relação</Label>
                    <Input value={item.role || ""} onChange={(e) => updateItem(item.id, "role", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Texto do Depoimento</Label>
                    <Textarea value={item.text || ""} onChange={(e) => updateItem(item.id, "text", e.target.value)} rows={3} />
                  </div>
                </div>

                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setItems(items.filter(i => i.id !== item.id))}>
                  <Trash2 size={20} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
        <Button variant="outline" onClick={addItem} className="gap-2"><Plus size={18} /> Novo Depoimento</Button>
        <Button onClick={save} disabled={isPending} className="gap-2 bg-accent text-accent-foreground font-bold px-8">
          {isPending ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}