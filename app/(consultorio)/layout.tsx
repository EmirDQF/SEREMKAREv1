import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { MedicalDisclaimer } from "@/components/shared/MedicalDisclaimer";
import { clinicWhatsApp } from "@/lib/whatsapp";

const WHATSAPP_MESSAGE = "Hola SERMEKARE, tengo una duda sobre mi cita.";

/**
 * Consultorio a pantalla completa, sin distracciones: logo, «Salir» y un acceso discreto a
 * WhatsApp. Sin menú ni pie completos.
 */
export default function ConsultorioLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative isolate min-h-dvh bg-bg">
      <div aria-hidden className="consulta-ambient -z-10" />
      <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <Link href="/" aria-label="SERMEKARE, ir al inicio" className="shrink-0">
            <Logo />
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <a
              href={clinicWhatsApp(WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full px-3 text-sm font-semibold text-muted hover:text-heading"
            >
              <WhatsAppIcon className="size-5" />
              <span className="hidden sm:inline">¿Dudas? WhatsApp</span>
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
            <Link
              href="/"
              className="inline-flex min-h-12 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-semibold text-heading hover:border-primary"
            >
              <ArrowLeft aria-hidden className="size-4" /> Salir
            </Link>
          </div>
        </div>
      </header>
      <main id="contenido" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <footer className="container-page pb-10 pt-6 text-sm text-muted">
        <MedicalDisclaimer />
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          <span>Atención conforme a la Ley Marco de Telesalud (Ley N.° 30421)</span>
          <Link href="/politica-de-privacidad" className="underline underline-offset-4 hover:text-heading">
            Privacidad (Ley N.° 29733)
          </Link>
          <Link href="/terminos#consentimiento-teleconsulta" className="underline underline-offset-4 hover:text-heading">
            Consentimiento de teleconsulta
          </Link>
        </p>
      </footer>
    </div>
  );
}
