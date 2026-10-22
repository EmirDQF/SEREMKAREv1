import Link from "next/link";
import { ArrowRight, CalendarCheck, HeartPulse, ScanLine, Siren, Video, type LucideIcon } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { BOOKING_HREF, DENSITOMETRY_BOOKING_HREF, TRIAGE_HREF } from "@/data/navigation";
import { site } from "@/data/site";
import { EMERGENCY } from "@/data/teleconsult";
import { clinicWhatsApp } from "@/lib/whatsapp";

interface AppointmentType {
  id: string;
  title: string;
  /** Para quién es, en una frase simple. */
  forWhom: string;
  icon: LucideIcon;
  href: string;
  /** Se coordina por WhatsApp (sin reserva en línea todavía). */
  viaWhatsApp: boolean;
}

/**
 * Mensajes prellenados: solo texto fijo, ningún dato personal viaja en la URL.
 * CONFIRMAR: activar la reserva presencial en línea cuando exista el tipo de evento presencial en
 * Cal.com (docs/CONFIGURAR-CITAS.md); hasta entonces la consulta presencial y el control se coordinan por WhatsApp.
 */
const APPOINTMENT_TYPES: readonly AppointmentType[] = [
  {
    id: "presencial",
    title: "Consulta presencial",
    forWhom: "Para que el reumatólogo te examine en una de nuestras sedes.",
    icon: CalendarCheck,
    href: clinicWhatsApp(`Hola ${site.name}, quiero agendar una consulta presencial con el reumatólogo.`),
    viaWhatsApp: true,
  },
  {
    id: "densitometria",
    title: "Densitometría ósea",
    forWhom: "Para medir qué tan fuertes están tus huesos (detecta la osteoporosis).",
    icon: ScanLine,
    href: DENSITOMETRY_BOOKING_HREF,
    viaWhatsApp: false,
  },
  {
    id: "teleconsulta",
    title: "Teleconsulta",
    forWhom: "Para tu control o revisar resultados por videollamada, desde casa.",
    icon: Video,
    href: BOOKING_HREF,
    viaWhatsApp: false,
  },
  {
    id: "control",
    title: "Control o seguimiento",
    forWhom: "Si ya eres paciente y te toca tu control.",
    icon: HeartPulse,
    href: clinicWhatsApp(`Hola ${site.name}, ya soy paciente y quiero programar mi control.`),
    viaWhatsApp: true,
  },
];

const CARD =
  "group flex min-h-24 w-full items-center gap-4 rounded-[1.5rem] border border-line bg-card-solid p-4 text-left shadow-soft transition-[border-color,transform,box-shadow] duration-200 hover:border-primary hover:shadow-lift active:scale-[0.99] sm:p-5";

/**
 * Punto de entrada único de «Agendar cita»: el paciente elige el tipo de cita. Componente de
 * servidor (sin JS). Las opciones en línea abren el consultorio, que mantiene el filtro de alarmas.
 */
export function AppointmentTypePicker() {
  return (
    <section aria-labelledby="tipo-cita-title" className="grid gap-6">
      <div>
        <p className="eyebrow">Agendar cita</p>
        <h1 id="tipo-cita-title" tabIndex={-1} className="text-h2 mt-4 text-heading focus:outline-none">
          ¿Qué tipo de cita necesitas?
        </h1>
        <p className="mt-2 text-lg text-muted">Elige una opción. Te toma menos de un minuto.</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {APPOINTMENT_TYPES.map(({ id, title, forWhom, icon: Icon, href, viaWhatsApp }) => {
          const content = (
            <>
              <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-2xl bg-teal-tint text-primary">
                <Icon strokeWidth={1.75} className="size-7" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-bold text-heading">{title}</span>
                <span className="mt-0.5 block text-base text-muted">{forWhom}</span>
                {viaWhatsApp ? (
                  <span className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-whatsapp-strong">
                    <WhatsAppIcon className="size-4" /> Se coordina por WhatsApp
                  </span>
                ) : null}
              </span>
              <ArrowRight aria-hidden strokeWidth={1.75} className="size-6 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
            </>
          );
          return (
            <li key={id}>
              {viaWhatsApp ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className={CARD}>
                  {content}
                  <span className="sr-only"> (abre WhatsApp en otra pestaña)</span>
                </a>
              ) : (
                <Link href={href} className={CARD}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
      <p className="flex items-start gap-2 rounded-2xl border border-alert/40 bg-alert-tint p-4 text-base text-alert-strong">
        <Siren aria-hidden strokeWidth={1.75} className="mt-0.5 size-5 shrink-0 text-alert" />
        <span>
          ¿Tienes dolor de pecho, falta de aire, fiebre alta con una articulación caliente o una caída con dolor intenso? No esperes una
          cita: {EMERGENCY.action.toLowerCase()}
        </span>
      </p>
      <p>
        <Link href={TRIAGE_HREF} className="inline-flex min-h-12 items-center gap-1 font-semibold text-primary hover:underline">
          ¿No sabes cuál elegir? Haz la evaluación rápida <ArrowRight aria-hidden className="size-4" />
        </Link>
      </p>
    </section>
  );
}
