'use client'

import {
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, FolderOpen } from 'lucide-react'

interface Categoria {
  id: string
  nome: string
  descricao: string | null
  ativa: boolean
  created_at: string
}

interface CategoriasManagerProps {
  categorias: Categoria[]
}

export function CategoriasManager({ categorias }: CategoriasManagerProps) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) return

    startTransition(async () => {
      const formData = new FormData()
      formData.set('nome', nome)
      formData.set('descricao', descricao)
      await createCategoria(formData)
      setNome('')
      setDescricao('')
      setMessage('Categoria criada com sucesso!')
      setTimeout(() => setMessage(null), 3000)
      router.refresh()
    })
  }

  function handleToggle(cat: Categoria) {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('nome', cat.nome)
      formData.set('descricao', cat.descricao ?? '')
      formData.set('ativa', String(!cat.ativa))
      await updateCategoria(cat.id, formData)
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return
    startTransition(async () => {
      await deleteCategoria(id)
      router.refresh()
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Create form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plus className="h-5 w-5 text-accent" />
            Nova Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                placeholder="Ex: Sub 09 (4-8 anos)"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="descricao">Descricao (opcional)</Label>
              <Textarea
                id="descricao"
                placeholder="Descricao da categoria..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
              />
            </div>
            {message && <p className="text-sm text-accent">{message}</p>}
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Criando...' : 'Criar Categoria'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FolderOpen className="h-5 w-5 text-accent" />
            Categorias ({categorias.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categorias.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhuma categoria cadastrada.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {categorias.map((cat) => (
                <div
                  key={cat.id}
                  className={`flex items-center justify-between rounded-lg border p-3 transition-opacity ${
                    isPending ? 'opacity-50' : ''
                  } ${!cat.ativa ? 'border-dashed opacity-60' : 'border-border'}`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">
                      {cat.nome}
                    </span>
                    {cat.descricao && (
                      <span className="text-xs text-muted-foreground">
                        {cat.descricao}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={cat.ativa}
                      onCheckedChange={() => handleToggle(cat)}
                      aria-label={`Ativar/desativar ${cat.nome}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
