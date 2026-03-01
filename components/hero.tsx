"use client";

import * as LucideIcons from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Hero(props: any) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!props.parallaxActive) return;
    const handleScroll = () => setOffset(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [props.parallaxActive]);

  const footerChips = JSON.parse(props.footerChipsData || "[]");

  const verticalClasses: any = {
    start: "justify-start pt-10 md:pt-16",
    center: "justify-center",
    end: "justify-end pb-32 md:pb-40",
  };

  const horizontalClasses: any = {
    start: "items-start text-left pl-6 md:pl-20",
    center: "items-center text-center px-6",
    end: "items-end text-right pr-6 md:pr-20",
  };

  return (
    <section
      className={cn(
        "relative flex flex-col min-h-screen w-full overflow-hidden transition-all duration-500",
        verticalClasses[props.alignV] || verticalClasses.center,
        horizontalClasses[props.alignH] || horizontalClasses.center,
      )}
    >
      {/* BACKGROUND MEDIA */}
      {props.mediaVisible !== false && (
        <div className="absolute inset-0 z-0">
          {/* Prioridade 1: Vídeo (se houver URL e o switch de vídeo estiver ON) */}
          {props.heroVideo && props.videoVisible !== false ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              key={props.heroVideo} // Garante que o vídeo recarregue se a URL mudar
              className="h-full w-full object-cover"
            >
              <source src={props.heroVideo} type="video/mp4" />
            </video>
          ) : (
            /* Prioridade 2: Imagem (se houver URL) */
            props.heroImage && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${props.heroImage})`,
                  transform: props.parallaxActive
                    ? `translateY(${offset * 0.5}px)`
                    : "none",
                }}
              />
            )
          )}
          <div className="absolute inset-0 bg-hero-overlay backdrop-blur-[1px]" />
        </div>
      )}

      {/* CONTENT */}
      <div
        className={cn(
          "relative z-10 flex flex-col gap-6 w-full max-w-[1400px]",
          props.alignH === "start"
            ? "items-start"
            : props.alignH === "end"
              ? "items-end"
              : "items-center",
        )}
      >
        {/* TOP BADGE */}
        {props.chipTopActive === "true" && (
          <div
            className="inline-flex items-center rounded-full border px-4 py-1.5 font-bold shadow-sm"
            style={{
              fontSize: props.heroChipSize || "0.875rem",
              fontFamily: props.heroChipFont || "inherit",
              backgroundColor: props.heroChipBg || "var(--accent)",
              color: props.heroChipColor || "#fff",
              borderColor: props.heroChipBorder || "transparent",
            }}
          >
            {props.heroChipTopText}
          </div>
        )}

        {/* LOGO */}
        {props.logoVisible !== false && props.logoUrl && (
          <div
            className={cn(
              "relative flex items-center justify-center overflow-hidden border-4 border-white/20 shadow-2xl bg-background shrink-0",
              props.logoStyle,
            )}
            style={{
              width: `${props.logoSize}px`,
              height: `${props.logoSize}px`,
            }}
          >
            <img
              src={props.logoUrl}
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </div>
        )}

        {/* TEXTS BLOCK */}
        <div
          className={cn(
            "flex flex-col gap-4 w-full",
            props.alignH === "start"
              ? "items-start"
              : props.alignH === "end"
                ? "items-end"
                : "items-center",
          )}
        >
          {props.titleVisible !== false && (
            <h1
              className={cn(
                "font-black uppercase tracking-tighter drop-shadow-2xl leading-[0.85]",
                props.heroTitleItalic === "true" && "italic",
                props.heroTitleUnderline === "true" && "underline",
              )}
              style={{
                fontSize: props.heroTitleSize || "5rem",
                fontFamily: props.heroTitleFont || "inherit",
                color: "var(--text-primary)",
              }}
            >
              {props.heroTitle}
            </h1>
          )}

          {props.dividerVisible !== false && (
            <div
              className="h-2 w-24"
              style={{
                backgroundColor: props.heroDividerColor || "var(--accent)",
              }}
            />
          )}

          {props.subtitleVisible !== false && (
            <p
              className={cn(
                "font-black uppercase tracking-widest drop-shadow-md",
                props.heroSubtitleItalic === "true" && "italic",
                props.heroSubtitleUnderline === "true" && "underline",
              )}
              style={{
                fontSize: props.heroSubtitleSize || "1.5rem",
                fontFamily: props.heroSubtitleFont || "inherit",
                color: "var(--text-primary)",
              }}
            >
              {props.heroSubtitle}
            </p>
          )}

          {props.descVisible !== false && (
            <p
              className={cn(
                "font-light opacity-90 leading-none max-w-2xl",
                props.heroDescItalic === "true" && "italic",
                props.heroDescUnderline === "true" && "underline",
              )}
              style={{
                fontSize: props.heroDescSize || "1.25rem",
                fontFamily: props.heroDescFont || "inherit",
                color: "var(--text-primary)",
              }}
            >
              {props.heroDescription}
            </p>
          )}

          {/* ACTIONS */}
          <div
            className={cn(
              "flex flex-wrap gap-4 pt-6",
              props.alignH === "start"
                ? "justify-start"
                : props.alignH === "end"
                  ? "justify-end"
                  : "justify-center",
            )}
          >
            {props.buttonVisible !== false && (
              <a
                href={props.buttonLink || "#"}
                target={props.buttonNewTab === "true" ? "_blank" : "_self"}
                className={cn(
                  "inline-flex items-center justify-center px-10 py-5 text-lg font-black uppercase tracking-widest transition-all hover:scale-105 shadow-xl",
                  props.buttonRadius,
                )}
                style={{
                  backgroundColor: props.heroButtonBg || "var(--accent)",
                  color: props.heroButtonColor || "#fff",
                  fontFamily: props.heroButtonFont || "inherit",
                }}
              >
                {props.buttonText || "Clique Aqui"}
              </a>
            )}
            {props.button2Active === "true" && (
              <a
                href={props.button2Link || "#"}
                target={props.button2NewTab === "true" ? "_blank" : "_self"}
                className={cn(
                  "inline-flex items-center justify-center border-2 px-10 py-5 text-lg font-black uppercase tracking-widest backdrop-blur-sm transition-all hover:bg-white/10",
                  props.buttonRadius,
                )}
                style={{
                  borderColor: props.heroButton2Border || "#fff",
                  color: props.heroButton2Color || "#fff",
                  fontFamily: props.heroButton2Font || "inherit",
                }}
              >
                {props.button2Text}
              </a>
            )}
          </div>

          {/* CHIPS */}
          {props.footerChipsActive === "true" && (
            <div
              className={cn(
                "flex flex-wrap gap-4 mt-12 w-full pt-8 border-t border-white/10",
                props.heroFooterAlign === "start"
                  ? "justify-start text-left"
                  : props.heroFooterAlign === "end"
                    ? "justify-end text-right"
                    : "justify-center text-center",
              )}
            >
              {footerChips.map((chip: any, idx: number) => {
                const Icon =
                  (LucideIcons as any)[chip.icon] || LucideIcons.CheckCircle;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl border"
                    style={{
                      backgroundColor: props.heroFooterBg || "transparent",
                      borderColor: props.heroFooterBorder || "transparent",
                    }}
                  >
                    <div className="text-accent">
                      <Icon size={24} />
                    </div>
                    <span
                      className="text-sm font-bold uppercase tracking-wider"
                      style={{
                        color: props.heroFooterColor || "#fff",
                        fontFamily: props.heroFooterFont || "inherit",
                      }}
                    >
                      {chip.text}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {props.scrollVisible !== false && (
        <a
          href="#info"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-primary/40 hover:text-accent transition-colors"
        >
          <LucideIcons.ChevronDown className="h-10 w-10" />
        </a>
      )}
    </section>
  );
}
