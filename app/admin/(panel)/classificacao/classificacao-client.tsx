"use client";

import { salvarClassificacao, adicionarTime, salvarTime } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import { getTimes } from "../../actions";

function SaveButton({ label = "Salvar" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvando..." : label}
    </Button>
  );
}

type Time = Awaited<ReturnType<typeof getTimes>>[number];

interface ClassificacaoRow {
  id?: string;
  time_id: string;
  posicao?: number;
  pontos?: number;
  jogos?: number;
  vitorias?: number;
  empates?: number;
  derrotas?: number;
  gols_pro?: number;
  gols_contra?: number;
  [key: string]: any;
}

interface Props {
  times: Time[];
  classificacao: ClassificacaoRow[];
  edicoes: string[];
}

export function ClassificacaoClient({ times, classificacao, edicoes }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Classificação</h1>

      <Tabs defaultValue="classificacao">
        <TabsList>
          <TabsTrigger value="classificacao">Classificação</TabsTrigger>
          <TabsTrigger value="times">Times</TabsTrigger>
        </TabsList>

        {/* ─── ABA CLASSIFICAÇÃO ─── */}
        <TabsContent value="classificacao" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Classificação Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={salvarClassificacao} className="space-y-4">
                <input type="hidden" name="rows_count" value={classificacao.length} />
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-xs uppercase text-muted-foreground">
                        <th className="px-2 py-1 text-left">Pos</th>
                        <th className="px-2 py-1 text-left">Time</th>
                        <th className="px-2 py-1">P</th>
                        <th className="px-2 py-1">J</th>
                        <th className="px-2 py-1">V</th>
                        <th className="px-2 py-1">E</th>
                        <th className="px-2 py-1">D</th>
                        <th className="px-2 py-1">GP</th>
                        <th className="px-2 py-1">GC</th>
                        <th className="px-2 py-1">SG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classificacao.map((row, idx) => {
                        const sg = (row.gols_pro ?? 0) - (row.gols_contra ?? 0);
                        return (
                          <tr key={row.id ?? idx} className="border-b">
                            <td className="px-2 py-1">
                              <input type="hidden" name={`row_${idx}_id`} defaultValue={row.id ?? ""} />
                              <Input
                                name={`row_${idx}_posicao`}
                                defaultValue={row.posicao ?? idx + 1}
                                className="h-8 w-14 text-center"
                                type="number"
                              />
                            </td>
                            <td className="px-2 py-1">
                              <select
                                name={`row_${idx}_time_id`}
                                defaultValue={row.time_id}
                                className="h-8 w-48 rounded border bg-background px-2 text-sm"
                              >
                                {times.map((t) => (
                                  <option key={t.id} value={t.id}>{t.nome}</option>
                                ))}
                              </select>
                            </td>
                            {["pontos","jogos","vitorias","empates","derrotas","gols_pro","gols_contra"].map((field) => (
                              <td key={field} className="px-2 py-1 text-center">
                                <Input
                                  name={`row_${idx}_${field}`}
                                  defaultValue={row[field] ?? 0}
                                  className="h-8 w-14 text-center"
                                  type="number"
                                />
                              </td>
                            ))}
                            <td className="px-2 py-1 text-center text-xs font-medium">{sg}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <SaveButton label="Salvar classificação" />
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── ABA TIMES ─── */}
        <TabsContent value="times" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Times</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formulário de novo time */}
              <form action={adicionarTime} className="flex flex-wrap items-end gap-3 rounded-lg border p-3">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" name="nome" required />
                </div>
                <div>
                  <Label htmlFor="cor_primaria">Cor primária (hex)</Label>
                  <Input id="cor_primaria" name="cor_primaria" placeholder="#1a73e8" />
                </div>
                <div>
                  <Label htmlFor="escudo">Escudo</Label>
                  <Input id="escudo" name="escudo" type="file" accept="image/*" />
                </div>
                <SaveButton label="Adicionar time" />
              </form>

              {/* Lista de times existentes */}
              <div className="space-y-2">
                {times.map((t) => (
                  <form
                    key={t.id}
                    action={salvarTime.bind(null, t.id)}
                    className="flex flex-wrap items-center justify-between gap-2 rounded border p-2"
                  >
                    <div className="flex items-center gap-3">
                      {t.escudo_url && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/imagens-publicas/${t.escudo_url}`}
                          alt={t.nome}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      )}
                      <div className="space-y-1">
                        <Input name="nome" defaultValue={t.nome} className="h-8" />
                        <Input name="cor_primaria" defaultValue={t.cor_primaria ?? ""} className="h-7 w-28" placeholder="#hex" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-xs">
                        <input type="checkbox" name="ativo" defaultChecked={t.ativo ?? true} />
                        Ativo
                      </label>
                      <SaveButton label="Salvar" />
                    </div>
                  </form>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}