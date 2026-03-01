import { getInscricoes } from '@/app/admin/actions'
import { InscricoesTable } from './inscricoes-table'

export default async function InscricoesPage() {
  const inscricoes = await getInscricoes()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Inscrições
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie todas as inscrições recebidas. Total: {inscricoes.length}
        </p>
      </div>

      <InscricoesTable inscricoes={inscricoes} />
    </div>
  )
}