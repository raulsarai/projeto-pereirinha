import { getSiteSettings } from "@/app/admin/actions";
import { TestimonialsManager } from "./testimonials-manager";


export default async function TestimonialsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Depoimentos</h1>
        <p className="text-muted-foreground">
          Exiba o que os seus clientes dizem para aumentar a confiança no seu projeto.
        </p>
      </div>
      <TestimonialsManager settings={settings} />
    </div>
  );
}