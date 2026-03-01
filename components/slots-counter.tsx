"use client"

interface SlotsCounterProps {
  available: number
  total: number
  isLoading: boolean
}

export function SlotsCounter({ available, total, isLoading }: SlotsCounterProps) {
  const percentage = total > 0 ? ((total - available) / total) * 100 : 0

  const barColor =
    available <= 3
      ? "bg-destructive"
      : "bg-accent"

  const textColor =
    available <= 3
      ? "text-destructive"
      : "text-accent"

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="h-6 w-32 animate-pulse rounded bg-secondary/20" />
        <div className="h-3 w-full animate-pulse rounded-full bg-secondary/20" />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex items-baseline gap-1">
        <span className={`font-display text-4xl font-bold tabular-nums ${textColor}`}>
          {available}
        </span>
        <span className="text-sm text-primary opacity-70">
          {"vagas disponíveis de "}
          {total}
        </span>
      </div>

      {/* Progress bar */}
      {/* Alterado de bg-background/20 para bg-secondary/20 para usar a cor secundária configurada */}
      <div className="h-3 w-full overflow-hidden rounded-full bg-secondary/20 shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {available === 0 && (
        <p className="text-sm font-semibold text-destructive uppercase tracking-wider">
          Todas as vagas foram preenchidas!
        </p>
      )}
    </div>
  )
}