'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createComunicado, deleteComunicado } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Trash2, Eye, ImageIcon, Megaphone } from 'lucide-react'

export function ComunicadosManager({ comunicados }: { comunicados: any[] }) {
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [imagem, setImagem] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    if (!imagem) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(imagem)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [imagem])

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const formData = new FormData()
      formData.set('titulo', titulo)
      formData.set('conteudo', conteudo)
      if (imagem) formData.set('imagem', imagem)
      
      await createComunicado(formData)
      setTitulo(''); setConteudo(''); setImagem(null)
      router.refresh()
    })
  }

  const storageBaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/imagens-publicas/`

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus size={20} className="text-accent" /> Novo Comunicado</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label>Banner da Notícia</Label>
              <div className="flex items-center gap-3">
                <Input type="file" accept="image/*" onChange={(e) => setImagem(e.target.files?.[0] || null)} className="cursor-pointer" />
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" disabled={!previewUrl} className="gap-2">
                      <Eye size={16} /> Visualizar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Prévia da Publicação</DialogTitle></DialogHeader>
                    <div className="mt-4 overflow-hidden rounded-xl border bg-card">
                      {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />}
                      <div className="p-5">
                        <h3 className="font-display text-xl font-bold">{titulo || 'Título'}</h3>
                        <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{conteudo}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="conteudo">Conteúdo *</Label>
              <Textarea id="conteudo" value={conteudo} onChange={(e) => setConteudo(e.target.value)} rows={4} required />
            </div>

            <Button type="submit" disabled={isPending} className="bg-accent text-accent-foreground font-bold uppercase">
              {isPending ? 'Publicando...' : 'Publicar Agora'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-bold text-lg flex items-center gap-2"><Megaphone size={18}/> Comunicados Ativos</h3>
        {comunicados.map((com) => (
          <div key={com.id} className="flex items-center justify-between p-4 bg-card border rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              {com.imagem_url && (
                <img 
                  src={com.imagem_url.startsWith('http') ? com.imagem_url : `${storageBaseUrl}${com.imagem_url}`}
                  className="h-10 w-10 object-cover rounded"
                />
              )}
              <span className="font-medium">{com.titulo}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={async () => { if(confirm('Excluir?')) { await deleteComunicado(com.id); router.refresh(); } }}>
              <Trash2 size={18} className="text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}