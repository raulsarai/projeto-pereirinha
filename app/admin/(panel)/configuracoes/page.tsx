import { getSiteSettings } from "@/app/admin/actions";
import { SettingsManager } from "./settings-manager";

export default async function ConfiguracoesPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-8">
      <SettingsManager settings={settings} />
    </div>
  );
}
