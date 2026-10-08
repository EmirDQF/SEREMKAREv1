import { Check } from "lucide-react";
import type { ConsultaStep } from "@/lib/consulta/state";
import { STEP_ORDER } from "@/lib/consulta/state";
import { cn } from "@/lib/utils";

const LABELS: Readonly<Record<ConsultaStep, string>> = {
  evaluacion: "Evaluación",
  orientacion: "Orientación",
  horario: "Horario",
  datos: "Tus datos",
};

/** Barra de pasos del consultorio. El paso «Confirmar» es la pantalla /cita-confirmada. */
export function StepBar({ current }: { current: ConsultaStep }) {
  const currentIndex = STEP_ORDER.indexOf(current);
  return (
    <nav aria-label="Pasos de tu consulta" className="w-full">
      <ol className="grid grid-cols-4 gap-2">
        {STEP_ORDER.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li key={step} aria-current={active ? "step" : undefined} className="min-w-0">
              <span
                aria-hidden
                className={cn(
                  "block h-1.5 rounded-full transition-colors duration-500",
                  done || active ? "bg-gradient-to-r from-coral to-teal" : "bg-line",
                )}
              />
              <span className={cn("mt-2 flex items-center gap-1 text-xs font-semibold sm:text-sm", active ? "text-heading" : "text-muted")}>
                {done ? <Check aria-hidden className="size-3.5 shrink-0 text-primary" /> : null}
                <span className="truncate">{LABELS[step]}</span>
                {done ? <span className="sr-only"> (completado)</span> : null}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
