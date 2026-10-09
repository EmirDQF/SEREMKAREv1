"use client";

import { setMotionPreference, useMotionPreferenceValue, useReducedMotionPreference } from "@/lib/motion-preference";
import { cx } from "@/lib/cx";

/**
 * Interruptor "Reducir animaciones" (se guarda en localStorage). Tiene el mismo efecto que
 * prefers-reduced-motion: sin smooth scroll, sin animaciones de entrada y 3D en pose estática.
 */
export function MotionToggle() {
  const preference = useMotionPreferenceValue();
  const reduced = useReducedMotionPreference() === true;
  const forcedBySystem = reduced && preference !== "reduce";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={reduced}
      disabled={forcedBySystem}
      onClick={() => setMotionPreference(reduced ? "auto" : "reduce")}
      className="inline-flex min-h-12 items-center gap-3 rounded-full text-left text-slate-300 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-80"
    >
      <span
        aria-hidden
        className={cx(
          "relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200",
          reduced ? "border-teal bg-teal" : "border-white/25 bg-white/10",
        )}
      >
        <span
          className={cx(
            "absolute left-0.5 top-0.5 size-[1.125rem] rounded-full bg-white shadow-soft transition-transform duration-200",
            reduced && "translate-x-5",
          )}
        />
      </span>
      <span>
        Reducir animaciones
        {forcedBySystem ? <span className="block text-sm text-slate-400">Activado por tu sistema</span> : null}
      </span>
    </button>
  );
}
