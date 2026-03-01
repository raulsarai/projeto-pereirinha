import { getSiteSettings } from "@/app/admin/actions";
import { CheckoutManager } from "./checkout-manager";


export default async function PaymentPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Área de Checkout</h1>
        <p className="text-muted-foreground">
          Configure a plataforma de pagamento e gatilhos de escassez.
        </p>
      </div>
      <CheckoutManager settings={settings} />
    </div>
  );
}