import { Phone, Siren } from "lucide-react";
import { EMERGENCY } from "@/data/teleconsult";
import { cn } from "@/lib/utils";

interface EmergencyNoticeProps {
  /** Id enfocable (el asistente lo enfoca al intentar continuar). */
  id?: string;
  className?: string;
}

/**
 * Aviso de señales de alarma (D9): bloquea la teleconsulta. No hay opción de «agendar igual»:
 * el paciente debe acudir a emergencias o llamar al SAMU 106.
 */
export function EmergencyNotice({ id, className }: EmergencyNoticeProps) {
  return (
    <div
      id={id}
      tabIndex={-1}
      className={cn("rounded-2xl border border-alert bg-alert-tint p-4 text-alert-strong focus:outline-none focus-visible:outline-3", className)}
    >
      <p role="alert" className="flex items-start gap-2 font-display font-semibold">
        <Siren aria-hidden strokeWidth={1.75} className="mt-0.5 size-5 shrink-0 text-alert" />
        <span>
          {EMERGENCY.notice} {EMERGENCY.action}
        </span>
      </p>
      <a
        href={`tel:${EMERGENCY.phone}`}
        className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-full border border-alert px-5 font-semibold hover:bg-alert-tint"
      >
        <Phone aria-hidden strokeWidth={1.75} className="size-4" /> Llamar al SAMU {EMERGENCY.phone}
      </a>
    </div>
  );
}
