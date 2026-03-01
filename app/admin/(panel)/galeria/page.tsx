import { getSiteSettings } from "@/app/admin/actions";
import { GalleryManager } from "./gallery-manager";

export default async function GalleryPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Galeria de Fotos</h1>
        <p className="text-muted-foreground">
          Gerencie as fotos do projeto e escolha o layout de exibição.
        </p>
      </div>
      <GalleryManager settings={settings} />
    </div>
  );
}