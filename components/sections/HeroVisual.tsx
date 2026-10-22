import { CalendarCheck, HeartPulse, ScanLine, Video } from "lucide-react";
import { DoctorPortrait } from "@/components/shared/DoctorPortrait";
import { REAL_DOCTOR_SLUG, getDoctor } from "@/data/doctors";

/** Modalidades de atención reales del centro. */
const CARE_MODES = [
  { label: "Consulta presencial", icon: CalendarCheck },
  { label: "Densitometría", icon: ScanLine },
  { label: "Seguimiento clínico", icon: HeartPulse },
  { label: "Teleconsulta", icon: Video },
] as const;

/**
 * Tarjeta del especialista en el hero: foto real del Dr. Daniel Ccolcca (recorte limpio con borde
 * luminoso de 1 px y marcas de encuadre) y las modalidades de atención. Componente de servidor:
 * sin parallax, carrusel ni 3D; la foto es la única imagen precargada de la página.
 */
export function HeroVisual() {
  const doctor = getDoctor(REAL_DOCTOR_SLUG);
  return (
    <figure className="relative mx-auto w-full max-w-[21rem] sm:max-w-[24rem] lg:max-w-[28rem]">
      <div className="gradient-border glass-panel relative overflow-hidden rounded-[2.25rem] p-2 shadow-lift">
        <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-[linear-gradient(160deg,var(--navy-100),var(--teal-50))] dark:bg-[linear-gradient(160deg,var(--navy-800),var(--navy-900))]">
          <DoctorPortrait
            doctor={doctor}
            fill
            priority
            className="img-outline rounded-[1.75rem]"
            sizes="(min-width: 1024px) 432px, (min-width: 640px) 368px, 320px"
          />
          {/* Marcas de encuadre (visor de imagen médica), decorativas. */}
          <span aria-hidden className="frame-corners pointer-events-none absolute inset-3" />
          <span className="tech-label absolute bottom-3 left-3 rounded-full bg-navy-950/75 px-3 py-1.5 text-white">Reumatología</span>
        </div>
        <figcaption className="px-3 pb-3 pt-4 sm:px-4">
          <span className="block font-display text-lg font-bold leading-tight text-heading">{doctor.name}</span>
          <span className="block text-base text-muted">{doctor.title}</span>
          <span className="tech-label mt-4 block text-subtle">Modalidades de atención</span>
          <ul className="mt-2 grid grid-cols-2 gap-2">
            {CARE_MODES.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="flex min-h-12 items-center gap-2 rounded-xl border border-line bg-card-solid px-3 py-2 text-base font-semibold leading-tight text-heading"
              >
                <Icon aria-hidden strokeWidth={1.75} className="size-5 shrink-0 text-primary" />
                {label}
              </li>
            ))}
          </ul>
        </figcaption>
      </div>
    </figure>
  );
}
