import Link from "next/link";
import { ArrowRight, CalendarCheck, ScanLine } from "lucide-react";
import { HeroVisual } from "@/components/sections/HeroVisual";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { Reticle } from "@/components/shared/Reticle";
import { APPOINTMENT_HREF, DENSITOMETRY_BOOKING_HREF, TRIAGE_HREF } from "@/data/navigation";
import { CENTER_TAGLINE } from "@/data/site";
import { clinicWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** Mensaje de WhatsApp del tercer camino del hero. */
const HERO_WHATSAPP_MESSAGE = "Hola SERMEKARE, quisiera orientación para agendar una cita.";

/**
 * Hero de la Home: posiciona al centro de reumatología y ofrece 3 caminos claros (cita,
 * densitometría, WhatsApp). Componente de servidor sin JS propio: el h1 y el párrafo (elemento LCP)
 * se pintan con el primer HTML; el fondo aurora, la cuadrícula y la línea de barrido son CSS.
 */
export function Hero() {
  const paths = [
    {
      href: APPOINTMENT_HREF,
      label: "Agendar cita",
      hint: "Presencial o teleconsulta",
      icon: CalendarCheck,
      primary: true,
      external: false,
    },
    {
      href: DENSITOMETRY_BOOKING_HREF,
      label: "Densitometría",
      hint: "Reserva tu estudio",
      icon: ScanLine,
      primary: false,
      external: false,
    },
    {
      href: clinicWhatsApp(HERO_WHATSAPP_MESSAGE),
      label: "WhatsApp",
      hint: "Te orientamos",
      icon: null,
      primary: false,
      external: true,
    },
  ] as const;

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pb-14 pt-36 sm:pt-40 lg:pb-24 lg:pt-44">
      <div aria-hidden className="aurora -z-10" />
      <div aria-hidden className="scan-grid -z-10" />
      <div aria-hidden className="scan-sweep -z-10 [--sweep-distance:640px]" />
      <Reticle className="pointer-events-none absolute -right-10 top-28 -z-10 hidden size-72 text-teal/30 lg:block" />

      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.12fr_1fr] lg:gap-10">
        <div className="min-w-0">
          <p className="eyebrow">
            <span aria-hidden className="size-1.5 rounded-full bg-teal" />
            {CENTER_TAGLINE}
          </p>
          <h1 id="hero-title" className="text-hero mt-5 text-balance text-heading">
            Excelencia en Reumatología, <span className="text-gradient-teal">Densitometría</span> y Cuidado Articular Integral
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted sm:text-xl">
            Somos un centro especializado en las enfermedades de las articulaciones y los huesos. Te ayudamos a prevenir, a saber qué
            tienes (con densitometría ósea y otros estudios), a tratarte y a seguir tu evolución. En nuestras sedes o por
            teleconsulta.
          </p>

          <ul aria-label="Elige cómo empezar" className="mt-8 grid gap-3 sm:grid-cols-3">
            {paths.map((path) => {
              const Icon = path.icon;
              const content = (
                <>
                  <span
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-xl",
                      path.primary ? "bg-white/15 text-on-primary" : "bg-teal-tint text-primary",
                    )}
                  >
                    {Icon ? <Icon aria-hidden strokeWidth={1.75} className="size-6" /> : <WhatsAppIcon className="size-6 text-whatsapp-strong" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-lg font-bold leading-tight">{path.label}</span>
                    <span className={cn("block text-base", path.primary ? "text-on-primary/90" : "text-muted")}>{path.hint}</span>
                  </span>
                </>
              );
              const className = cn(
                // Móvil: fila (icono + texto). Desde sm, tarjeta vertical: cabe en columnas estrechas sin cortar el texto.
                "flex h-full min-h-[4.5rem] items-center gap-3 rounded-2xl px-4 py-3 transition-[transform,box-shadow,border-color,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] sm:flex-col sm:items-start sm:gap-4 sm:p-4",
                path.primary
                  ? "glow-cta bg-primary text-on-primary hover:bg-primary-hover"
                  : "glass-panel text-heading shadow-soft hover:border-primary/50 hover:shadow-lift",
              );
              return (
                <li key={path.label}>
                  {path.external ? (
                    <a href={path.href} target="_blank" rel="noopener noreferrer" className={className}>
                      {content}
                      <span className="sr-only"> (se abre en otra pestaña)</span>
                    </a>
                  ) : (
                    <Link href={path.href} className={className}>
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <p className="mt-4 flex flex-wrap gap-x-6">
            <Link href={TRIAGE_HREF} className="inline-flex min-h-12 items-center gap-1 font-semibold text-primary hover:underline">
              ¿No sabes qué necesitas? Evaluación rápida <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link href="/suplementos" className="inline-flex min-h-12 items-center gap-1 font-semibold text-primary hover:underline">
              Ver suplementos <ArrowRight aria-hidden className="size-4" />
            </Link>
          </p>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
