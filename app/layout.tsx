import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { CanvasHost } from "@/components/3d/CanvasHost";
import { JsonLd } from "@/components/shared/JsonLd";
import { site } from "@/data/site";
import { DEFAULT_DESCRIPTION } from "@/lib/seo";
import { organizationSchema } from "@/lib/schema";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const DEFAULT_TITLE = `Reumatólogo en Lima Norte y Callao | ${site.name}`;

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
    "viscosuplementación rodilla Lima",
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
  },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b192c" },
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
    <html lang="es-PE" data-theme="light" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFERENCES_SCRIPT }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: NO_SCRIPT_STYLE }} />
        </noscript>
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <JsonLd data={organizationSchema()} />
        <Providers>
          {/* Cabecera y pie los pone cada grupo: (site) completo; (consultorio) mínimo. */}
          {children}
          <CanvasHost />
        </Providers>
      </body>
    </html>
  );
}
