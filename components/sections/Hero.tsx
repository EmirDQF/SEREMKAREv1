import Link from "next/link";
import { ArrowRight, Video } from "lucide-react";
import { NextSlotChip } from "@/components/consulta/NextSlotChip";
import { HeroVisual } from "@/components/sections/HeroVisual";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { buttonVariants } from "@/components/ui/button";
import { REAL_DOCTOR_SLUG } from "@/data/doctors";
import { BOOKING_HREF, TRIAGE_HREF } from "@/data/navigation";
import { teleconsultHero } from "@/data/teleconsult-content";
import { doctorContact } from "@/lib/whatsapp";

const HEADLINE_LEAD = "Teleconsulta con un reumatólogo";
const HEADLINE_ACCENT = "sin salir de casa";

/**
 * Hero de la Home: abre con la teleconsulta. Componente de servidor (sin JS propio salvo el chip
 * de próximo horario): el h1 se pinta con el HTML, así el LCP no espera a ninguna animación.
 */
export function Hero() {
  const contact = doctorContact();
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pb-14 pt-32 sm:pt-40 lg:pb-24 lg:pt-44">
      <div aria-hidden className="mesh-bg -z-10" />
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card-solid/70 px-4 py-2 text-sm font-semibold text-heading shadow-soft">
            <Video aria-hidden strokeWidth={1.75} className="size-4 text-primary" />
            {teleconsultHero.eyebrow}
          </p>
          <h1 id="hero-title" className="text-display mt-5 text-heading">
            {HEADLINE_LEAD}{" "}
            <span className="bg-gradient-to-r from-primary to-video bg-clip-text text-transparent dark:from-teal">
              {HEADLINE_ACCENT}
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted sm:text-xl">
            Si tienes dolor de rodilla, artritis, artrosis, lupus u osteoporosis, atiéndete por videollamada con el Dr. Daniel Ccolcca,
            médico reumatólogo. Revisamos tus exámenes y te acompañamos en tu tratamiento.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href={BOOKING_HREF} className={buttonVariants({ variant: "primary", size: "lg" })}>
              Agendar teleconsulta
              <ArrowRight aria-hidden strokeWidth={1.75} />
            </Link>
            {contact ? (
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                <WhatsAppIcon className="text-whatsapp-strong" />
                Hablar con el doctor
                <span className="sr-only"> (WhatsApp, se abre en otra pestaña)</span>
              </a>
            ) : null}
          </div>
          <p className="mt-3">
            <Link href={TRIAGE_HREF} className="inline-flex min-h-12 items-center gap-1 font-semibold text-primary hover:underline">
              ¿No sabes si es para ti? Evalúa tus síntomas <ArrowRight aria-hidden className="size-4" />
            </Link>
          </p>
          <NextSlotChip doctorSlug={REAL_DOCTOR_SLUG} className="mt-3" />
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
