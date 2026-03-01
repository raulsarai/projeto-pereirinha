import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "./admin/actions";
import React from "react"; // Adicionado para suportar React.ReactNode

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
  title: "Projeto Pereirinha - Gremio Recreativo",
  description:
    "Futebol recreativo para jovens de 4 a 17 anos em Sao Paulo. Inscricoes abertas!",
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
};

// Definição do tipo para as props do layout
interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const settings = await getSiteSettings(); // Busca as chaves de marketing dinâmicas

  return (
    <html lang="pt-BR" className={`${_inter.variable} ${_oswald.variable}`}>
      <head>
        {/* Google Analytics dinâmico */}
        {settings.marketing_ga_id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.marketing_ga_id}`} />
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.marketing_ga_id}');
            `}} />
          </>
        )}
        
        {/* Facebook Pixel dinâmico */}
        {settings.marketing_fb_pixel_id && (
          <script dangerouslySetInnerHTML={{ __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${settings.marketing_fb_pixel_id}');
            fbq('track', 'PageView');
          `}} />
        )}

        {/* SEO Avançado: OpenGraph Image configurada no Admin */}
        {settings.seo_og_image_url && (
          <meta property="og:image" content={settings.seo_og_image_url} />
        )}
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}