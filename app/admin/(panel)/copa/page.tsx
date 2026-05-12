import { getCopas, getCopaAtiva, getCopaBracket, createCopa, updateConfrontoCopa } from '@/app/admin/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function CopaPage() {
  const copas = await getCopas()
  const copaAtiva = await getCopaAtiva()
  const bracket = copaAtiva ? await getCopaBracket(copaAtiva.id) : null

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Copa</h1>

      <Tabs defaultValue="copas">
        <TabsList>
          <TabsTrigger value="copas">Copas</TabsTrigger>
          <TabsTrigger value="bracket" disabled={!copaAtiva}>
            Bracket ({copaAtiva?.nome ?? 'nenhuma ativa'})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="copas" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Nova copa</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createCopa} className="flex flex-wrap items-end gap-3">
                <div>
                  <Label>Nome</Label>
                  <Input name="nome" required />
                </div>
                <div>
                  <Label>Edição</Label>
                  <Input name="edicao" placeholder="2025" />
                </div>
                <Button type="submit">Criar</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Copas cadastradas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {copas.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma copa cadastrada.
                </p>
              )}
              {copas.map((copa: any) => (
                <div
                  key={copa.id}
                  className="flex items-center justify-between rounded border p-2 text-sm"
                >
                  <div>
                    <div className="font-medium">{copa.nome}</div>
                    <div className="text-xs text-muted-foreground">
                      {copa.edicao} · {copa.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {copa.ativa && (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                        Ativa
                      </span>
                    )}
                    {/* Botão de ativar pode ser ligado à action setCopaAtiva se você implementar */}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bracket" className="mt-4">
          {copaAtiva && bracket && (
            <Card>
              <CardHeader>
                <CardTitle>Bracket — {copaAtiva.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  {Object.entries(bracket).map(([fase, confrontos]) => (
                    confrontos && confrontos.length > 0 && (
                      <div key={fase}>
                        <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
                          {fase}
                        </h3>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {(confrontos as any[]).map((c) => (
                            <div
                              key={c.id}
                              className="rounded border bg-card p-3 text-sm"
                            >
                              <div className="flex items-center justify-between">
                                <span>{c.time_a?.nome ?? c.origem_a ?? 'A definir'}</span>
                                <span className="text-xs text-muted-foreground">
                                  {c.gols_a ?? '-'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>{c.time_b?.nome ?? c.origem_b ?? 'A definir'}</span>
                                <span className="text-xs text-muted-foreground">
                                  {c.gols_b ?? '-'}
                                </span>
                              </div>
                              <form
                                action={async (formData) => {
                                  'use server'
                                  const ga = Number(formData.get('gols_a') || 0)
                                  const gb = Number(formData.get('gols_b') || 0)
                                  await updateConfrontoCopa(c.id, ga, gb)
                                }}
                                className="mt-2 flex items-center gap-1"
                              >
                                <Input
                                  name="gols_a"
                                  type="number"
                                  min={0}
                                  className="h-7 w-10 text-xs"
                                  placeholder="0"
                                />
                                <span className="text-xs text-muted-foreground">x</span>
                                <Input
                                  name="gols_b"
                                  type="number"
                                  min={0}
                                  className="h-7 w-10 text-xs"
                                  placeholder="0"
                                />
                                <Button type="submit" size="sm" className="ml-2">
                                  Salvar
                                </Button>
                              </form>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
