import { getSiteSettings } from "@/app/admin/actions";
import { SiteFooter } from "@/components/site-footer";
import { Lock, Eye, Database, Cookie } from "lucide-react";

export default async function PrivacidadePage() {
  const settings = await getSiteSettings();
  
  const company = settings.legal_company_name || "Nossa Empresa";
  const email = settings.legal_email || "contato@empresa.com";
  const siteName = settings.legal_site_name || "nossa plataforma";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <section className="bg-zinc-100 py-20 dark:bg-zinc-900 border-b">
          <div className="container mx-auto px-6 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
              <Lock size={32} />
            </div>
            <h1 className="font-display text-4xl font-black uppercase tracking-tighter md:text-6xl">
              Privacidade
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground font-medium">
              Sua privacidade é nossa prioridade. Entenda como protegemos seus dados em {siteName}.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
              
              <div className="flex gap-6 items-start">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 shrink-0">
                  <Database size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold mt-0">Coleta de Informações</h2>
                  <p className="text-muted-foreground">
                    Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 shrink-0">
                  <Eye size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold mt-0">Uso de Dados</h2>
                  <p className="text-muted-foreground">
                    A {company} apenas retém informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, os protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 shrink-0">
                  <Cookie size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold mt-0">Cookies e Rastreamento</h2>
                  <p className="text-muted-foreground">
                    Utilizamos cookies para entender como você utiliza nosso site e para melhorar sua experiência. Você é livre para recusar a nossa solicitação de cookies, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-blue-100 bg-blue-50/30 p-8 dark:border-blue-500/10 dark:bg-blue-500/5">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400">Dúvidas sobre seus dados?</h3>
                <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco através do e-mail: <strong>{email}</strong>.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}