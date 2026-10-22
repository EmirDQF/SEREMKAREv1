import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { MedicalDisclaimer } from "@/components/shared/MedicalDisclaimer";
import { buttonVariants } from "@/components/ui/button";
import { APPOINTMENT_HREF } from "@/data/navigation";
import { clinicWhatsApp } from "@/lib/whatsapp";

interface CtaBandProps {
  title: string;
  text: string;
  /** Mensaje prellenado de WhatsApp. */
  message: string;
}

/** Cierre de página: CTA de agendar (WhatsApp + formulario) y aviso médico. */
export function CtaBand({ title, text, message }: CtaBandProps) {
  return (
    <section aria-label="Agendar" className="pb-24">
      <div className="container-page">
        <div className="scan-panel relative isolate overflow-hidden rounded-[2rem] px-6 py-12 text-center text-white sm:px-12 lg:py-16">
          <div aria-hidden className="aurora -z-10" />
          <div aria-hidden className="immersive-grid -z-10" />
          <h2 className="text-h2 mx-auto max-w-3xl text-white">{title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-on-navy-muted">{text}</p>
          {/* Mismo par de CTA en todo el sitio: «Agendar cita» (principal) + WhatsApp. */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={APPOINTMENT_HREF} className={buttonVariants({ variant: "primary", size: "lg" })}>
              <CalendarCheck aria-hidden strokeWidth={1.75} /> Agendar cita
            </Link>
            <a href={clinicWhatsApp(message)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "whatsapp", size: "lg" })}>
              <WhatsAppIcon /> Agendar por WhatsApp
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
          </div>
        </div>
        <MedicalDisclaimer className="mt-6" />
      </div>
    </section>
  );
}
