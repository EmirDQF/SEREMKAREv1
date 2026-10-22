import { ViewTransition, type ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";

/**
 * Estructura completa del sitio público: cabecera, contenido, pie y accesos flotantes.
 *
 * Sin <Suspense> alrededor de la cabecera ni del contenido: React «saca» del flujo los límites grandes
 * (más de ~12 KB de HTML) y los revela después con un script ($RC) y una pausa; si el hero queda
 * dentro, el párrafo LCP espera ese revelado (medido: +640 ms de pantalla en blanco).
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="contenido" tabIndex={-1} className="focus:outline-none">
        {/* Fundido corto entre páginas (View Transitions API); sin soporte, navegación normal. */}
        <ViewTransition>{children}</ViewTransition>
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileActionBar />
    </>
  );
}
