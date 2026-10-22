import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteEffects } from "@/components/layout/SiteEffects";
import { JsonLd } from "@/components/shared/JsonLd";
import { CENTER_TAGLINE, site } from "@/data/site";
import { DEFAULT_DESCRIPTION, SHARE_IMAGE } from "@/lib/seo";
import { organizationSchema } from "@/lib/schema";
import "./globals.css";

/*
 * Texto: pila de fuentes del sistema (Segoe UI, Roboto, San Francisco). El elemento LCP de la Home
 * es un párrafo: sin fuente web en la ruta crítica, se pinta con el primer HTML sin esperar descargas.
 */

/**
 * Títulos y botones: Plus Jakarta Sans (licencia SIL Open Font License 1.1), archivo variable 200–800,
 * subconjunto latino (cubre á, é, ñ, ¿, ¡). Guardado en el proyecto (app/fonts) en lugar de
 * next/font/google: el build ya no descarga nada de Google, así que no falla si el servidor de
 * compilación no tiene salida a internet. Sin preload y con display «optional»: si no llega en ~100 ms
 * se queda la fuente de respaldo ajustada, sin cambio a mitad de carga (CLS 0).
 */
const jakarta = localFont({
  src: "./fonts/plus-jakarta-sans-latin.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-jakarta",
  display: "optional",
  preload: false,
  adjustFontFallback: "Arial",
});

const DEFAULT_TITLE = `${CENTER_TAGLINE} en Lima Norte y Callao | ${site.name}`;

/** Deben coincidir con THEME_STORAGE_KEY (lib/theme.ts) y MOTION_STORAGE_KEY (lib/motion-preference.ts). */
const THEME_STORAGE_KEY = "sermekare-theme";
const MOTION_STORAGE_KEY = "sermekare-motion";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: DEFAULT_TITLE, template: `%s | ${site.name}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: site.name,
  keywords: [
    "reumatólogo en Lima",
    "reumatólogo Lima Norte",
    "infiltración ecoguiada Lima",
    "tratamiento artritis reumatoide Lima",
    "densitometría ósea Lima",
    "centro de reumatología Lima",
    "artrosis",
    "osteoporosis",
    "teleconsulta reumatología",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "/",
    siteName: site.name,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [SHARE_IMAGE],
  },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, images: [SHARE_IMAGE.url] },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7fafe" },
    { media: "(prefers-color-scheme: dark)", color: "#081128" },
  ],
};

/**
 * Antes del primer pintado: aplica el tema guardado (evita el destello) y el interruptor
 * "Reducir animaciones" del footer (data-reduce-motion), igual que prefers-reduced-motion.
 */
const PREFERENCES_SCRIPT = `try{var d=document.documentElement,t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="dark"||t==="light")d.dataset.theme=t;if(localStorage.getItem("${MOTION_STORAGE_KEY}")==="reduce")d.dataset.reduceMotion="true"}catch(e){}`;

/** Sin JavaScript, el contenido con animación de entrada debe verse igual. */
const NO_SCRIPT_STYLE = "[data-reveal],[data-kinetic] *{opacity:1!important;transform:none!important;filter:none!important}";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-PE" data-theme="light" suppressHydrationWarning className={jakarta.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFERENCES_SCRIPT }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: NO_SCRIPT_STYLE }} />
        </noscript>
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <JsonLd data={organizationSchema()} />
        {/* Cabecera y pie los pone cada grupo: (site) completo; (consultorio) mínimo. */}
        {children}
        {/* Hoja sin hijos: conecta menús, diálogos e interruptores del HTML de servidor (sin envolver la página). */}
        <SiteEffects />
      </body>
    </html>
  );
}
