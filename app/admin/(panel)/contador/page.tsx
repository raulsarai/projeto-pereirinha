import { getConfig } from '@/app/admin/actions'
import { ContadorForm } from './contador-form'

export default async function ContadorPage() {
  const config = await getConfig()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Contador Regressivo
        </h1>
        <p className="mt-1 text-muted-foreground">
          Defina a data limite para encerramento das inscricoes.
        </p>
      </div>

      <ContadorForm currentDate={config.data_limite_inscricao} />
    </div>
  )
}
