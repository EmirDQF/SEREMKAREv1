import Link from "next/link";
import { ArrowRight, CalendarCheck, HeartHandshake, Microscope, ScanLine, Stethoscope } from "lucide-react";
import { HeroVisual } from "@/components/sections/HeroVisual";
import { buttonVariants } from "@/components/ui/button";
import { APPOINTMENT_HREF, DENSITOMETRY_BOOKING_HREF, TRIAGE_HREF } from "@/data/navigation";
import { CENTER_TAGLINE } from "@/data/site";

/** Conceptos del modelo de atención (no son cifras: nada que verificar). */
const CARE_CONCEPTS = [
  { label: "Atención integral", icon: HeartHandshake },
  { label: "Diagnóstico de precisión", icon: Microscope },
  { label: "Seguimiento personalizado", icon: Stethoscope },
  { label: "Presencial y teleconsulta", icon: CalendarCheck },
] as const;

/**
 * Hero de la Home: posiciona al centro de reumatología y lleva a «Agendar cita». Componente de
 * servidor sin JS propio: el h1 y el párrafo se pintan con el HTML (el LCP no espera animaciones).
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pb-14 pt-32 sm:pt-40 lg:pb-24 lg:pt-44">
      <div aria-hidden className="mesh-bg -z-10" />
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card-solid/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-heading shadow-soft sm:text-sm">
            <Stethoscope aria-hidden strokeWidth={1.75} className="size-4 shrink-0 text-primary" />
            {CENTER_TAGLINE}
          </p>
          <h1 id="hero-title" className="text-hero mt-5 text-balance text-heading">
            Excelencia en Reumatología,{" "}
            <span className="bg-gradient-to-r from-primary to-video bg-clip-text text-transparent dark:from-teal">Densitometría</span> y
            Cuidado Articular Integral
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted sm:text-xl">
            Somos un centro especializado en las enfermedades de las articulaciones y los huesos. Te ayudamos a prevenir, a saber qué
            tienes (con densitometría ósea y otros estudios), a tratarte y a seguir tu evolución. En nuestras sedes o por
            teleconsulta.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={APPOINTMENT_HREF} className={buttonVariants({ variant: "primary", size: "lg" })}>
              <CalendarCheck aria-hidden strokeWidth={1.75} />
              Agendar cita ahora
            </Link>
            <Link href={DENSITOMETRY_BOOKING_HREF} className={buttonVariants({ variant: "outline", size: "lg" })}>
              <ScanLine aria-hidden strokeWidth={1.75} className="text-primary" />
              Reservar densitometría
            </Link>
          </div>
          <p className="mt-3 flex flex-wrap gap-x-5">
            <Link href={TRIAGE_HREF} className="inline-flex min-h-12 items-center gap-1 font-semibold text-primary hover:underline">
              ¿No sabes qué necesitas? Evaluación rápida <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link href="/suplementos" className="inline-flex min-h-12 items-center gap-1 font-semibold text-primary hover:underline">
              Ver suplementos <ArrowRight aria-hidden className="size-4" />
            </Link>
          </p>
          <ul aria-label="Nuestro modelo de atención" className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:flex-wrap">
            {CARE_CONCEPTS.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-2 text-[0.95rem] font-semibold text-heading">
                <Icon aria-hidden strokeWidth={1.75} className="size-5 shrink-0 text-primary" />
                {label}
              </li>
            ))}
          </ul>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
