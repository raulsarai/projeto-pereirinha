import { getSiteSettings } from "@/app/admin/actions";
import { BookingManager } from "./booking-manager";

export default async function BookingPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agendamento Online</h1>
        <p className="text-muted-foreground">
          Configure a integração com Calendly ou Google Calendar para visitas e aulas experimentais.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <BookingManager settings={settings} />
      </div>
    </div>
  );
}