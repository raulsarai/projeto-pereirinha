"use client";

import Link from "next/link";
import {
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  AtSign,
  Send,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

interface SiteFooterProps {
  settings: Record<string, string>;
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const isLegalActive = settings.section_legal_active === "true";
  const displayLogo = settings.logo_url || "/images/logo.png";
  const displayEndereco =
    settings.legal_address || settings.endereco || "Endereço não configurado";
  const siteName = settings.legal_site_name || "Projeto Pereirinha";
  const companyName = settings.legal_company_name || "Grêmio Recreativo";

  const mapQuery = encodeURIComponent(displayEndereco);
  const mapUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const networks = [
    { id: "instagram", icon: Instagram, label: "Instagram" },
    { id: "facebook", icon: Facebook, label: "Facebook" },
    { id: "youtube", icon: Youtube, label: "YouTube" },
    { id: "twitter", icon: Twitter, label: "Twitter (X)" },
    { id: "threads", icon: AtSign, label: "Threads" },
    { id: "whatsapp", icon: MessageCircle, label: "WhatsApp" },
    { id: "telegram", icon: Send, label: "Telegram" },
  ];

  const activeNetworks = networks.filter(
    (net) =>
      settings[`social_${net.id}_url`] &&
      settings[`social_${net.id}_active`] === "true",
  );

  const whatsappUrl = settings.social_whatsapp_url || "#";

  return (
    <footer className="bg-primary text-secondary border-t border-border/20">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="flex flex-col items-center gap-6 md:items-start text-center md:text-left">
            <div className="relative h-24 w-24 overflow-hidden rounded-[2rem] border-2 border-border/20 shadow-2xl bg-background p-2">
              <img
                src={displayLogo}
                alt={`Logo ${siteName}`}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h2 className="font-display text-2xl font-black uppercase tracking-tighter text-primary">
                {siteName}
              </h2>
              <p className="mt-2 text-sm font-medium text-secondary/70 leading-relaxed">
                {companyName} — Formando cidadãos através do esporte e
                disciplina.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 md:items-start">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/50">
              Onde Estamos
            </h3>
            <div className="flex flex-col gap-5 text-sm">
              <div className="flex items-start gap-4">
                <div className="ml-1 mt-1 rounded-lg bg-accent/10  text-accent">
                  <MapPin className="h-4 w-4 shrink-0" />
                </div>
                <span className="leading-relaxed font-medium text-primary ">
                  {displayEndereco}
                </span>
              </div>

              {settings.social_whatsapp_active === "true" && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 transition-all hover:opacity-80 group"
                >
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-lg shadow-emerald-500/10">
                    <MessageCircle className="h-4 w-4 shrink-0" />
                  </div>
                  <span className="font-bold text-primary uppercase tracking-tight text-xs">
                    Fale Conosco agora
                  </span>
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 md:items-start">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/50">
              Conecte-se
            </h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {activeNetworks.map((net) => (
                <a
                  key={net.id}
                  href={settings[`social_${net.id}_url`]}
                  target="_blank"
                  rel="noopener noreferrer"
                  // Removido bg-background e adicionado border-current
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border transition-all hover:bg-accent hover:text-accent-foreground hover:-translate-y-1 shadow-sm"
                  style={{
                    borderColor: "var(--accent)", // Força a borda a usar a cor accent do banco
                    color: "var(--accent)", // Força o ícone a usar a cor accent do banco
                  }}
                  aria-label={net.label}
                >
                  <net.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            <div
              className="mt-4 flex items-center gap-2 rounded-xl border px-4 py-3"
              style={{
                backgroundColor: "rgba(var(--accent), 0.05)",
                borderColor: "var(--accent)",
              }}
            >
              <ShieldCheck
                className="h-5 w-5"
                style={{ color: "var(--accent)" }}
              />
              <div className="flex flex-col">
                <span
                  className="text-[9px] font-black uppercase tracking-widest"
                  style={{ color: "var(--accent)" }}
                >
                  Site Seguro
                </span>
                <span className="text-[8px] text-secondary font-bold">
                  Criptografia SSL 256-bits
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 overflow-hidden rounded-[2.5rem] border border-border/10 bg-background shadow-2xl group">
          <iframe
            src={mapUrl}
            width="100%"
            height="320"
            className="transition-opacity duration-700 opacity-60 group-hover:opacity-100"
            style={{ border: 0, filter: "grayscale(0.5)" }}
            allowFullScreen
            loading="lazy"
            title={`Mapa: ${displayEndereco}`}
          />
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-8 border-t border-border/10 pt-10 md:flex-row">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-[10px] font-bold text-secondary/50 uppercase tracking-widest">
              © {new Date().getFullYear()} {companyName}. Todos os direitos
              reservados.
            </p>

            {isLegalActive && (
              <nav className="flex gap-6 border-l border-border/20 pl-6 hidden md:flex">
                <Link
                  href="/termos"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary hover:text-accent transition-colors"
                >
                  Termos
                </Link>
                <Link
                  href="/privacidade"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary hover:text-accent transition-colors"
                >
                  Privacidade
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3 rounded-full bg-emerald-500/5 border border-emerald-500/10 px-5 py-2.5 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
              WhatsApp Oficial de Suporte
            </span>
          </div>

          {isLegalActive && (
            <nav className="flex gap-8 md:hidden">
              <Link
                href="/termos"
                className="text-[10px] font-black uppercase tracking-widest text-secondary"
              >
                Termos
              </Link>
              <Link
                href="/privacidade"
                className="text-[10px] font-black uppercase tracking-widest text-secondary"
              >
                Privacidade
              </Link>
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
