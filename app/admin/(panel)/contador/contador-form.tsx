'use client'

import { updateConfig } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Timer, Clock } from 'lucide-react'

interface ContadorFormProps {
  currentDate: string | null
}

export function ContadorForm({ currentDate }: ContadorFormProps) {
  const [date, setDate] = useState(
    currentDate ? new Date(currentDate).toISOString().slice(0, 16) : ''
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  const isExpired = date ? new Date(date).getTime() < Date.now() : false

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.set('data_limite_inscricao', new Date(date).toISOString())
      formData.set('vagas_total', '') // will keep existing
      await updateConfig(formData)
      setMessage({ type: 'success', text: 'Data limite atualizada com sucesso!' })
      router.refresh()
    } catch {
      setMessage({ type: 'error', text: 'Erro ao atualizar data limite.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Timer className="h-5 w-5 text-accent" />
            Data Limite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="data_limite">Data e hora limite</Label>
              <Input
                id="data_limite"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {message && (
              <p
                className={`text-sm ${
                  message.type === 'success' ? 'text-accent' : 'text-destructive'
                }`}
              >
                {message.text}
              </p>
            )}

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Salvando...' : 'Salvar Data Limite'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Atual</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Data limite atual</p>
              <p className="text-lg font-bold text-foreground">
                {currentDate
                  ? new Date(currentDate).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Nao definida'}
              </p>
            </div>
          </div>

          <div
            className={`rounded-lg px-4 py-3 ${
              isExpired
                ? 'bg-destructive/10 text-destructive'
                : 'bg-accent/10 text-accent'
            }`}
          >
            <p className="text-sm font-medium">
              {isExpired
                ? 'Inscricoes encerradas'
                : 'Inscricoes abertas'}
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            O contador regressivo na pagina principal sera atualizado
            automaticamente com a nova data.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
