import { Hero } from "@/components/hero";
import { InformationSection } from "@/components/information-section";
import { RegistrationFormWrapper } from "@/components/registration-form-wrapper";
import { Statistics } from "@/components/statistics";
import { SocialLinksSection } from "@/components/social-links-section";
import { ComunicadosSection } from "@/components/comunicados-section";
import { CtaSection } from "@/components/cta-section";
import { SiteFooter } from "@/components/site-footer";
import {
  getSiteSettings,
  getCategorias,
  getEstatisticas,
  getInstagramPosts,
} from "@/app/admin/actions";
import { MessageCircle } from "lucide-react";
import { FaqSection } from "@/components/faq-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { PartnersSection } from "@/components/partners-section";
import { VideoSection } from "@/components/video-section";
import { GallerySection } from "@/components/gallery-section";
import { CheckoutSection } from "@/components/checkout-section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { LeadPopup } from "@/components/lead-popup";
import { PricingSection } from "@/components/pricing-section";
import { BookingSection } from "@/components/booking-section";

export default async function Page() {
  const [settings, categoriasDB, stats, instaPosts] = await Promise.all([
    getSiteSettings(),
    getCategorias(),
    getEstatisticas(),
    getInstagramPosts(),
  ]);

  const categoriasText = categoriasDB
    .filter((c) => c.ativa)
    .map((c) => c.nome)
    .join(", ");

  const globalTimerDate = settings.global_timer_date || null;
  const animationsActive = settings.effects_animations_active === "true";
  const animationSpeed = parseFloat(
    settings.effects_scroll_reveal_speed || "0.5",
  );

  // Ordem padrão utilizando apenas chaves em inglês para consistência
  const defaultOrder =
    "info,registration,stats,social,comunicados,cta,faq,testimonials,partners,video,gallery,checkout,pricing,booking";
  const sectionsOrder = (settings.sections_order || defaultOrder).split(",");

  const renderSection = (key: string) => {
    switch (key) {
      case "info":
        return (
          settings.section_info_active === "true" && (
            <InformationSection
              key={key}
              faixaEtaria={settings.faixa_etaria}
              horarios={settings.horarios}
              endereco={settings.endereco}
              categorias={categoriasText}
            />
          )
        );
      case "registration":
        return (
          settings.section_registration_active === "true" && (
            <RegistrationFormWrapper key={key} />
          )
        );
      case "stats":
        return (
          settings.section_stats_active === "true" && (
            <Statistics
              key={key}
              dataJson={settings.section_stats_data} // Agora passa o JSON completo do banco
            />
          )
        );
      case "social":
        return (
          settings.section_social_active === "true" && (
            <SocialLinksSection key={key} settings={settings} />
          )
        );
      case "comunicados":
        return (
          settings.section_comunicados_active === "true" && (
            <ComunicadosSection key={key} />
          )
        );
      case "cta":
        return (
          settings.section_cta_active === "true" && (
            <CtaSection key={key} settings={settings.form_external_url} />
          )
        );
      case "faq":
        return (
          settings.section_faq_active === "true" && (
            <FaqSection key={key} data={settings.section_faq_data} />
          )
        );
      case "testimonials":
        return (
          settings.section_testimonials_active === "true" && (
            <TestimonialsSection
              key={key}
              data={settings.section_testimonials_data}
            />
          )
        );
      case "partners":
        return (
          settings.section_partners_active === "true" && (
            <PartnersSection key={key} data={settings.section_partners_data} />
          )
        );
      case "video":
        return (
          settings.section_video_active === "true" && (
            <VideoSection
              key={key}
              dataJson={settings.section_video_data}
              globalTimerDate={globalTimerDate}
            />
          )
        );
      case "gallery":
        return (
          settings.section_gallery_active === "true" && (
            <GallerySection
              key={key}
              dataJson={settings.section_gallery_data}
            />
          )
        );
      case "checkout":
        return (
          settings.section_checkout_active === "true" && (
            <CheckoutSection
              key={key}
              dataJson={settings.section_checkout_data}
            />
          )
        );
      case "pricing":
        return (
          settings.section_pricing_active === "true" && (
            <PricingSection
              key={key}
              dataJson={settings.section_pricing_data}
            />
          )
        );
      case "booking":
        return (
          settings.section_booking_active === "true" && (
            <BookingSection
              key={key}
              type={settings.section_booking_type as any}
              url={settings.section_booking_url}
              title={settings.section_booking_title}
              description={settings.section_booking_description}
            />
          )
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
    :root {
    --background-overlay: ${settings.theme_bg_color || "#111111"}99;
      --background: ${settings.theme_bg_color || "#111111"};
      --primary: ${settings.theme_bg_color || "#111111"};
      --accent: ${settings.theme_accent_color || "#22c55e"};
      --accent-foreground: #ffffff;
      --text-primary: ${settings.theme_text_primary || "#ffffff"};
      --text-secondary: ${settings.theme_text_secondary || "#a1a1aa"};
    }
      .bg-hero-overlay { background-color: var(--background-overlay) !important; }
    body { 
      background-color: var(--background); 
      color: var(--text-primary);
    }
    h1, h2, h3, h4, h5, h6 { color: var(--text-primary) !important; }
    p, span:not(.text-accent) { color: var(--text-secondary); }
    
    .text-primary { color: var(--text-primary) !important; }
    .text-secondary { color: var(--text-secondary) !important; }
    .bg-primary { background-color: var(--background) !important; }
    .bg-accent { background-color: var(--accent) !important; }
    .text-accent { color: var(--accent) !important; }
    
  `,
        }}
      />

      <main>
        {settings.section_hero_active === "true" && (
          <Hero
            // Mídia e Logo
            logoUrl={settings.logo_url}
            logoStyle={settings.hero_logo_style}
            logoSize={settings.hero_logo_size}
            // Textos e Visibilidade
            heroTitle={settings.hero_title}
            heroSubtitle={settings.hero_subtitle}
            heroDescription={settings.hero_description}
            heroChipTopText={settings.hero_chip_top_text}
            titleVisible={settings.hero_title_visible !== "false"}
            subtitleVisible={settings.hero_subtitle_visible !== "false"}
            descVisible={settings.hero_desc_visible !== "false"}
            dividerVisible={settings.hero_divider_visible !== "false"}
            chipTopActive={settings.hero_chip_top_active === "true"}
            // Botão 1
            buttonText={settings.hero_button_text}
            buttonLink={settings.hero_button_link}
            buttonVisible={settings.hero_button_visible !== "false"}
            buttonNewTab={settings.hero_button_new_tab === "true"}
            // Botão 2
            button2Text={settings.hero_button_2_text}
            button2Link={settings.hero_button_2_link}
            button2Active={settings.hero_button_2_active === "true"}
            button2NewTab={settings.hero_button_2_new_tab === "true"}
            // Estilo e Layout
            alignH={settings.hero_align_h}
            alignV={settings.hero_align_v}
            buttonRadius={settings.hero_button_radius}
            heroFontFamily={settings.hero_font_family}
            scrollVisible={settings.hero_scroll_visible !== "false"}
            // Chips de Rodapé
            footerChipsActive={settings.hero_footer_chips_active === "true"}
            footerChipsData={settings.hero_footer_chips_data}
            heroTitleFont={settings.hero_title_font}
            heroTitleUnderline={settings.hero_title_underline}
            heroSubtitleFont={settings.hero_subtitle_font}
            heroSubtitleUnderline={settings.hero_subtitle_underline}
            heroDescFont={settings.hero_description_font}
            heroDescUnderline={settings.hero_description_underline}
            // Botões
            heroButtonBg={settings.hero_button_bg}
            heroButtonColor={settings.hero_button_color}
            heroButtonFont={settings.hero_button_font}
            heroButton2Border={settings.hero_button_2_border}
            heroButton2Color={settings.hero_button_2_color}
            // Chips Rodapé
            heroFooterAlign={settings.hero_footer_align}
            heroFooterFont={settings.hero_footer_font}
            heroFooterColor={settings.hero_footer_color}
            heroFooterBg={settings.hero_footer_bg}
            heroFooterBorder={settings.hero_footer_border}
            heroChipFont={settings.hero_chip_font}
            heroDividerColor={settings.hero_divider_color}
            heroChipColor={settings.hero_chip_color}
            heroChipBg={settings.hero_chip_bg}
            heroChipBorder={settings.hero_chip_border}
            heroImage={settings.hero_image_url}
            heroVideo={settings.hero_video_url}
            // SWITCHES DE VISIBILIDADE (O que faltava para o switch funcionar)
            mediaVisible={settings.hero_media_visible !== "false"} // Controla o Banner
            videoVisible={settings.hero_video_visible !== "false"} // Controla o Vídeo
            logoVisible={settings.hero_logo_visible !== "false"} // Controla a Logo
            parallaxActive={settings.hero_parallax_active === "true"}
          />
        )}

        {sectionsOrder.map((sectionKey) => (
          <ScrollReveal
            key={sectionKey.trim()}
            active={animationsActive}
            speed={animationSpeed}
          >
            {renderSection(sectionKey.trim())}
          </ScrollReveal>
        ))}

        {settings.section_footer_active === "true" && (
          <SiteFooter settings={settings} />
        )}

        {settings.float_button_active === "true" && (
          <a
            href={settings.float_button_link}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-transform hover:scale-110"
            style={{ backgroundColor: settings.float_button_color }}
          >
            <MessageCircle className="text-white h-6 w-6" />
          </a>
        )}

        {settings.section_popup_active === "true" && (
          <LeadPopup dataJson={settings.section_popup_data} />
        )}
      </main>
    </>
  );
}
