'use client'

import { createClient } from '@/lib/supabase/client'
import useSWR from 'swr'
import { Megaphone, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface Comunicado {
  id: string
  titulo: string
  conteudo: string
  publicado: boolean
  imagem_url: string | null
  created_at: string
}

function ComunicadoCard({ com, storageBaseUrl }: { com: Comunicado, storageBaseUrl: string }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={cn(
        "flex flex-col rounded-[2rem] bg-card p-5 shadow-xl border border-border/40 transition-all duration-300 snap-start",
        "min-w-[85vw] md:min-w-[calc(25%-18px)] max-w-[85vw] md:max-w-[calc(25%-18px)]",
        // Define altura fixa quando fechado e automática quando expandido
        isExpanded ? "h-fit" : "h-[320px]" 
      )}
    >
      <div className="flex items-center  mb-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
          <Megaphone className="h-5 w-5 text-accent" />
        </div>
        <h3 className="line-clamp-2 font-display text-sm font-black uppercase text-secondary leading-tight">
          {com.titulo}
        </h3>
      </div>

      {/* Container de imagem com altura fixa para não quebrar o layout */}
      {com.imagem_url && (
        <div className="mb-3 overflow-hidden rounded-2xl border border-border/30 h-32 shrink-0">
          <img 
            src={com.imagem_url.startsWith('http') ? com.imagem_url : `${storageBaseUrl}${com.imagem_url}`}
            alt={com.titulo}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <p className={cn(
          "text-[11px] leading-relaxed text-secondary whitespace-pre-wrap",
          !isExpanded && "line-clamp-3"
        )}>
          {com.conteudo}
        </p>
        
        {com.conteudo.length > 80 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-accent hover:opacity-80 w-fit"
          >
            {isExpanded ? (
              <><ChevronUp size={10} /> Menos</>
            ) : (
              <><ChevronDown size={10} /> Ler mais</>
            )}
          </button>
        )}
        
        {/* Rodapé do card fixo na base devido ao flex-1 acima */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/10">
          <span className="text-[9px] font-black uppercase tracking-widest text-secondary opacity-40">
            {new Date(com.created_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short'
            })}
          </span>
          <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        </div>
      </div>
    </div>
  )
}

async function fetchComunicados(): Promise<Comunicado[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comunicados')
    .select('*')
    .eq('publicado', true)
    .order('created_at', { ascending: false })
    .limit(12)

  if (error) return []
  return data ?? []
}

export function ComunicadosSection() {
  const { data: comunicados, isLoading } = useSWR('comunicados-public', fetchComunicados)
  const scrollRef = useRef<HTMLDivElement>(null)
  const storageBaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/imagens-publicas/`

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  if (isLoading || !comunicados || comunicados.length === 0) return null

  return (
    <section  id="comunicado" className="bg-primary py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between mb-8">
          <div className="flex-1">
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-primary md:text-4xl">
              Comunicados
            </h2>
            <div className="h-1 w-16 bg-accent mt-2" />
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/30 text-accent transition-all hover:bg-accent hover:text-accent-foreground shadow-sm"
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

        <div 
          ref={scrollRef}
          className="flex items-start gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar"
        >
          {comunicados.map((com) => (
            <ComunicadoCard key={com.id} com={com} storageBaseUrl={storageBaseUrl} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  )
}