import { getDashboardStats } from '@/app/admin/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Settings, FolderOpen, Megaphone, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const overviewCards = [
    {
      title: 'Inscricoes',
      value: stats.inscricoesTotal,
      icon: Users,
      href: '/admin/inscricoes',
      description: 'Total de inscricoes recebidas',
    },
    {
      title: 'Vagas Disponiveis',
      value: `${stats.vagasDisponiveis}/${stats.vagasTotal}`,
      icon: TrendingUp,
      href: '/admin/vagas',
      description: 'Vagas abertas para inscricao',
    },
    {
      title: 'Categorias',
      value: stats.totalCategorias,
      icon: FolderOpen,
      href: '/admin/categorias',
      description: 'Categorias cadastradas',
    },
    {
      title: 'Comunicados',
      value: stats.totalComunicados,
      icon: Megaphone,
      href: '/admin/comunicados',
      description: 'Comunicados criados',
    },
  ]

  const isExpired = stats.dataLimite
    ? new Date(stats.dataLimite).getTime() < Date.now()
    : false

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Visao geral do Projeto Pereirinha
        </p>
      </div>

      {/* Deadline Banner */}
      {stats.dataLimite && (
        <div
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
            isExpired
              ? 'border-destructive/30 bg-destructive/5 text-destructive'
              : 'border-accent/30 bg-accent/5 text-accent'
          }`}
        >
          <Clock className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">
            {isExpired
              ? 'Inscricoes encerradas desde ' +
                new Date(stats.dataLimite).toLocaleDateString('pt-BR')
              : 'Inscricoes abertas ate ' +
                new Date(stats.dataLimite).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
          </p>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="transition-colors hover:border-accent/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {card.value}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Inscricoes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Inscricoes Recentes</CardTitle>
          <Link
            href="/admin/inscricoes"
            className="text-sm text-accent hover:underline"
          >
            Ver todas
          </Link>
        </CardHeader>
        <CardContent>
          {stats.recentInscricoes.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhuma inscricao ainda.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.recentInscricoes.map((inscricao: Record<string, string>) => (
                <div
                  key={inscricao.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">
                      {inscricao.nome_completo}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {inscricao.email} - {inscricao.categoria}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        inscricao.status === 'confirmada'
                          ? 'bg-accent/10 text-accent'
                          : inscricao.status === 'cancelada'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {inscricao.status ?? 'pendente'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {inscricao.data_inscricao
                        ? new Date(inscricao.data_inscricao).toLocaleDateString('pt-BR')
                        : '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vagas Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preenchimento de Vagas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Vagas preenchidas</span>
              <span className="font-medium text-foreground">
                {stats.inscricoesTotal} de {stats.vagasTotal}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  stats.vagasDisponiveis <= 3
                    ? 'bg-destructive'
                    : stats.vagasDisponiveis <= 10
                      ? 'bg-yellow-500'
                      : 'bg-accent'
                }`}
                style={{
                  width: `${Math.min(100, (stats.inscricoesTotal / stats.vagasTotal) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.vagasDisponiveis === 0
                ? 'Todas as vagas foram preenchidas!'
                : `${stats.vagasDisponiveis} vagas ainda disponiveis`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/vagas">
          <Card className="cursor-pointer transition-colors hover:border-accent/50">
            <CardContent className="flex items-center gap-3 pt-6">
              <Settings className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-foreground">Editar Vagas</p>
                <p className="text-xs text-muted-foreground">
                  Alterar total de vagas
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/contador">
          <Card className="cursor-pointer transition-colors hover:border-accent/50">
            <CardContent className="flex items-center gap-3 pt-6">
              <Clock className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-foreground">Editar Contador</p>
                <p className="text-xs text-muted-foreground">
                  Alterar data limite
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/comunicados">
          <Card className="cursor-pointer transition-colors hover:border-accent/50">
            <CardContent className="flex items-center gap-3 pt-6">
              <Megaphone className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-foreground">Novo Comunicado</p>
                <p className="text-xs text-muted-foreground">
                  Publicar um aviso
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
