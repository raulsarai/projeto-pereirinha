import { getConfig, getInscricoesCount } from '@/app/admin/actions'
import { VagasForm } from './vagas-form'

export default async function VagasPage() {
  const config = await getConfig()
  const inscricoesCount = await getInscricoesCount()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Gerenciar Vagas
        </h1>
        <p className="mt-1 text-muted-foreground">
          Altere o total de vagas disponiveis para inscricao.
        </p>
      </div>

      <VagasForm
        currentTotal={config.vagas_total ?? 30}
        inscricoesCount={inscricoesCount}
      />
    </div>
  )
}
