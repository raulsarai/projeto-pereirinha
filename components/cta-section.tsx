"use client";

import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CtaSectionProps {
  settings?: string
}

export function CtaSection({ settings }: CtaSectionProps) {
  const externalUrl = settings || "https://forms.gle/dUPypKrr9FTMQVJ77"

  return (
    <section className="bg-primary py-16">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 text-center">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight md:text-3xl text-primary">
          Prefere o Google Forms?
        </h2>
        <p className="text-primary opacity-50 max-w-xl mx-auto mb-10">
          Você também pode se inscrever pelo nosso formulário externo.
        </p>
        <Button
          asChild
          size="lg"
          className="h-12 gap-2 px-8 text-lg font-bold rounded-xl transition-all bg-accent text-accent-foreground hover:opacity-90 shadow-lg shadow-accent/20"
        >
          <a href={externalUrl} target="_blank" rel="noopener noreferrer">
            Inscrever-se via Formulário
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  )
}