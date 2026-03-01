import { getSiteSettings } from "@/app/admin/actions";
import { VideoManager } from "./video-manager";

export default async function VideoPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vídeo Promocional</h1>
        <p className="text-muted-foreground">
          Configure um vídeo de destaque com um botão de ação (CTA) personalizado.
        </p>
      </div>
      <VideoManager settings={settings} />
    </div>
  );
}