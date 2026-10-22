import { isDemoSchedule } from "@/data/teleconsult";
import { describeBlock } from "@/lib/booking";
import type { Doctor } from "@/types/medical";
import { cn } from "@/lib/utils";

/**
 * Horario del médico. Mientras el horario real no esté confirmado, NO muestra la franja de la
 * agenda demo como si fuera real: dice «Horario por confirmar» y que los turnos se ven al reservar.
 */
export function DoctorHours({ doctor, className }: { doctor: Doctor; className?: string }) {
  if (isDemoSchedule) {
    return (
      <p className={cn("text-base text-fg", className)}>
        <span className="font-semibold text-heading">Horario por confirmar.</span> Al reservar en línea ves los horarios disponibles.
      </p>
    );
  }
  return (
    <ul className={cn("space-y-2 text-base text-fg", className)}>
      {doctor.schedule.map(describeBlock).map((block) => (
        <li key={block.key}>
          <span className="font-semibold text-heading">{block.days}</span>
          <br />
          {block.hours} · {block.modalities}
        </li>
      ))}
    </ul>
  );
}
