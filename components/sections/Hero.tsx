import Link from "next/link";
import { ArrowRight, ShieldCheck, Stethoscope, Video } from "lucide-react";
import { NextSlotChip } from "@/components/consulta/NextSlotChip";
import { HeroHeadline } from "@/components/sections/HeroHeadline";
import { HeroVisual } from "@/components/sections/HeroVisual";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { buttonVariants } from "@/components/ui/button";
import { BOOKING_HREF, TRIAGE_HREF } from "@/data/navigation";
import { teleconsultHero } from "@/data/teleconsult-content";
import { clinicWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** Sellos reales (sin cifras ni convenios no confirmados). */
const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Ley Marco de Telesalud (N.° 30421)" },
  { icon: Video, label: "WhatsApp, Zoom o Google Meet" },
  { icon: Stethoscope, label: "La evaluación orienta, no diagnostica" },
] as const;

const WHATSAPP_MESSAGE = "Hola, deseo agendar una teleconsulta virtual con el Dr. Ccolcca";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pb-16 pt-36 sm:pt-40 lg:pb-24 lg:pt-44">
      <div aria-hidden className="mesh-bg -z-10" />
      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card-solid/70 px-4 py-2 text-sm font-semibold text-heading shadow-soft">
            <span aria-hidden className="size-2 rounded-full bg-gradient-to-r from-coral to-teal" />
            {teleconsultHero.eyebrow}
          </p>
          <div className="mt-6">
            <HeroHeadline id="hero-title" />
          </div>
          <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
            Si tienes dolor de rodilla, artritis, artrosis, lupus u osteoporosis, atiéndete por videollamada con el Dr. Daniel Ccolcca,
            médico reumatólogo. Revisamos tus exámenes y te acompañamos en tu tratamiento.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={TRIAGE_HREF} className={buttonVariants({ variant: "primary", size: "lg", className: "shimmer-auto" })}>
              Evaluar mis síntomas
              <ArrowRight aria-hidden strokeWidth={1.75} />
            </Link>
            <a
              href={clinicWhatsApp(WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              <WhatsAppIcon className="text-whatsapp-strong" />
              Agendar por WhatsApp
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
          </div>
          <p className="mt-4">
            <Link href={BOOKING_HREF} className="inline-flex min-h-12 items-center gap-1 font-semibold text-primary hover:underline">
              Ya sé lo que necesito: ver horarios <ArrowRight aria-hidden className="size-4" />
            </Link>
          </p>
          <NextSlotChip className="mt-4" />
          <ul className="mt-8 grid gap-3 xl:grid-cols-3" aria-label="Por qué confiar en nosotros">
            {TRUST_ITEMS.map(({ icon: ItemIcon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-[0.95rem] font-medium text-heading">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-tint text-primary">
                  <ItemIcon aria-hidden strokeWidth={1.75} className="size-5" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
        <HeroVisual />
      </div>
      <div aria-hidden className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-bg")} />
    </section>
  );
}
