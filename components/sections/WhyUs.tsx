import { BadgeCheck, CalendarClock, HeartHandshake, MessageCircle, Stethoscope, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

interface Differentiator {
  icon: LucideIcon;
  title: string;
  text: string;
  className?: string;
}

const DIFFERENTIATORS: readonly Differentiator[] = [
  {
    icon: Video,
    title: "Teleconsulta reumatológica",
    text: "Atención sin traslados por videollamada: WhatsApp, Zoom o Google Meet, el que prefieras.",
    className: "lg:col-span-2",
  },
  {
    icon: MessageCircle,
    title: "Exámenes previos por WhatsApp",
    text: "Envía tus análisis, densitometrías o ecografías (foto o PDF) al agendar, para que el doctor los revise antes.",
  },
  {
    icon: BadgeCheck,
    title: "Plan de tratamiento y seguimiento",
    text: "Al terminar recibes tu plan en formato digital y, si el doctor lo indica, la receta y las órdenes de exámenes.",
  },
  {
    icon: CalendarClock,
    title: "Densitometría con cita previa",
    text: "Columna y caderas en 3 sedes de Lima Norte y Callao; dos de ellas frente a hospitales.",
    className: "lg:col-span-2",
  },
]

/** Los 4 sellos textuales de la tarjeta de KARE SAC (sin cifras inventadas, D2). */
const TRUST_SEALS: readonly { icon: LucideIcon; label: string }[] = [
  { icon: BadgeCheck, label: "Resultados claros y confiables" },
  { icon: CalendarClock, label: "Atención con cita previa" },
  { icon: Stethoscope, label: "Apoyo al diagnóstico médico" },
  { icon: HeartHandshake, label: "Servicio orientado a médicos y pacientes" },
];

export function WhyUs() {
  return (
    <section aria-labelledby="por-que-title" className="section-y">
      <div className="container-page">
        <SectionHeading
          id="por-que-title"
          eyebrow={`Por qué ${site.name}`}
          title="Medicina especializada, cercana y sin vueltas"
          description="Reumatología por videollamada y densitometría ósea con cita previa, con información clara en cada paso."
        />

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RevealItem className="conic-border relative overflow-hidden rounded-[1.75rem] bg-navy p-7 text-white sm:col-span-2 lg:row-span-2 dark:bg-navy-3">
            <div aria-hidden className="absolute -right-16 -top-16 size-56 rounded-full bg-teal/25 blur-3xl" />
            <p className="relative font-display text-lg font-semibold text-teal-200">Nuestro compromiso</p>
            <ul className="relative mt-6 grid gap-5 sm:grid-cols-2">
              {TRUST_SEALS.map(({ icon: SealIcon, label }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-teal-200">
                    <SealIcon aria-hidden strokeWidth={1.75} className="size-6" />
                  </span>
                  <span className="pt-2 font-display text-lg font-semibold leading-snug">{label}</span>
                </li>
              ))}
            </ul>
            <p className="relative mt-8 text-sm text-slate-300">Sellos de la tarjeta de presentación de KARE SAC — Servicios Médicos.</p>
          </RevealItem>

          {DIFFERENTIATORS.map(({ icon: ItemIcon, title, text, className }) => (
            <RevealItem
              key={title}
              className={cn("conic-border glass rounded-[1.75rem] p-6 shadow-soft", className)}
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-teal-tint text-primary">
                <ItemIcon aria-hidden strokeWidth={1.75} className="size-6" />
              </span>
              <h3 className="text-h3 mt-4">{title}</h3>
              <p className="mt-2 text-muted">{text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
