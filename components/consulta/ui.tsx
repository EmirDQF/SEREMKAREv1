import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const PANEL = "glass rounded-[1.75rem] p-5 shadow-soft sm:p-8";
export const LEGEND = "font-display text-h3 text-heading";
export const HINT = "mt-1 text-base text-muted";

interface OptionProps {
  selected?: boolean;
  onSelect: () => void;
  title: string;
  hint?: string;
  icon?: ReactNode;
  /**
   * action: respuesta de un toque que avanza (botón nativo).
   * checkbox: opción que se marca y desmarca dentro de una lista (role="checkbox").
   */
  mode?: "action" | "checkbox";
  tone?: "default" | "alert";
}

/** Opción grande táctil (mín. 56 px), accesible por teclado (Tab + Enter/Espacio). */
export function OptionButton({ selected = false, onSelect, title, hint, icon, mode = "action", tone = "default" }: OptionProps) {
  const isCheckbox = mode === "checkbox";
  return (
    <button
      type="button"
      role={isCheckbox ? "checkbox" : undefined}
      aria-checked={isCheckbox ? selected : undefined}
      onClick={onSelect}
      className={cn(
        "group flex min-h-14 w-full items-center gap-3 rounded-2xl border bg-card-solid px-4 py-3 text-left transition-[border-color,background-color,transform] duration-200 active:scale-[0.99]",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
        selected
          ? tone === "alert"
            ? "border-alert bg-alert-tint"
            : "border-primary bg-teal-tint"
          : "border-line hover:border-primary/60",
      )}
    >
      {icon ? <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-bg-alt text-primary [&_svg]:size-5">{icon}</span> : null}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-heading">{title}</span>
        {hint ? <span className="block text-sm text-muted">{hint}</span> : null}
      </span>
      {isCheckbox ? (
        <span
          aria-hidden
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-md border-2",
            selected ? (tone === "alert" ? "border-alert bg-alert" : "border-primary bg-primary") : "border-line-strong",
          )}
        >
          {selected ? <span className="size-2 rounded-sm bg-white" /> : null}
        </span>
      ) : (
        <ChevronRight aria-hidden className="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
      )}
    </button>
  );
}

/** Etiqueta «demo» visible siempre que los horarios o la cita no sean reales. */
export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-dashed border-amber-500/70 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-900 dark:bg-amber-500/10 dark:text-amber-200",
        className,
      )}
    >
      Modo demo
    </span>
  );
}
