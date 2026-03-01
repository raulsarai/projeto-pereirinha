import { getSiteSettings } from "@/app/admin/actions";
import { OrderManager } from "./order-manager";

export default async function OrderPage() {
  const settings = await getSiteSettings();
  
  const defaultOrder = "info,registration,stats,social,comunicados,cta,faq,testimonials,partners,video,gallery,checkout,pricing";
  const currentOrder = settings.sections_order || defaultOrder;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ordenação do Site</h1>
        <p className="text-muted-foreground">
          Arraste as secções para definir a ordem de exibição na página pública.
        </p>
      </div>

      <OrderManager initialOrder={currentOrder} />
    </div>
  );
}