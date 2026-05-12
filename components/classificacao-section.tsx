"use client"

import { useState } from "react"

interface ClassificacaoItem {
  id: string
  posicao: number
  pontos: number
  jogos: number
  vitorias: number
  empates: number
  derrotas: number
  gols_pro: number
  gols_contra: number
  times: {
    id: string
    nome: string
    escudo_url: string | null
    cor_primaria: string | null
  } | null
}

interface ClassificacaoSectionProps {
  edicao: string
  edicoes: string[]
  items: ClassificacaoItem[]
}

export function ClassificacaoSection({ edicao, edicoes, items }: ClassificacaoSectionProps) {
  const [selectedEdicao, setSelectedEdicao] = useState(edicao)

  if (!items || items.length === 0) return null

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight">
              Classificação Geral
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Acompanhe a posição atual dos times na competição.
            </p>
          </div>
          {edicoes.length > 1 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Edição:</span>
              <select
                className="rounded border bg-background px-2 py-1 text-sm"
                value={selectedEdicao}
                onChange={(e) => setSelectedEdicao(e.target.value)}
                disabled
              >
                {edicoes.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
              <span className="text-xs text-muted-foreground">
                (no momento, apenas a edição atual está carregada pelo servidor)
              </span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 text-left">Pos</th>
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-center">P</th>
                <th className="px-3 py-2 text-center hidden sm:table-cell">J</th>
                <th className="px-3 py-2 text-center hidden sm:table-cell">V</th>
                <th className="px-3 py-2 text-center hidden md:table-cell">E</th>
                <th className="px-3 py-2 text-center hidden md:table-cell">D</th>
                <th className="px-3 py-2 text-center hidden lg:table-cell">GP</th>
                <th className="px-3 py-2 text-center hidden lg:table-cell">GC</th>
                <th className="px-3 py-2 text-center">SG</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row, idx) => {
                const sg = (row.gols_pro ?? 0) - (row.gols_contra ?? 0)
                const isLeader = idx === 0
                const color = row.times?.cor_primaria ?? undefined
                return (
                  <tr
                    key={row.id}
                    className={`border-b last:border-none ${
                      isLeader ? 'bg-accent/5' : 'bg-background'
                    }`}
                  >
                    <td className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                      {row.posicao}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        {row.times?.escudo_url && (
                          <span
                            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted"
                            style={color ? { border: `2px solid ${color}` } : {}}
                          >
                            <img
                              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/imagens-publicas/${row.times.escudo_url}`}
                              alt={row.times.nome}
                              className="h-7 w-7 object-cover"
                            />
                          </span>
                        )}
                        <span className="text-sm font-medium">
                          {row.times?.nome ?? 'Time' }
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center text-sm font-semibold">
                      {row.pontos}
                    </td>
                    <td className="px-3 py-2 text-center text-xs hidden sm:table-cell">
                      {row.jogos}
                    </td>
                    <td className="px-3 py-2 text-center text-xs hidden sm:table-cell">
                      {row.vitorias}
                    </td>
                    <td className="px-3 py-2 text-center text-xs hidden md:table-cell">
                      {row.empates}
                    </td>
                    <td className="px-3 py-2 text-center text-xs hidden md:table-cell">
                      {row.derrotas}
                    </td>
                    <td className="px-3 py-2 text-center text-xs hidden lg:table-cell">
                      {row.gols_pro}
                    </td>
                    <td className="px-3 py-2 text-center text-xs hidden lg:table-cell">
                      {row.gols_contra}
                    </td>
                    <td className="px-3 py-2 text-center text-xs font-semibold">
                      {sg}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
