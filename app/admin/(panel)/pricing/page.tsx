import { getPricingSettings } from "@/app/admin/actions"; // Importando a nova action
import { PricingManager } from "./pricing-manager";

export default async function PricingAdminPage() {
  // Busca apenas os dados necessários
  const { active, data } = await getPricingSettings();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Gestão de Planos</h1>
        <p className="text-muted-foreground">Cadastre seus preços e links de checkout.</p>
      </div>
      <PricingManager initialActive={active} initialData={data} />
    </div>
  );
}