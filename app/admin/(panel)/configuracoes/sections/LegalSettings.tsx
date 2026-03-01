"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LegalSettings({ settings, setSettings }: any) {
  return (
    <Card className="mt-6">
      <CardHeader><CardTitle>Jurídico e Empresa</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2"><Label>Razão Social</Label><Input value={settings.legal_company_name || ""} onChange={(e) => setSettings({ ...settings, legal_company_name: e.target.value })} /></div>
        <div className="space-y-2"><Label>CNPJ / NIF</Label><Input value={settings.legal_cnpj_nif || ""} onChange={(e) => setSettings({ ...settings, legal_cnpj_nif: e.target.value })} /></div>
        <div className="space-y-2"><Label>E-mail Oficial</Label><Input value={settings.legal_email || ""} onChange={(e) => setSettings({ ...settings, legal_email: e.target.value })} /></div>
        <div className="space-y-2"><Label>Endereço Completo</Label><Input value={settings.legal_address || ""} onChange={(e) => setSettings({ ...settings, legal_address: e.target.value })} /></div>
      </CardContent>
    </Card>
  );
}