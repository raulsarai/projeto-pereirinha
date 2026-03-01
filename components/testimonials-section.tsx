"use client";

import { useRef } from "react";
import { Star, StarHalf, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar_url?: string;
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) return <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />;
        if (i === fullStars && hasHalfStar) return <StarHalf key={i} size={16} className="text-yellow-500 fill-yellow-500" />;
        return <Star key={i} size={16} className="text-secondary opacity-30" />;
      })}
      <span className="ml-2 text-sm font-bold text-primary">{rating.toFixed(1)}</span>
    </div>
  );
}

export function TestimonialsSection({ data }: { data: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const items: Testimonial[] = JSON.parse(data || "[]");
  
  if (items.length === 0) return null;

  const averageRating = items.reduce((acc, curr) => acc + curr.rating, 0) / items.length;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section id="depoimentos" className="bg-primary py-24 px-4 relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-16">
          <div className="text-left">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-primary">
                O que dizem sobre nós
              </h2>
              {/* Badge de média móvel sutil para desktop */}
              <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-2xl border border-border/20 bg-background/10 backdrop-blur-sm" 
                   style={{ borderColor: "var(--accent)" }}>
                {/* <span className="text-lg font-black text-primary">{averageRating.toFixed(1)}</span> */}
                <StarRating rating={averageRating} />
              </div>
            </div>
            <div className="h-1.5 w-24 bg-accent" />
          </div>

          {/* Botões de Navegação (Igual aos Comunicados) */}
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border transition-all hover:bg-accent hover:text-accent-foreground shadow-sm"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border transition-all hover:bg-accent hover:text-accent-foreground shadow-sm"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Slider de Depoimentos (4 cards por tela no desktop) */}
        <div 
          ref={scrollRef}
          className="flex items-stretch gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar"
        >
          {items.map((item) => (
            <div 
              key={item.id} 
              className={cn(
                "bg-card border border-border/50 p-8 rounded-3xl relative flex flex-col transition-all snap-start",
                "min-w-[85vw] md:min-w-[calc(25%-18px)] max-w-[85vw] md:max-w-[calc(25%-18px)]"
              )}
            >
              <Quote className="absolute top-6 right-8 h-12 w-12 text-accent opacity-10" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 shrink-0 rounded-full border-2 overflow-hidden bg-background" style={{ borderColor: 'var(--accent)' }}>
                  {item.avatar_url ? (
                    <img src={item.avatar_url} className="h-full w-full object-cover" alt={item.name} />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center font-black text-xl uppercase" 
                         style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                      {item.name[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-secondary leading-tight truncate">{item.name}</h4>
                  <p className="text-xs text-secondary opacity-70 truncate">{item.role}</p>
                </div>
              </div>

              <div className="mb-4">
                <StarRating rating={item.rating} />
              </div>

              <p className="text-secondary leading-relaxed flex-1 italic">
                "{item.text}"
              </p>
              
              <div className="mt-6 pt-6 border-t border-border/20 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary opacity-60">Cliente Verificado</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}