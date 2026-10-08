import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const PANEL = "glass rounded-[1.75rem] p-5 shadow-soft sm:p-8";
export const LEGEND = "font-display text-h3 text-heading";
export const HINT = "mt-1 text-[0.95rem] text-muted";

interface OptionProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  hint?: string;
  icon?: ReactNode;
  /** checkbox (varias) o radio (una). */
  role?: "radio" | "checkbox";
  tone?: "default" | "alert";
}

/**
 * Opción grande táctil (mín. 56 px), accesible por teclado: botón con aria-checked.
 * Usada en cada pregunta del asistente.
 */
export function OptionButton({ selected, onSelect, title, hint, icon, role = "radio", tone = "default" }: OptionProps) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex min-h-14 w-full items-center gap-3 rounded-2xl border bg-card-solid px-4 py-3 text-left transition-[border-color,background-color,transform] duration-200 active:scale-[0.99]",
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
      <span
        aria-hidden
        className={cn(
          "grid size-6 shrink-0 place-items-center border-2",
          role === "radio" ? "rounded-full" : "rounded-md",
          selected ? (tone === "alert" ? "border-alert bg-alert" : "border-primary bg-primary") : "border-line-strong",
        )}
      >
        {selected ? <span className={cn("size-2 bg-white", role === "radio" ? "rounded-full" : "rounded-sm")} /> : null}
      </span>
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
