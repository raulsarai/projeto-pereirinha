import { getSiteSettings } from "@/app/admin/actions";
import { PopupManager } from "./popup-manager";

export default async function PopupPage() {
  // Procura as chaves 'section_popup_active' e 'section_popup_data'
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pop-up de Captura</h1>
        <p className="text-muted-foreground">
          Configure a oferta visual e o comportamento de exibição (tempo ou intenção de saída).
        </p>
      </div>
      
      {/* Renderiza o gestor que criámos no passo anterior */}
      <PopupManager settings={settings} />
    </div>
  );
}