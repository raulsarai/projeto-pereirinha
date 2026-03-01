"use client";

import { useState, useTransition } from "react";
import {
  updateMultipleSiteSettings,
  updateSettingImage,
} from "@/app/admin/actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  ImageIcon,
  Loader2,
  Eye,
  MousePointerClick,
  Clock,
  Trash2,
} from "lucide-react";
import { LeadPopup } from "@/components/lead-popup";

interface PopupData {
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  trigger_type: "timer" | "exit";
  trigger_delay: string;
  image_url: string;
  popup_type: "button" | "form"; // Agora obrigatório no estado local
}

export function PopupManager({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [isActive, setIsActive] = useState(
    settings.section_popup_active === "true",
  );

  const [data, setData] = useState<PopupData>(() => {
    try {
      const parsed = JSON.parse(settings.section_popup_data || "{}");
      return {
        title: parsed.title || "Espera! Não vás embora ainda...",
        description: parsed.description || "Temos uma oferta especial para ti.",
        button_text: parsed.button_text || "Quero o meu desconto!",
        button_link: parsed.button_link || "",
        trigger_type: parsed.trigger_type || "timer",
        trigger_delay: parsed.trigger_delay || "5",
        image_url: parsed.image_url || "",
        popup_type: parsed.popup_type || "button", // Especificação do tipo salva no banco
      };
    } catch {
      return {
        title: "Espera! Não vás embora ainda...",
        description: "Temos uma oferta especial para ti.",
        button_text: "Quero o meu desconto!",
        button_link: "",
        trigger_type: "timer",
        trigger_delay: "5",
        image_url: "",
        popup_type: "button",
      };
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await updateSettingImage(fd, "popup_image_temp");
      if (res.success && res.url) {
        setData({ ...data, image_url: res.url });
        toast({ title: "Imagem do pop-up atualizada!" });
      }
    } catch (error) {
      toast({ title: "Erro no upload", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const save = () => {
    startTransition(async () => {
      await updateMultipleSiteSettings({
        section_popup_active: String(isActive),
        section_popup_data: JSON.stringify(data),
      });
      toast({ title: "Configurações do pop-up salvas!" });
    });
  };

  return (
    <div className="space-y-6">
      {isPreviewOpen && (
        <LeadPopup
          dataJson={JSON.stringify(data)}
          forcedOpen={true}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

      <Card className="border-accent/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Status e Visualização</CardTitle>
            <CardDescription>
              Ative a campanha e teste o visual antes de publicar.
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              className="gap-2 border-accent text-accent hover:bg-accent hover:text-white"
            >
              <Eye size={18} /> Visualizar Pop-up
            </Button>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-accent" /> Conteúdo Visual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4 p-4 border rounded-xl bg-muted/30">
              <Label className="cursor-pointer relative group w-full">
                <div className="h-48 w-full border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-background">
                  {data.image_url ? (
                    <img
                      src={data.image_url}
                      className="object-cover h-full w-full"
                      alt="Preview"
                    />
                  ) : (
                    <div className="text-center space-y-2">
                      <ImageIcon className="mx-auto h-10 w-10 opacity-20" />
                      <p className="text-xs text-muted-foreground">
                        Clique para subir imagem
                      </p>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <Loader2 className="animate-spin text-accent" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </Label>
              {data.image_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive h-8"
                  onClick={() => setData({ ...data, image_url: "" })}
                >
                  <Trash2 size={14} className="mr-2" /> Remover Imagem
                </Button>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Título Chamativo</Label>
              <Input
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Ex: Espera! Ganhe 10% de desconto"
              />
            </div>
            <div className="grid gap-2">
              <Label>Texto de Apoio (Descrição)</Label>
              <Textarea
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                rows={3}
                placeholder="Explique o benefício para o cliente não sair da página."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointerClick className="h-5 w-5 text-accent" /> Gatilho e Ação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Como o pop-up deve aparecer?</Label>
              <Select
                value={data.trigger_type}
                onValueChange={(v: "timer" | "exit") =>
                  setData({ ...data, trigger_type: v })
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timer">
                    <div className="flex items-center gap-2">
                      <Clock size={14} /> <span>Por Tempo de Tela</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="exit">
                    <div className="flex items-center gap-2">
                      <MousePointerClick size={14} /> <span>Intenção de Saída</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {data.trigger_type === "timer" && (
              <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
                <Label>Tempo de espera (Segundos)</Label>
                <Input
                  type="number"
                  value={data.trigger_delay}
                  onChange={(e) =>
                    setData({ ...data, trigger_delay: e.target.value })
                  }
                />
              </div>
            )}

            <hr className="border-border" />

            {/* Inclusão do Modo de Interação dentro do CardContent para manter o estilo */}
            <div className="space-y-3">
              <Label className="text-accent font-bold">Modo de Interação</Label>
              <Select
                value={data.popup_type}
                onValueChange={(v: "button" | "form") => setData({ ...data, popup_type: v })}
              >
                <SelectTrigger className="h-12 border-accent/40">
                  <SelectValue placeholder="Escolha o modo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="button">Apenas Botão (Redirecionar)</SelectItem>
                  <SelectItem value="form">Formulário (Capturar Lead)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground italic">
                O modo formulário salvará o contato automaticamente no seu CRM.
              </p>
            </div>

            <div className="grid gap-2 pt-2">
              <Label>Texto do Botão (CTA)</Label>
              <Input
                value={data.button_text}
                onChange={(e) =>
                  setData({ ...data, button_text: e.target.value })
                }
              />
            </div>

            {/* O link de destino só é essencial se o modo for 'button' */}
            <div className="grid gap-2">
              <Label>Link de Destino {data.popup_type === 'form' && '(Opcional pós-envio)'}</Label>
              <Input
                value={data.button_link}
                onChange={(e) =>
                  setData({ ...data, button_link: e.target.value })
                }
                placeholder="https://wa.me/... ou link de checkout"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          onClick={save}
          disabled={isPending}
          className="bg-accent hover:bg-accent/90 text-white font-bold h-12 px-10 shadow-lg shadow-accent/20"
        >
          {isPending ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Save className="mr-2 h-5 w-5" />
          )}
          Salvar Campanha
        </Button>
      </div>
    </div>
  );
}