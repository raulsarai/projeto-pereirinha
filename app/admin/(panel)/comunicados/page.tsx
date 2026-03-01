import { getComunicados } from '@/app/admin/actions'
import { ComunicadosManager } from './comunicados-manager'

export default async function ComunicadosPage() {
  const comunicados = await getComunicados()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Comunicados
        </h1>
        <p className="mt-1 text-muted-foreground">
          Crie e publique comunicados para os participantes.
        </p>
      </div>

      <ComunicadosManager comunicados={comunicados} />
    </div>
  )
}
