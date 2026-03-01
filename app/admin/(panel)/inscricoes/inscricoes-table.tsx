'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MoreHorizontal, FileText, CheckCircle, XCircle, Clock, Download, ExternalLink, Search, Filter 
} from 'lucide-react'
import { 
  updateInscricaoStatus, deleteInscricao, getDocumentUrl, updateStatusAndGetMessage 
} from '@/app/admin/actions'
import { useToast } from '@/hooks/use-toast'

interface Inscricao {
  id: string
  nome_completo: string
  categoria: string
  responsavel: string
  telefone: string
  email: string
  status: string
  data_inscricao: string
  bairro: string
  rg_aluno_url?: string
  cpf_aluno_url?: string
  foto_aluno_url?: string
}

export function InscricoesTable({ inscricoes }: { inscricoes: Inscricao[] }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // Estados dos Filtros
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Gera lista de categorias únicas baseada nas inscrições existentes
  const categoriasUnicas = Array.from(
    new Set(inscricoes.map((i) => i.categoria))
  ).sort()

  // Lógica de Filtragem Combinada
  const filtered = inscricoes.filter((i) => {
    const matchesSearch = i.nome_completo.toLowerCase().includes(search.toLowerCase()) || 
                          i.bairro?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || (i.status ?? 'Pendente') === statusFilter
    const matchesCategory = categoryFilter === 'all' || i.categoria === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  async function handleAction(id: string, action: () => Promise<any>) {
    startTransition(async () => {
      try {
        const result = await action()
        if (typeof result === 'string') window.open(result, '_blank')
        router.refresh()
      } catch (e) {
        toast({ title: 'Erro na operação', variant: 'destructive' })
      }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de Filtros */}
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6 lg:flex-row lg:items-center">
          {/* Busca por Texto */}
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome ou bairro..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="max-w-sm" 
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filtro de Categoria */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  {categoriasUnicas.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Status */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Recusado">Recusado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Resultados */}
      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Documentos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhuma inscrição encontrada com os filtros selecionados.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.id} className={isPending ? 'opacity-50' : ''}>
                  <TableCell className="text-xs whitespace-nowrap">
                    {new Date(row.data_inscricao).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {row.nome_completo}
                    <div className="text-xs text-muted-foreground font-normal">{row.categoria}</div>
                  </TableCell>
                  <TableCell>
                    {row.responsavel}
                    <div className="text-xs text-muted-foreground">{row.telefone}</div>
                  </TableCell>
                  <TableCell>
                    <DocumentsDialog inscricao={row} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'Aprovado' ? 'default' : row.status === 'Recusado' ? 'destructive' : 'secondary'}>
                      {row.status ?? 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction(row.id, () => updateStatusAndGetMessage(row.id, 'Aprovado', row.telefone, row.nome_completo))}>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Aprovar (WhatsApp)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(row.id, () => updateStatusAndGetMessage(row.id, 'Recusado', row.telefone, row.nome_completo))}>
                          <XCircle className="mr-2 h-4 w-4 text-red-500" /> Recusar (WhatsApp)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleAction(row.id, () => deleteInscricao(row.id))}>
                          Excluir Inscrição
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTES DE DOCUMENTOS ---

function DocumentsDialog({ inscricao }: { inscricao: Inscricao }) {
  const docs = [
    { label: 'Foto do Aluno', path: inscricao.foto_aluno_url, bucket: 'imagens-publicas' as const },
    { label: 'RG do Aluno', path: inscricao.rg_aluno_url, bucket: 'documentos-privados' as const },
    { label: 'CPF do Aluno', path: inscricao.cpf_aluno_url, bucket: 'documentos-privados' as const },
  ]

  const count = docs.filter(d => d.path).length

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="h-4 w-4" /> 
          Ver ({count})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Documentos Enviados</DialogTitle>
          <DialogDescription>
            Clique em visualizar para abrir o documento em uma nova aba.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 mt-4">
          {docs.map((doc, idx) => (
            <DocumentItem key={idx} {...doc} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DocumentItem({ label, path, bucket }: { label: string, path?: string, bucket: any }) {
  const [loading, setLoading] = useState(false)

  if (!path) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/10 opacity-50">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs italic">Não enviado</span>
      </div>
    )
  }

  async function handleView() {
    setLoading(true)
    try {
      const url = await getDocumentUrl(path!, bucket)
      if (url) window.open(url, '_blank')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/5 transition-colors">
      <div className="flex flex-col">
        <span className="text-sm font-bold">{label}</span>
        <span className="text-[10px] text-muted-foreground uppercase">Arquivo Anexado</span>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={handleView} disabled={loading} className="gap-2 h-8">
          <ExternalLink size={14} />
          {loading ? 'Carregando...' : 'Visualizar'}
        </Button>
      </div>
    </div>
  )
}