import { getSiteSettings } from "@/app/admin/actions";
import { FaqManager } from "./faq-manager";

export default async function FaqPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Perguntas Frequentes (FAQ)</h1>
        <p className="text-muted-foreground">
          Gerencie as dúvidas comuns dos seus clientes de forma dinâmica.
        </p>
      </div>
      <FaqManager settings={settings} />
    </div>
  );
}