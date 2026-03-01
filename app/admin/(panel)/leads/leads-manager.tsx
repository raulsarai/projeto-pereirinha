"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Search, Download, Trash2, Filter } from "lucide-react";
import { markLeadsAsRead } from "../../actions";

export function LeadsManager({ initialLeads }: { initialLeads: any[] }) {
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // Chama a Server Action de forma segura assim que o painel abre
    async function updateStatus() {
      try {
        await markLeadsAsRead();
      } catch (err) {
        console.error("Erro ao atualizar status dos leads", err);
      }
    }
    updateStatus();
  }, []);

  useEffect(() => {
    const clearNotifications = async () => {
      await markLeadsAsRead();
    };
    clearNotifications();
  }, []);

  const filteredLeads = initialLeads.filter(
    (l) =>
      (l.nome?.toLowerCase() || "").includes(filter.toLowerCase()) ||
      (l.whatsapp?.toLowerCase() || "").includes(filter.toLowerCase()),
  );

  const exportCSV = () => {
    const headers = ["Nome", "WhatsApp", "Origem", "Data de Captura"];
    const rows = filteredLeads.map((l) => [
      l.nome,
      l.whatsapp,
      l.origem,
      new Date(l.created_at).toLocaleString("pt-BR"),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <Card className="rounded-[2.5rem] border-slate-200 shadow-2xl overflow-hidden bg-white">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-8">
        <div>
          <CardTitle className="text-2xl font-black text-slate-900">
            Base de Interessados
          </CardTitle>
          <p className="text-sm text-slate-500">
            Total de {filteredLeads.length} contatos filtrados
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por nome ou WhatsApp..."
              className="pl-12 h-12 rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={exportCSV}
            className="h-12 px-6 rounded-2xl gap-2 font-bold border-slate-200 hover:bg-slate-100"
          >
            <Download size={18} /> Exportar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
                <th className="px-10 py-5">Interessado</th>
                <th className="px-10 py-5">WhatsApp</th>
                <th className="px-10 py-5">Origem</th>
                <th className="px-10 py-5">Data</th>
                <th className="px-10 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-10 py-6">
                      <div className="font-black text-slate-900 text-lg">
                        {lead.nome || "Anônimo"}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <code className="text-blue-600 font-mono font-bold bg-blue-50 px-2 py-1 rounded-md text-sm">
                        {lead.whatsapp}
                      </code>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="text-sm font-bold text-slate-600">
                          {lead.origem}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                        {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="lg"
                          variant="ghost"
                          className="h-12 w-12 rounded-2xl text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          asChild
                        >
                          <a
                            href={`https://wa.me/55${lead.whatsapp?.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Conversar no WhatsApp"
                          >
                            <MessageCircle size={24} />
                          </a>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-12 w-12 rounded-2xl text-slate-300 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={20} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Filter className="h-12 w-12 text-slate-200" />
                      <p className="text-slate-400 font-medium">
                        Nenhum lead encontrado com estes filtros.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
