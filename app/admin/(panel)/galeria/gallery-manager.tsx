"use client";

import { useState, useTransition } from "react";
import { updateMultipleSiteSettings, updateSettingImage } from "@/app/admin/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, LayoutGrid, Loader2, ImageIcon } from "lucide-react";

export function GalleryManager({ settings }: { settings: Record<string, string> }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  
  const [isActive, setIsActive] = useState(settings.section_gallery_active === "true");
  const [data, setData] = useState(() => {
    try {
      return JSON.parse(settings.section_gallery_data || '{"layout": "grid", "images": []}');
    } catch {
      return { layout: "grid", images: [] };
    }
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await updateSettingImage(fd, `gallery_${Date.now()}`);
      if (res.success) {
        setData({ ...data, images: [...data.images, { id: Date.now().toString(), url: res.url }] });
        toast({ title: "Imagem adicionada!" });
      }
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (id: string) => {
    setData({ ...data, images: data.images.filter((img: any) => img.id !== id) });
  };

  const save = () => {
    startTransition(async () => {
      await updateMultipleSiteSettings({
        section_gallery_active: String(isActive),
        section_gallery_data: JSON.stringify(data),
      });
      toast({ title: "Galeria salva com sucesso!" });
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Configuração Geral</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label>Ativar Galeria</Label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Layout de Exibição</Label>
            <Select value={data.layout} onValueChange={(v) => setData({ ...data, layout: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grade Simples (3 colunas)</SelectItem>
                <SelectItem value="mosaic">Mosaico Dinâmico</SelectItem>
                <SelectItem value="slider">Slider / Carrossel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Adicionar Foto</Label>
            <Button variant="outline" className="w-full relative" disabled={uploading}>
              {uploading ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" />}
              {uploading ? "Enviando..." : "Upload de Imagem"}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} accept="image/*" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.images.map((img: any) => (
          <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border">
            <img src={img.url} className="w-full h-full object-cover" alt="Galeria" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="destructive" size="icon" onClick={() => removeImage(img.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={save} disabled={isPending} className="bg-accent text-accent-foreground font-bold px-8">
          <Save className="mr-2 h-4 w-4" /> Salvar Galeria
        </Button>
      </div>
    </div>
  );
}