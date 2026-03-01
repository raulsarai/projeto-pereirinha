"use client";

import { useState } from "react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent 
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { updateSiteSetting } from "@/app/admin/actions";
import { toast } from "sonner";

interface SectionItem {
  id: string;
  label: string;
}

const SECTION_LABELS: Record<string, string> = {
  info: "Informações Gerais",
  registration: "Formulário de Inscrição",
  stats: "Estatísticas",
  social: "Redes Sociais",
  comunicados: "Comunicados",
  cta: "Chamada para Ação (CTA)",
  faq: "Perguntas Frequentes",
  testimonials: "Depoimentos",
  partners: "Parceiros",
  video: "Secção de Vídeo",
  gallery: "Galeria de Fotos",
  checkout: "Checkout de Pagamento",
  pricing: "Planos e Preços",
  booking: "Agendamento Online",
};

function SortableItem({ id, label }: SectionItem) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "relative z-50" : ""}>
      <Card className="flex items-center p-4 mb-2 bg-card border-border">
        <button {...attributes} {...listeners} className="mr-4 cursor-grab active:cursor-grabbing text-muted-foreground">
          <GripVertical className="h-5 w-5" />
        </button>
        <span className="font-medium">{label}</span>
      </Card>
    </div>
  );
}

export function OrderManager({ initialOrder }: { initialOrder: string }) {
  const [items, setItems] = useState<SectionItem[]>(
    initialOrder.split(",").map(key => ({ id: key, label: SECTION_LABELS[key] || key }))
  );
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const newOrder = items.map(i => i.id).join(",");
      await updateSiteSetting("sections_order", newOrder);
      toast.success("Ordem atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar a ordenação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-4 flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="gap-2">
          <Save className="h-4 w-4" />
          {loading ? "Salvando..." : "Guardar Ordenação"}
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} label={item.label} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}