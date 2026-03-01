import { getCategorias } from '@/app/admin/actions'
import { CategoriasManager } from './categorias-manager'

export default async function CategoriasPage() {
  const categorias = await getCategorias()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Categorias
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie as categorias de idade disponíveis para inscricao.
        </p>
      </div>

      <CategoriasManager categorias={categorias} />
    </div>
  )
}
