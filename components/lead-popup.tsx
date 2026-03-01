"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveLead } from "@/app/admin/actions";
import { useToast } from "@/hooks/use-toast";

interface LeadPopupProps {
  dataJson: string;
  forcedOpen?: boolean;
  onClose?: () => void;
}

export function LeadPopup({ dataJson, forcedOpen = false, onClose }: LeadPopupProps) {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ nome: "", whatsapp: "" });

  const data = JSON.parse(dataJson || "{}");
  const isForm = data.popup_type === "form";

  useEffect(() => {
    if (forcedOpen) setIsVisible(true);
  }, [forcedOpen]);

  useEffect(() => {
    if (hasShown || forcedOpen) return;

    if (data.trigger_type === "timer") {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasShown(true);
      }, parseInt(data.trigger_delay || "5") * 1000);
      return () => clearTimeout(timer);
    } else if (data.trigger_type === "exit") {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setIsVisible(true);
          setHasShown(true);
          document.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [data, hasShown, forcedOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveLead({ 
        ...formData, 
        origem: "Pop-up de Captura" 
      });
      toast({ title: "Dados enviados!", description: "Em breve entraremos em contato." });
      closePopup();
    } catch {
      toast({ title: "Erro ao enviar", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopup = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-primary rounded-[2.5rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-border/50"
          >
            <button 
              onClick={closePopup}
              className="absolute top-5 right-5 z-10 p-2 rounded-full bg-background/20 hover:bg-background/40 text-primary transition-colors"
            >
              <X size={20} />
            </button>

            {data.image_url && (
              <div className="h-44 w-full overflow-hidden border-b border-border/20">
                <img src={data.image_url} className="w-full h-full object-cover" alt="Oferta" />
              </div>
            )}

            <div className="p-10 text-center">
              <h3 className="text-3xl font-black tracking-tight text-primary mb-3 leading-tight">
                {data.title}
              </h3>
              <p className="text-primary text-lg mb-8">
                {data.description}
              </p>

              {isForm ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input 
                    placeholder="Seu nome completo" 
                    required
                    className="h-14 rounded-2xl bg-background/50 border-border/50 text-primary focus:ring-accent"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                  <Input 
                    placeholder="Seu WhatsApp (com DDD)" 
                    required
                    className="h-14 rounded-2xl bg-background/50 border-border/50 text-primary focus:ring-accent"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-16 text-xl font-bold rounded-2xl bg-accent hover:opacity-90 text-accent-foreground shadow-lg transition-all"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send size={20} className="mr-2" />}
                    {data.button_text || "Quero aproveitar!"}
                  </Button>
                </form>
              ) : (
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full h-16 text-xl font-bold rounded-2xl bg-accent hover:opacity-90 text-accent-foreground shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <a href={data.button_link} target="_blank" rel="noopener noreferrer">
                    {data.button_text}
                  </a>
                </Button>
              )}
              
              <p className="mt-6 text-[10px] text-secondary uppercase font-bold tracking-widest opacity-70">
                {isForm ? "Prometemos não enviar spam" : "Você será redirecionado com segurança"}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}