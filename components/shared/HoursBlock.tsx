import { Clock } from "lucide-react";
import { OPENING_SCHEDULE } from "@/data/site";
import { cn } from "@/lib/utils";

interface HoursBlockProps {
  className?: string;
  /** id del título (para aria-labelledby cuando se usa como sección). */
  id?: string;
}

/**
 * Horario general del centro (data/site.ts → OPENING_SCHEDULE).
 * CONFIRMAR: horario por sede; mientras tanto se invita a confirmarlo por WhatsApp.
 */
export function HoursBlock({ className, id = "horario-title" }: HoursBlockProps) {
  return (
    <div className={cn("rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft", className)}>
      <h2 id={id} className="flex items-center gap-2.5 font-display text-xl font-bold text-heading">
        <Clock aria-hidden strokeWidth={1.75} className="size-6 text-primary" /> Horario de atención
      </h2>
      <dl className="mt-4 grid gap-2">
        {OPENING_SCHEDULE.map((row) => (
          <div key={row.days} className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-line pb-2 last:border-b-0">
            <dt className="text-[1.0625rem] text-muted">{row.days}</dt>
            <dd className="font-display text-lg font-bold tabular-nums text-heading">{row.hours}</dd>
          </div>
        ))}
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <dt className="text-[1.0625rem] text-muted">Domingos y feriados</dt>
          <dd className="font-semibold text-muted">Por confirmar</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-muted">Atención con cita previa. Confirma el horario de tu sede por WhatsApp.</p>
    </div>
  );
}
