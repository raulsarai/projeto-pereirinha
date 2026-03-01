"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export function FaqSection({ data }: { data: string }) {
  const items: FaqItem[] = JSON.parse(data || "[]");

  if (items.length === 0) return null;

  return (
    <section className="bg-primary py-20 px-4" id="faq">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight md:text-4xl mb-4 text-primary">
            Dúvidas Comuns
          </h2>
          <div className="mx-auto h-1 w-20 bg-accent" />
        </div>

        <Accordion type="single" collapsible className="w-full">
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-border/50">
              <AccordionTrigger className="text-left font-semibold text-primary hover:text-accent transition-colors">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-primary opacity-50 whitespace-pre-wrap">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}