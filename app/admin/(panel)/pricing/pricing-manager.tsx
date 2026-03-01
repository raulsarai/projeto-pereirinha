"use client";

import { useState, useTransition } from "react";
import { savePricingSettings } from "@/app/admin/actions"; // Importando a nova action
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, Star } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  button_text: string;
  button_link: string;
  is_featured: boolean;
  features_raw?: string;
}

interface PricingManagerProps {
  initialData: string;   // JSON string dos planos
  initialActive: boolean; // Status booleano
}

export function PricingManager({ initialData, initialActive }: PricingManagerProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isActive, setIsActive] = useState(initialActive);
  
  const [plans, setPlans] = useState<Plan[]>(() => {
    try {
      const parsed = JSON.parse(initialData || "[]");
      // Garante que é um array e mapeia para adicionar o campo auxiliar de edição
      return Array.isArray(parsed) ? parsed.map((p: any) => ({
        ...p,
        features_raw: Array.isArray(p.features) ? p.features.join("\n") : ""
      })) : [];
    } catch {
      return [];
    }
  });

  const addPlan = () => {
    if (plans.length >= 4) {
      toast({ title: "Limite atingido", description: "Máximo de 4 planos permitidos.", variant: "destructive" });
      return;
    }
    const newPlan: Plan = {
      id: crypto.randomUUID(),
      name: "Novo Plano",
      price: "R$ 00",
      period: "mês",
      features: ["Benefício 1", "Benefício 2"],
      features_raw: "Benefício 1\nBenefício 2",
      button_text: "Assinar",
      button_link: "",
      is_featured: false,
    };
    setPlans([...plans, newPlan]);
  };

  const updatePlan = (id: string, field: keyof Plan, value: any) => {
    setPlans(plans.map(p => {
      if (p.id !== id) return p;
      
      if (field === 'features_raw') {
        return { ...p, features_raw: value, features: value.split('\n').filter((l: string) => l.trim() !== '') };
      }
      
      if (field === 'is_featured' && value === true) {
        plans.forEach(plan => { if (plan.id !== id) plan.is_featured = false });
      }

      return { ...p, [field]: value };
    }));
  };

  const removePlan = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  const save = () => {
    startTransition(async () => {
      // Limpa os dados auxiliares antes de enviar para o server action
      const cleanPlans = plans.map(({ features_raw, ...rest }) => rest);
      
      // Usa a nova action específica
      const result = await savePricingSettings(isActive, JSON.stringify(cleanPlans));

      if (result.success) {
        toast({ title: "Planos salvos com sucesso!" });
      } else {
        toast({ title: "Erro ao salvar", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-accent/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Status da Seção</CardTitle>
            <CardDescription>Ative a exibição dos planos no site.</CardDescription>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
        {plans.map((plan, index) => (
          <Card key={plan.id} className={`relative transition-all ${plan.is_featured ? 'border-accent shadow-lg bg-accent/5' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                    {index + 1}
                  </span>
                  <CardTitle className="text-lg">
                    <Input 
                      value={plan.name} 
                      onChange={(e) => updatePlan(plan.id, 'name', e.target.value)}
                      className="h-8 font-bold border-none bg-transparent p-0 focus-visible:ring-0"
                    />
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant={plan.is_featured ? "default" : "ghost"}
                    className={plan.is_featured ? "bg-accent text-accent-foreground" : "text-muted-foreground"}
                    onClick={() => updatePlan(plan.id, 'is_featured', !plan.is_featured)}
                    title="Destacar este plano"
                  >
                    <Star size={16} fill={plan.is_featured ? "currentColor" : "none"} />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => removePlan(plan.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-xs">Preço</Label>
                  <Input 
                    value={plan.price} 
                    onChange={(e) => updatePlan(plan.id, 'price', e.target.value)}
                    className="font-bold"
                  />
                </div>
                <div className="w-1/3">
                  <Label className="text-xs">Período</Label>
                  <Input 
                    value={plan.period} 
                    placeholder="mês" 
                    onChange={(e) => updatePlan(plan.id, 'period', e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Benefícios (Um por linha)</Label>
                <Textarea 
                  rows={4}
                  value={plan.features_raw}
                  onChange={(e) => updatePlan(plan.id, 'features_raw', e.target.value)}
                  className="resize-none text-sm"
                  placeholder="- Acesso total&#10;- Suporte 24h"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Texto Botão</Label>
                  <Input 
                    value={plan.button_text} 
                    onChange={(e) => updatePlan(plan.id, 'button_text', e.target.value)} 
                  />
                </div>
                <div>
                  <Label className="text-xs">Link Checkout</Label>
                  <Input 
                    value={plan.button_link} 
                    placeholder="https://..." 
                    onChange={(e) => updatePlan(plan.id, 'button_link', e.target.value)} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {plans.length < 4 && (
          <Button 
            variant="outline" 
            className="h-full min-h-[300px] border-dashed flex flex-col gap-2 hover:bg-muted/50 hover:border-accent/50"
            onClick={addPlan}
          >
            <Plus size={32} className="text-muted-foreground" />
            <span className="font-bold text-muted-foreground">Adicionar Plano</span>
          </Button>
        )}
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={save} disabled={isPending} className="bg-accent text-accent-foreground font-bold h-12 px-8">
          <Save className="mr-2 h-5 w-5" /> Salvar Alterações
        </Button>
      </div>
    </div>
  );
}