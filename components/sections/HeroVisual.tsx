import { CalendarCheck, HeartPulse, ScanLine, Video } from "lucide-react";
import { DoctorPortrait } from "@/components/shared/DoctorPortrait";
import { REAL_DOCTOR_SLUG, getDoctor } from "@/data/doctors";

/** Modalidades de atención reales del centro (en lugar de un chat «En línea»). */
const CARE_MODES = [
  { label: "Consulta presencial", icon: CalendarCheck },
  { label: "Densitometría", icon: ScanLine },
  { label: "Seguimiento clínico", icon: HeartPulse },
  { label: "Teleconsulta", icon: Video },
] as const;

/**
 * Tarjeta del especialista en el hero: foto real del Dr. Daniel Ccolcca y las modalidades de
 * atención. Componente de servidor: sin parallax, carrusel ni 3D (la Home móvil no descarga three.js).
 */
export function HeroVisual() {
  const doctor = getDoctor(REAL_DOCTOR_SLUG);
  return (
    <figure className="relative mx-auto w-full max-w-[21rem] sm:max-w-[24rem] lg:max-w-[28rem]">
      <div
        aria-hidden
        className="absolute -inset-[6%] rounded-[46%_54%_52%_48%/50%_44%_56%_50%] bg-gradient-to-br from-teal/25 via-video-strong/10 to-navy-2/20"
      />
      <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-card-solid shadow-lift">
        <div className="relative aspect-square bg-bg-alt">
          <DoctorPortrait
            doctor={doctor}
            fill
            priority
            sizes="(min-width: 1024px) 448px, (min-width: 640px) 384px, 336px"
          />
        </div>
        <figcaption className="p-4 sm:p-5">
          <span className="block font-display text-lg font-bold leading-tight text-heading">{doctor.name}</span>
          <span className="block text-sm text-muted">{doctor.title}</span>
          <span className="mt-4 block text-xs font-bold uppercase tracking-[0.08em] text-subtle">Modalidades de atención</span>
          <ul className="mt-2 grid grid-cols-2 gap-2">
            {CARE_MODES.map(({ label, icon: Icon }) => (
              <li key={label} className="flex min-h-12 items-center gap-2 rounded-2xl bg-bg-alt px-3 py-2 text-sm font-semibold text-heading">
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
