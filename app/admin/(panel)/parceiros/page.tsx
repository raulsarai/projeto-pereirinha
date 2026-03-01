import { getSiteSettings } from "@/app/admin/actions";
import { PartnersManager } from "./partners-manager";


export default async function PartnersPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logotipos de Parceiros</h1>
        <p className="text-muted-foreground">
          Exiba logotipos de empresas, patrocinadores ou marcas parceiras.
        </p>
      </div>
      <PartnersManager settings={settings} />
    </div>
  );
}