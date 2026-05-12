import { getJogos, getTimes, createJogo, encerrarJogo } from '@/app/admin/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default async function JogosPage() {
  const [jogos, times] = await Promise.all([
    getJogos(),
    getTimes(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Jogos</h1>

      <Card>
        <CardHeader>
          <CardTitle>Novo jogo</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={createJogo}
            className="grid gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            <div>
              <Label>Time da casa</Label>
              <select
                name="time_casa_id"
                className="mt-1 w-full rounded border bg-background px-2 py-1 text-sm"
                required
              >
                <option value="">Selecione</option>
                {times.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Time visitante</Label>
              <select
                name="time_visitante_id"
                className="mt-1 w-full rounded border bg-background px-2 py-1 text-sm"
                required
              >
                <option value="">Selecione</option>
                {times.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Data e hora</Label>
              <Input
                type="datetime-local"
                name="data_hora"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>Local</Label>
              <Input name="local" className="mt-1" />
            </div>
            <div>
              <Label>Rodada</Label>
              <Input name="rodada" className="mt-1" placeholder="Rodada 1" />
            </div>
            <div>
              <Label>Edição</Label>
              <Input name="edicao" className="mt-1" placeholder="2025" />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input id="destaque" name="destaque" type="checkbox" defaultChecked />
              <Label htmlFor="destaque" className="text-sm">
                Mostrar nos carrosséis
              </Label>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Criar jogo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de jogos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {jogos.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum jogo cadastrado ainda.
            </p>
          )}

          <div className="space-y-2">
            {jogos.map((jogo: any) => {
              const data = new Date(jogo.data_hora)
              const encerrado = jogo.status === 'encerrado'
              return (
                <div
                  key={jogo.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span>{jogo.time_casa?.nome}</span>
                      <span className="text-xs text-muted-foreground">
                        {encerrado ? jogo.gols_casa : '-'}
                      </span>
                      <span className="text-xs text-muted-foreground">x</span>
                      <span className="text-xs text-muted-foreground">
                        {encerrado ? jogo.gols_visitante : '-'}
                      </span>
                      <span>{jogo.time_visitante?.nome}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {jogo.rodada && `${jogo.rodada} · `}
                      {data.toLocaleDateString('pt-BR')} {data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!encerrado && (
                      <form
                        action={async (formData) => {
                          'use server'
                          const gc = Number(formData.get('gols_casa') || 0)
                          const gv = Number(formData.get('gols_visitante') || 0)
                          await encerrarJogo(jogo.id, gc, gv)
                        }}
                        className="flex items-center gap-1"
                      >
                        <Input
                          name="gols_casa"
                          type="number"
                          min={0}
                          className="h-8 w-12"
                          placeholder="0"
                        />
                        <span className="text-xs text-muted-foreground">x</span>
                        <Input
                          name="gols_visitante"
                          type="number"
                          min={0}
                          className="h-8 w-12"
                          placeholder="0"
                        />
                        <Button type="submit" size="sm" className="ml-2">
                          Encerrar
                        </Button>
                      </form>
                    )}
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {jogo.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
