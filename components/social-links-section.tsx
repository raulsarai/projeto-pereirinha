"use client";

import { Button } from "@/components/ui/button"

import { 
  Instagram, Facebook, Youtube, Twitter, AtSign, MessageCircle, Send 
} from "lucide-react"

interface SocialLinksSectionProps {
  settings: Record<string, string>
}

export function SocialLinksSection({ settings }: SocialLinksSectionProps) {
  const networks = [
    { id: 'instagram', icon: Instagram, label: 'Instagram' },
    { id: 'facebook', icon: Facebook, label: 'Facebook' },
    { id: 'youtube', icon: Youtube, label: 'YouTube' },
    { id: 'twitter', icon: Twitter, label: 'Twitter (X)' },
    { id: 'threads', icon: AtSign, label: 'Threads' },
    { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp' },
    { id: 'telegram', icon: Send, label: 'Telegram' },
  ];

  const activeNetworks = networks.filter(net => 
    settings[`social_${net.id}_url`] && settings[`social_${net.id}_active`] === 'true'
  );


  
  if (activeNetworks.length === 0) return null;

  return (
    <section className="bg-primary py-16 border-t border-border/5">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-4 font-display text-3xl font-bold uppercase tracking-tight md:text-4xl text-primary">
          Conecte-se Conosco
        </h2>
        <p className="text-primary opacity-50 max-w-xl mx-auto mb-10">
          Acompanhe nossas novidades e eventos através das nossas redes sociais oficiais.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {activeNetworks.map((net) => (
            <Button
              key={net.id}
              asChild
              className="h-14 bg-accent text-accent-foreground shadow-lg hover:scale-105 transition-all text-lg font-bold px-8 rounded-full border-none"
            >
              <a href={settings[`social_${net.id}_url`]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                <net.icon size={24} />
                {net.label}
              </a>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}