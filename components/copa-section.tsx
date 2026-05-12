"use client"

interface TimeInfo {
  id: string
  nome: string
  escudo_url: string | null
}

interface ConfrontoPublico {
  id: string
  fase: string
  ordem: number
  data_hora: string | null
  time_a: TimeInfo | null
  time_b: TimeInfo | null
  gols_a: number | null
  gols_b: number | null
  origem_a: string | null
  origem_b: string | null
}

interface BracketPorFase {
  [fase: string]: ConfrontoPublico[]
}

interface CopaSectionProps {
  copaNome: string
  bracket: BracketPorFase
}

export function CopaSection({ copaNome, bracket }: CopaSectionProps) {
  const fases = Object.entries(bracket).filter(([, cs]) => cs && cs.length > 0)
  if (fases.length === 0) return null

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="text-3xl font-display font-bold tracking-tight">
            Chaveamento da Copa
          </h2>
          <p className="text-sm text-muted-foreground">{copaNome}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {fases.map(([fase, confrontos]) => (
            <div key={fase} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {fase}
              </h3>
              <div className="space-y-3">
                {confrontos.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-lg border bg-card p-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span>{c.time_a?.nome ?? c.origem_a ?? 'A definir'}</span>
                      <span className="font-semibold">
                        {c.gols_a ?? '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{c.time_b?.nome ?? c.origem_b ?? 'A definir'}</span>
                      <span className="font-semibold">
                        {c.gols_b ?? '-'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
