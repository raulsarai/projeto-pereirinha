'use client'

import { updateConfig } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, AlertTriangle } from 'lucide-react'

interface VagasFormProps {
  currentTotal: number
  inscricoesCount: number
}

export function VagasForm({ currentTotal, inscricoesCount }: VagasFormProps) {
  const [total, setTotal] = useState(currentTotal)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  const available = Math.max(0, total - inscricoesCount)
  const percentage = total > 0 ? (inscricoesCount / total) * 100 : 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.set('vagas_total', String(total))
      // Keep existing data_limite — we only update vagas here
      formData.set('data_limite_inscricao', '')
      await updateConfig(formData)
      setMessage({ type: 'success', text: 'Vagas atualizadas com sucesso!' })
      router.refresh()
    } catch {
      setMessage({ type: 'error', text: 'Erro ao atualizar vagas.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-accent" />
            Total de Vagas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="vagas_totais">Numero de vagas</Label>
              <Input
                id="vagas_totais"
                type="number"
                min={1}
                max={999}
                value={total}
                onChange={(e) => setTotal(Number(e.target.value))}
              />
            </div>

            {total < inscricoesCount && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  Atencao: Ja existem {inscricoesCount} inscricoes. O total nao
                  pode ser menor.
                </span>
              </div>
            )}

            {message && (
              <p
                className={`text-sm ${
                  message.type === 'success' ? 'text-accent' : 'text-destructive'
                }`}
              >
                {message.text}
              </p>
            )}

            <Button
              type="submit"
              disabled={saving || total < inscricoesCount}
              className="w-full"
            >
              {saving ? 'Salvando...' : 'Salvar Vagas'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total de vagas</span>
            <span className="text-lg font-bold text-foreground">{total}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Inscricoes feitas</span>
            <span className="text-lg font-bold text-foreground">
              {inscricoesCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Vagas disponiveis</span>
            <span
              className={`text-lg font-bold ${
                available <= 3
                  ? 'text-destructive'
                  : available <= 10
                    ? 'text-yellow-600'
                    : 'text-accent'
              }`}
            >
              {available}
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                available <= 3
                  ? 'bg-destructive'
                  : available <= 10
                    ? 'bg-yellow-500'
                    : 'bg-accent'
              }`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {Math.round(percentage)}% das vagas preenchidas
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
