import type { ReactNode } from "react";
import { MapPin, ShieldCheck, Video } from "lucide-react";
import { DoctorPortrait } from "@/components/shared/DoctorPortrait";
import { REAL_DOCTOR_SLUG, getDoctor } from "@/data/doctors";
import { cn } from "@/lib/utils";

interface HeroBadgeProps {
  icon: ReactNode;
  title: string;
  text: string;
  className: string;
}

/** Tarjeta fija (sin parallax): no mueve el layout ni ejecuta JS. */
function HeroBadge({ icon, title, text, className }: HeroBadgeProps) {
  return (
    <span className={cn("glass absolute z-10 flex items-center gap-3 rounded-2xl px-3.5 py-2.5 shadow-lift", className)}>
      <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-xl bg-teal-tint text-primary [&_svg]:size-5">
        {icon}
      </span>
      <span>
        <span className="block font-display font-extrabold leading-tight text-heading">{title}</span>
        <span className="block text-sm text-muted">{text}</span>
      </span>
    </span>
  );
}

/**
 * Retrato del Dr. Daniel Ccolcca en el hero. Componente de servidor: sin parallax ni 3D, para que
 * la Home móvil no descargue three.js ni motion.
 */
export function HeroVisual() {
  const doctor = getDoctor(REAL_DOCTOR_SLUG);
  return (
    <figure className="relative mx-auto w-full max-w-[19rem] sm:max-w-[23rem] lg:max-w-[28rem]">
      <div
        aria-hidden
        className="absolute -inset-[6%] rounded-[46%_54%_52%_48%/50%_44%_56%_50%] bg-gradient-to-br from-teal/25 via-video-strong/10 to-navy-2/20"
      />
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-bg-alt shadow-lift">
        <DoctorPortrait
          doctor={doctor}
          fill
          priority
          sizes="(min-width: 1024px) 448px, (min-width: 640px) 368px, 304px"
        />
      </div>
      <HeroBadge
        icon={<MapPin strokeWidth={1.75} />}
        title="Todo el Perú"
        text="consulta virtual"
        className="-left-3 top-[8%] sm:-left-10"
      />
      <HeroBadge
        icon={<ShieldCheck strokeWidth={1.75} />}
        title="Ley 30421"
        text="Marco de Telesalud"
        className="-right-3 top-[38%] sm:-right-10"
      />
      <figcaption className="glass absolute inset-x-3 bottom-3 z-10 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lift">
        <Video aria-hidden strokeWidth={1.75} className="size-6 shrink-0 text-primary" />
        <span>
          <span className="block font-display font-bold leading-tight text-heading">{doctor.name}</span>
          <span className="block text-sm text-muted">{doctor.title} · por videollamada</span>
        </span>
      </figcaption>
    </figure>
  );
}
