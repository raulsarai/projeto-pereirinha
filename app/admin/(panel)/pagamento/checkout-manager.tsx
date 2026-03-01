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
import { Save, ImageIcon, Loader2, TrendingUp, Box } from "lucide-react";

export function CheckoutManager({ settings }: { settings: Record<string, string> }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [isActive, setIsActive] = useState(settings.section_checkout_active === "true");
  
  const [data, setData] = useState(() => {
    try {
      return JSON.parse(settings.section_checkout_data || "{}");
    } catch {
      return { platform_name: "", description: "", gateway_url: "", image_url: "", show_sales: "false", sales_count: "0", show_stock: "false", stock_count: "0" };
    }
  });

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await updateSettingImage(fd, "checkout_platform");
      if (res.success) setData({ ...data, image_url: res.url });
    } finally {
      setUploading(false);
    }
  };

  const save = () => {
    startTransition(async () => {
      await updateMultipleSiteSettings({
        section_checkout_active: String(isActive),
        section_checkout_data: JSON.stringify(data),
      });
      toast({ title: "Checkout configurado!" });
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
          <CardHeader><CardTitle>Plataforma e Confiança</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-muted/30">
              <Label className="cursor-pointer relative group">
                <div className="h-20 w-40 border-2 border-dashed rounded flex items-center justify-center overflow-hidden">
                  {data.image_url ? <img src={data.image_url} className="object-contain h-full w-full p-2" /> : <ImageIcon className="opacity-20" />}
                  {uploading && <div className="absolute inset-0 bg-background/60 flex items-center justify-center"><Loader2 className="animate-spin" /></div>}
                </div>
                <input type="file" className="hidden" onChange={handleImage} accept="image/*" />
              </Label>
              <span className="text-xs font-bold uppercase">Logo da Plataforma (Ex: Hotmart, Stripe)</span>
            </div>
            <div className="grid gap-2"><Label>Nome da Plataforma</Label><Input value={data.platform_name || ""} onChange={(e) => setData({ ...data, platform_name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Link de Checkout</Label><Input value={data.gateway_url || ""} onChange={(e) => setData({ ...data, gateway_url: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Descrição de Segurança</Label><Textarea value={data.description || ""} onChange={(e) => setData({ ...data, description: e.target.value })} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Gatilhos de Escassez</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2"><TrendingUp size={18} className="text-accent" /><Label>Exibir Total de Vendas</Label></div>
              <Switch checked={data.show_sales === "true"} onCheckedChange={(c) => setData({ ...data, show_sales: String(c) })} />
            </div>
            {data.show_sales === "true" && <div className="grid gap-2 pl-4"><Label>Número de Vendas Realizadas</Label><Input type="number" value={data.sales_count} onChange={(e) => setData({ ...data, sales_count: e.target.value })} /></div>}

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2"><Box size={18} className="text-destructive" /><Label>Exibir Estoque/Vagas</Label></div>
              <Switch checked={data.show_stock === "true"} onCheckedChange={(c) => setData({ ...data, show_stock: String(c) })} />
            </div>
            {data.show_stock === "true" && <div className="grid gap-2 pl-4"><Label>Vagas Disponíveis</Label><Input type="number" value={data.stock_count} onChange={(e) => setData({ ...data, stock_count: e.target.value })} /></div>}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={save} disabled={isPending} className="bg-accent text-accent-foreground font-bold px-8"><Save className="mr-2 h-4 w-4" /> Salvar Checkout</Button>
      </div>
    </div>
  );
}