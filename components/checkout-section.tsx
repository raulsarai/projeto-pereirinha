"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck, TrendingUp, Box } from "lucide-react";

export function CheckoutSection({ dataJson }: { dataJson: string }) {
  const data = JSON.parse(dataJson || "{}");

  return (
    <section className="bg-primary py-20 px-4">
      <div className="mx-auto max-w-5xl bg-card rounded-[3rem] p-8 md:p-16 shadow-2xl border border-border/50 relative overflow-hidden">
        {/* Detalhe visual de fundo */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-xs font-black uppercase tracking-widest border border-accent/20">
              <ShieldCheck size={14} /> Pagamento 100% Seguro
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-secondary uppercase italic leading-none">
              Pronto para <br /> <span className="text-accent">começar?</span>
            </h2>
            
            <p className="text-secondary text-lg leading-relaxed font-medium opacity-80">
              {data.description}
            </p>
            
            <div className="flex flex-wrap gap-8 pt-6">
              {data.show_sales === "true" && (
                <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight">
                  <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                    <TrendingUp size={24} />
                  </div>
                  <span className="text-secondary">
                    + <span className="text-secondary font-black text-xl">{data.sales_count}</span> <br /> Alunos ativos
                  </span>
                </div>
              )}
              
              {data.show_stock === "true" && (
                <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight">
                  <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20">
                    <Box size={24} />
                  </div>
                  <span className="text-secondary">
                    Apenas <span className="text-destructive font-black text-xl">{data.stock_count}</span> <br /> Vagas restantes
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Card de Ação Lateral com mais destaque */}
          <div className="w-full md:w-[400px] flex flex-col items-center gap-8 p-10 rounded-[2.5rem] bg-gradient-to-b from-primary/80 to-primary/40 border-2 border-accent/20 backdrop-blur-md shadow-2xl">
            {data.image_url && (
              <div className="bg-white/90 p-4 rounded-2xl shadow-sm">
                <img 
                  src={data.image_url} 
                  alt={data.platform_name} 
                  className="h-20 w-auto object-contain" 
                />
              </div>
            )}
            
            <div className="w-full relative group">
              {/* Brilho externo ao redor do botão */}
              <div className="absolute -inset-1 bg-accent/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              
              <Button 
                asChild 
                size="lg" 
                className="relative w-full h-24 text-2xl font-black uppercase tracking-widest rounded-2xl ring-4 ring-accent/10 hover:ring-accent/30 transition-all bg-accent text-accent-foreground shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <a href={data.gateway_url} target="_blank" rel="noopener noreferrer">
                  Garantir Acesso
                </a>
              </Button>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-[11px] text-secondary uppercase font-black tracking-[0.25em] opacity-60">
                Processamento Seguro
              </p>
              <div className="px-4 py-1 bg-secondary/10 rounded-full inline-block">
                <p className="text-xs text-primary font-bold uppercase tracking-widest">
                  {data.platform_name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}