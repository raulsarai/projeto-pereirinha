import { createClient } from '@/lib/supabase/server'
import { LeadsManager } from './leads-manager'
import { Users, Zap, TrendingUp, MousePointer2 } from "lucide-react"

export default async function LeadsPage() {
  const supabase = await createClient()
  
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  const totalLeads = leads?.length || 0
  const leadsHoje = leads?.filter(l => 
    new Date(l.created_at).toDateString() === new Date().toDateString()
  ).length || 0

  const stats = [
    { 
      label: "Total de Leads", 
      value: totalLeads, 
      icon: Users, 
      color: "from-blue-600 to-indigo-600",
      description: "Contatos na base" 
    },
    { 
      label: "Capturas Hoje", 
      value: leadsHoje, 
      icon: Zap, 
      color: "from-orange-500 to-red-500",
      description: "Novos interessados" 
    },
    { 
      label: "Interesse Ativo", 
      value: totalLeads > 0 ? "100%" : "0%", 
      icon: MousePointer2, 
      color: "from-emerald-500 to-teal-500",
      description: "Taxa de engajamento" 
    },
    { 
      label: "Crescimento", 
      value: `+${leadsHoje}`, 
      icon: TrendingUp, 
      color: "from-purple-600 to-pink-600",
      description: "Volume de 24h" 
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Central de Leads</h1>
        <p className="text-slate-500 text-lg">Gerencie seus potenciais clientes e impulsione suas conversões.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="group relative overflow-hidden rounded-[2rem] border bg-white p-8 shadow-sm transition-all hover:shadow-md">
            <div className={`absolute right-[-20px] top-[-20px] h-32 w-32 rounded-full bg-gradient-to-br ${stat.color} opacity-5 blur-3xl transition-opacity group-hover:opacity-10`} />
            <div className="flex items-center justify-between">
              <div className={`rounded-2xl bg-gradient-to-br ${stat.color} p-3 text-white shadow-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="mt-6">
              <h3 className="text-4xl font-black tracking-tighter text-slate-900">{stat.value}</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
              <p className="text-xs text-slate-400 mt-2">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <LeadsManager initialLeads={leads || []} />
    </div>
  )
}