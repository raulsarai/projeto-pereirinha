"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface TimeInfo {
  id: string
  nome: string
  escudo_url: string | null
  cor_primaria: string | null
}

interface JogoPublico {
  id: string
  data_hora: string
  local: string | null
  rodada: string | null
  gols_casa: number | null
  gols_visitante: number | null
  time_casa: TimeInfo
  time_visitante: TimeInfo
}

interface ResultadosSectionProps {
  ultimos: JogoPublico[]
  proximos: JogoPublico[]
}

function formatDataHora(iso: string) {
  const d = new Date(iso)
  return `${d.toLocaleDateString('pt-BR')} · ${d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}

function TimeBadge({ time }: { time: TimeInfo }) {
  return (
    <div className="flex items-center gap-2">
      {time.escudo_url && (
        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted">
          <img
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/imagens-publicas/${time.escudo_url}`}
            alt={time.nome}
            className="h-7 w-7 object-cover"
          />
        </span>
      )}
      <span className="text-sm font-medium">{time.nome}</span>
    </div>
  )
}

export function ResultadosSection({ ultimos, proximos }: ResultadosSectionProps) {
  if (ultimos.length === 0 && proximos.length === 0) return null

  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto max-w-6xl px-4 space-y-10">
        {ultimos.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold">Últimos resultados</h2>
            </div>
            <div className="relative">
              <Carousel>
                <CarouselContent>
                  {ultimos.map((jogo) => {
                    const vencedorCasa =
                      jogo.gols_casa != null &&
                      jogo.gols_visitante != null &&
                      jogo.gols_casa > jogo.gols_visitante
                    const vencedorVisitante =
                      jogo.gols_casa != null &&
                      jogo.gols_visitante != null &&
                      jogo.gols_visitante > jogo.gols_casa
                    return (
                      <CarouselItem
                        key={jogo.id}
                        className="basis-full md:basis-1/2 lg:basis-1/3"
                      >
                        <div className="flex h-full flex-col justify-between rounded-xl border bg-card p-4 shadow-sm">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex flex-1 flex-col gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <TimeBadge time={jogo.time_casa} />
                                <div className="text-lg font-bold">
                                  {jogo.gols_casa} - {jogo.gols_visitante}
                                </div>
                                <TimeBadge time={jogo.time_visitante} />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {jogo.rodada && `${jogo.rodada} · `}
                                {formatDataHora(jogo.data_hora)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                            <span>{jogo.local}</span>
                            <span>
                              {vencedorCasa
                                ? `${jogo.time_casa.nome} venceu`
                                : vencedorVisitante
                                  ? `${jogo.time_visitante.nome} venceu`
                                  : 'Empate'}
                            </span>
                          </div>
                        </div>
                      </CarouselItem>
                    )
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        )}

        {proximos.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold">Próximos jogos</h2>
            </div>
            <div className="relative">
              <Carousel>
                <CarouselContent>
                  {proximos.map((jogo) => (
                    <CarouselItem
                      key={jogo.id}
                      className="basis-full md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="flex h-full flex-col justify-between rounded-xl border bg-card p-4 shadow-sm">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <TimeBadge time={jogo.time_casa} />
                            <span className="text-xs font-semibold text-muted-foreground">
                              vs
                            </span>
                            <TimeBadge time={jogo.time_visitante} />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {jogo.rodada && `${jogo.rodada} · `}
                            {formatDataHora(jogo.data_hora)}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{jogo.local}</span>
                          {/* Lugar para um countdown futuro, se quiser */}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
