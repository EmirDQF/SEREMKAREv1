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

/** Bloque visual de 4 pasos. Componente de servidor, sin JS: una línea que une los pasos (CSS). */
export function PatientRoute({ id = "ruta-title", withLink = true, className }: PatientRouteProps) {
  return (
    <section aria-labelledby={id} className={cn("section-y", className)}>
      <div className="container-page">
        <p className="eyebrow">Ruta del paciente</p>
        <h2 id={id} className="text-h2 mt-4 max-w-2xl text-heading">
          No te dejamos solo: te acompañamos antes, durante y después
        </h2>
        <ol className="relative mt-10 grid gap-4 md:grid-cols-4">
          <span
            aria-hidden
            className="absolute bottom-6 left-[1.75rem] top-6 w-0.5 bg-gradient-to-b from-teal to-video md:bottom-auto md:left-6 md:right-6 md:top-[1.75rem] md:h-0.5 md:w-auto md:bg-gradient-to-r"
          />
          {PATIENT_ROUTE.map(({ title, body, icon: Icon }, index) => (
            <li key={title} className="relative flex gap-4 md:flex-col">
              <span className="relative grid size-14 shrink-0 place-items-center rounded-2xl border border-line bg-card-solid text-primary shadow-soft">
                <Icon aria-hidden strokeWidth={1.75} className="size-7" />
                <span className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-primary font-display text-xs font-bold text-on-primary">
                  {index + 1}
                </span>
              </span>
              <span className="pt-1 md:pt-0">
                <span className="block font-display text-lg font-bold text-heading">{title}</span>
                <span className="mt-1 block text-[0.975rem] text-muted">{body}</span>
              </span>
            </li>
          ))}
        </ol>
        {withLink ? (
          <Link href="/seguimiento" className="mt-8 inline-flex min-h-12 items-center gap-1.5 font-display font-semibold text-primary hover:underline">
            Cómo es el seguimiento <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
