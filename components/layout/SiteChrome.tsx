import { ViewTransition, type ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";

/** Estructura completa del sitio público: cabecera, contenido, pie y accesos flotantes. */
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
