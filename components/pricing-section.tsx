"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  button_text: string;
  button_link: string;
  is_featured: boolean;
}

export function PricingSection({ dataJson }: { dataJson: string | any }) {
  let plans: Plan[] = [];

  try {
    const parsed =
      typeof dataJson === "string" ? JSON.parse(dataJson || "[]") : dataJson;

    if (Array.isArray(parsed)) {
      plans = parsed;
    }
  } catch (error) {
    console.error("Erro ao processar planos:", error);
  }

  if (!plans || plans.length === 0) return null;

  return (
    <section
      id="planos"
      className="bg-primary py-24 px-4 relative overflow-hidden"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-black uppercase tracking-tight md:text-5xl mb-4 text-primary">
            Planos Disponíveis
          </h2>
          <div className="mx-auto h-1.5 w-20 bg-accent mb-6" />
          <p className="max-w-2xl mx-auto text-lg text-primary opacity-50">
            Escolha a opção que melhor se adapta aos seus objetivos e comece sua
            jornada agora mesmo.
          </p>
        </div>

        <div
          className={cn(
            "grid gap-8 w-full items-stretch",
            plans.length === 1
              ? "max-w-md mx-auto grid-cols-1"
              : plans.length === 2
                ? "max-w-4xl mx-auto grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
          )}
        >
          {plans.map((plan) => (
            <div
              key={plan.id || Math.random()}
              className={cn(
                "relative flex flex-col rounded-[2.5rem] p-10 transition-all duration-500 h-full w-full border",
                plan.is_featured
                  ? "bg-card border-accent shadow-[0_20px_50px_rgba(0,0,0,0.3)] scale-105 z-10"
                  : "bg-card/40 border-border hover:border-accent/40 hover:bg-card/60",
              )}
            >
              {plan.is_featured && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-6 py-1.5 text-xs font-black uppercase tracking-widest text-accent-foreground shadow-xl">
                  Mais Popular
                </div>
              )}

              <div className="flex-1">
                <div className="mb-8">
                  <h3
                    className={cn(
                      "text-xs font-black uppercase tracking-[0.2em] mb-4",
                      plan.is_featured ? "text-accent" : "text-secondary",
                    )}
                  >
                    {plan.name || "Sem Nome"}
                  </h3>
                  <div className="flex flex-col gap-1">
                    <span
                      className={cn(
                        "text-5xl font-black uppercase tracking-[0.1em] mb-4",
                        plan.is_featured ? "text-accent" : "text-secondary",
                      )}
                    >
                      {plan.price === "00" ? "Grátis" : `R$${plan.price}` || "Grátis"}
                    </span>
                    {plan.period && plan.price !== "00" && (
                      <span className="text-sm font-bold text-secondary uppercase tracking-widest opacity-60">
                        Por {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-px w-full bg-border/50 mb-8" />

                <ul className="mb-10 space-y-5">
                  {Array.isArray(plan.features) &&
                    plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div
                          className={cn(
                            "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                            plan.is_featured
                              ? "bg-accent text-accent-foreground"
                              : "bg-secondary/20 text-accent",
                          )}
                        >
                          <Check className="h-3 w-3 stroke-[4px]" />
                        </div>
                        <span className={cn("text-primary font-medium leading-tight",
                            plan.is_featured
                              ? "text-accent-foreground"
                              : "text-accent",
                          )}>
                          {feature}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="mt-auto">
                <Button
                  asChild
                  size="lg"
                  className={cn(
                    "w-full h-16 rounded-2xl font-black uppercase tracking-widest transition-all",
                    plan.is_featured
                      ? "bg-accent text-accent-foreground hover:scale-[1.03] shadow-lg shadow-accent/20"
                      : "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground border border-border",
                  )}
                >
                  <Link href={plan.button_link || "#"} target="_blank">
                    {plan.button_text || "Assinar"}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
