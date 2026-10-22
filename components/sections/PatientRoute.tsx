import Link from "next/link";
import { ArrowRight, HeartPulse, Pill, ScanLine, Stethoscope, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteStep {
  title: string;
  body: string;
  icon: LucideIcon;
}

/** Ruta del paciente (decisión del cliente): 4 pasos, de la primera prueba al control continuo. */
export const PATIENT_ROUTE: readonly RouteStep[] = [
  { title: "Diagnóstico y densitometría", body: "Te evaluamos y hacemos los estudios necesarios para saber qué tienes.", icon: ScanLine },
  { title: "Plan médico y suplementación", body: "Tu médico te explica tu plan. Si lo indica, incluye suplementos.", icon: Pill },
  { title: "Tratamiento especializado", body: "Medicamentos, procedimientos y terapias según tu caso, con supervisión.", icon: Stethoscope },
  { title: "Seguimiento continuo", body: "Controles programados y monitoreo para ver cómo vas, sin dejarte solo.", icon: HeartPulse },
];

interface PatientRouteProps {
  /** id del h2. */
  id?: string;
  /** Muestra el enlace a /seguimiento (en la Home). */
  withLink?: boolean;
  className?: string;
}

/**
 * Bloque visual de 4 pasos con números grandes en monoespaciada y una línea de progreso fina que se
 * completa al recorrer la sección (CSS ligado al scroll; estática sin soporte). Componente de servidor.
 */
export function PatientRoute({ id = "ruta-title", withLink = true, className }: PatientRouteProps) {
  return (
    <section aria-labelledby={id} className={cn("section-y", className)}>
      <div className="container-page">
        <p className="eyebrow">
          <span aria-hidden className="size-1.5 rounded-full bg-teal" />
          Ruta del paciente
        </p>
        <h2 id={id} className="text-h2 mt-4 max-w-2xl text-heading">
          No te dejamos solo: te acompañamos antes, durante y después
        </h2>
        <div className="relative mt-12">
          {/* Riel de progreso (horizontal desde tablet): fondo tenue + relleno teal → aqua. */}
          <div aria-hidden className="absolute inset-x-0 top-[1.375rem] hidden h-px bg-line md:block">
            <div className="progress-track h-px bg-gradient-to-r from-teal via-teal to-video-glow" />
          </div>
          <ol className="grid gap-4 md:grid-cols-4 md:gap-5">
            {PATIENT_ROUTE.map(({ title, body, icon: Icon }, index) => (
              <li key={title} className="relative">
                <span aria-hidden className="relative z-10 hidden size-11 place-items-center rounded-full border border-teal/50 bg-bg md:grid">
                  <span className="size-2.5 rounded-full bg-teal shadow-[0_0_12px_2px_rgb(97_224_208/0.6)]" />
                </span>
                <div className="glass-panel h-full rounded-[1.5rem] p-5 shadow-soft md:mt-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="data-mono text-[2.75rem] font-bold leading-none text-heading">
                      <span className="sr-only">Paso </span>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-tint text-primary">
                      <Icon aria-hidden strokeWidth={1.75} className="size-6" />
                    </span>
                  </div>
                  <span className="mt-4 block font-display text-lg font-bold text-heading">{title}</span>
                  <span className="mt-1 block text-base text-muted">{body}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
        {withLink ? (
          <Link href="/seguimiento" className="mt-8 inline-flex min-h-12 items-center gap-1.5 font-display font-semibold text-primary hover:underline">
            Cómo es el seguimiento <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
