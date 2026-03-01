"use client";

import { useState, useTransition } from "react";
import { updateMultipleSiteSettings } from "@/app/admin/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export function FaqManager({ settings }: { settings: Record<string, string> }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  
  // Estado para o Switch de ativação
  const [isActive, setIsActive] = useState(settings.section_faq_active === "true");
  
  // Estado para a lista de FAQ decodificada do JSON
  const [items, setItems] = useState<FaqItem[]>(() => {
    try {
      return JSON.parse(settings.section_faq_data || "[]");
    } catch {
      return [];
    }
  });

  const addItem = () => {
    const newItem: FaqItem = { id: crypto.randomUUID(), question: "", answer: "" };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof FaqItem, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const saveFaq = () => {
    startTransition(async () => {
      try {
        await updateMultipleSiteSettings({
          section_faq_active: String(isActive),
          section_faq_data: JSON.stringify(items),
        });
        toast({ title: "FAQ atualizado com sucesso!" });
      } catch (error) {
        toast({ title: "Erro ao salvar FAQ", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Configurações de Exibição</CardTitle>
          <div className="flex items-center gap-2">
            <Label>Ativar FAQ no site</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={item.id} className="relative group">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 pt-2">
                  <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid gap-2">
                    <Label>Pergunta</Label>
                    <Input
                      value={item.question}
                      onChange={(e) => updateItem(item.id, "question", e.target.value)}
                      placeholder="Ex: Qual o horário de funcionamento?"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Resposta</Label>
                    <Textarea
                      value={item.answer}
                      onChange={(e) => updateItem(item.id, "answer", e.target.value)}
                      placeholder="Descreva a resposta detalhadamente..."
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={addItem} className="gap-2">
          <Plus size={18} /> Adicionar Pergunta
        </Button>
        <Button onClick={saveFaq} disabled={isPending} className="gap-2 bg-accent text-accent-foreground font-bold">
          <Save size={18} /> {isPending ? "Salvando..." : "Salvar FAQ"}
        </Button>
      </div>
    </div>
  );
}