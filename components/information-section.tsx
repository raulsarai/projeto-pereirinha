"use client";

import { Users, Calendar, MapPin, Clock } from "lucide-react";

interface InformationSectionProps {
  faixaEtaria?: string;
  horarios?: string;
  endereco?: string;
  categorias?: string;
}

export function InformationSection({
  faixaEtaria,
  horarios,
  endereco,
  categorias,
}: InformationSectionProps) {
  const infoCards = [
    {
      icon: Users,
      title: "Faixa Etaria",
      description: faixaEtaria || "Jovens de 4 a 17 anos",
    },
    {
      icon: Calendar,
      title: "Categorias",
      description: categorias || "Sub-7, Sub-9, Sub-11, Sub-13, Sub-15, Sub-17",
    },
    {
      icon: Clock,
      title: "Horarios",
      description: horarios || "Ter, Qua, Qui: 8h-10h e 14h-16h | Sab: 7h-13h",
    },
    {
      icon: MapPin,
      title: "Endereco",
      description:
        endereco || "Rua Joao Jose da Silva, 590 - Vila Caraguata, SP",
    },
  ];
  return (
    <section id="info" className="bg-primary py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center font-display text-3xl font-bold uppercase tracking-tight text-primary md:text-4xl">
          Informacoes
        </h2>
        <div className="mx-auto mb-12 h-1 w-16 bg-accent" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {infoCards.map((card) => (
            <div
              key={card.title}
              className="group flex flex-col items-center gap-4 rounded-xl bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-border/50"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-secondary">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-secondary">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
