"use client";

import { Button } from "@/components/ui/button";
import { CountdownTimer } from "./countdown-timer";

export function VideoSection({ dataJson, globalTimerDate }: { dataJson: string, globalTimerDate: string | null }) {
  const data = JSON.parse(dataJson || "{}");
  
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      const showControls = data.youtube_controls === "true" ? "1" : "0";
      return `https://www.youtube.com/embed/${match[2]}?rel=0&modestbranding=1&controls=${showControls}`;
    }
    return "";
  };

  const embedUrl = getEmbedUrl(data.video_url);
  if (!embedUrl) return null;

  return (
    <section className="bg-primary py-20 px-4" id="video-promo">
      <div className="mx-auto max-w-4xl flex flex-col items-center gap-12">
        <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-black">
          <iframe 
            src={embedUrl} 
            className="w-full h-full" 
            allowFullScreen 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* Timer com cores secundárias dinâmicas */}
        {data.timer_active === "true" && globalTimerDate && (
          <div className="text-secondary">
            <CountdownTimer 
              targetDate={globalTimerDate} 
              label="A oferta encerra em:" 
              expiredMessage="Oferta expirada!"
            />
          </div>
        )}

        {/* Botão CTA com fallback para a cor de destaque (accent) */}
        {data.cta_active === "true" && (
          <Button
            asChild
            size="lg"
            className="h-16 px-10 text-xl bg-accent text-accent-foreground font-bold rounded-full text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border-none"
            style={{ backgroundColor: data.cta_color || 'var(--accent)' }}
          >
            <a href={data.cta_link} target="_blank" rel="noopener noreferrer">
              {data.cta_text}
            </a>
          </Button>
        )}
      </div>
    </section>
  );
}