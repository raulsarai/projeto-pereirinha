import { getSiteSettings } from "@/app/admin/actions";
import { SiteFooter } from "@/components/site-footer";
import { Scale, ShieldCheck, ScrollText } from "lucide-react";

export default async function TermosPage() {
  const settings = await getSiteSettings();
  
  const company = settings.legal_company_name || "Nossa Empresa";
  const cnpj = settings.legal_cnpj_nif || "00.000.000/0000-00";
  const siteName = settings.legal_site_name || "Plataforma";
  const address = settings.legal_address || "Endereço não informado";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        {/* Banner de Título */}
        <section className="bg-zinc-950 py-20 text-white">
          <div className="container mx-auto px-6 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20 text-accent">
              <Scale size={32} />
            </div>
            <h1 className="font-display text-4xl font-black uppercase tracking-tighter md:text-6xl">
              Termos de Uso
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-400 font-medium">
              Leia atentamente as regras de utilização do site {siteName}.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <div className="mb-12 flex items-center gap-4 rounded-2xl bg-muted p-6 border border-border">
                <ScrollText className="text-accent shrink-0" size={24} />
                <p className="text-sm m-0 text-muted-foreground font-medium">
                  Estes termos regem o uso do site operado por <strong>{company}</strong>, 
                  inscrita sob o documento <strong>{cnpj}</strong>, com sede em {address}.
                </p>
              </div>

              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ShieldCheck className="text-accent" /> 1. Aceitação dos Termos
              </h2>
              <p>
                Ao acessar e utilizar este site, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
              </p>

              <h2 className="text-2xl font-bold">2. Licença de Uso</h2>
              <p>
                É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site {siteName}, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:
              </p>
              <ul>
                <li>Modificar ou copiar os materiais;</li>
                <li>Usar os materiais para qualquer finalidade comercial ou exibição pública;</li>
                <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site;</li>
                <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais.</li>
              </ul>

              <h2 className="text-2xl font-bold">3. Isenção de Responsabilidade</h2>
              <p>
                Os materiais no site da {company} são fornecidos 'como estão'. Não oferecemos garantias, expressas ou implícitas, e, por este meio, isentamos e negamos todas as outras garantias, incluindo, sem limitação, garantias implícitas de comercialização ou adequação a um fim específico.
              </p>

              <h2 className="text-2xl font-bold">4. Limitações</h2>
              <p>
                Em nenhum caso a {company} ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em {siteName}.
              </p>

              <div className="mt-16 border-t pt-8 text-xs text-muted-foreground">
                <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}