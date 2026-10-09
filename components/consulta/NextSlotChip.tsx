"use client";

import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { cx } from "@/lib/cx";

const IDLE_TIMEOUT_MS = 3000;
const FALLBACK_DELAY_MS = 1500;

type ChipState = { status: "idle" } | { status: "ready"; label: string; isDemo: boolean };

/**
 * «Próximo horario disponible» en vivo. La consulta y el formateo (next-slot.ts) se descargan con
 * import() cuando el navegador está libre: no compiten con el LCP ni suman al JS inicial. Si los
 * horarios son de demostración, lo dice.
 */
interface NextSlotChipProps {
  /** Slug del médico (se pasa desde el servidor: así data/doctors no viaja al navegador). */
  doctorSlug: string;
  className?: string;
}

export function NextSlotChip({ doctorSlug, className }: NextSlotChipProps) {
  const [state, setState] = useState<ChipState>({ status: "idle" });

  useEffect(() => {
    const controller = new AbortController();
    const run = () =>
      import("@/components/consulta/next-slot")
        .then(({ loadNextSlot }) => loadNextSlot(doctorSlug, controller.signal))
        .then((slot) => {
          if (slot && !controller.signal.aborted) setState({ status: "ready", ...slot });
        })
        .catch(() => {
          // Sin conexión o chunk no disponible: el chip se queda en «consultando…» (no bloquea nada).
        });
    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle ? window.requestIdleCallback(run, { timeout: IDLE_TIMEOUT_MS }) : window.setTimeout(run, FALLBACK_DELAY_MS);
    return () => {
      controller.abort();
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [doctorSlug]);

  return (
    <p
      className={cx(
        "inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-card-solid/80 px-4 py-2 text-sm text-heading shadow-soft",
        className,
      )}
      aria-live="polite"
    >
      <span aria-hidden className="online-dot" />
      <CalendarClock aria-hidden className="size-4 text-primary" />
      <span>
        <span className="font-semibold">Próximo horario disponible:</span>{" "}
        {state.status === "idle" ? "consultando…" : state.label}
        {state.status === "ready" && state.isDemo ? <span className="ml-1 font-bold uppercase text-amber-800 dark:text-amber-200">(demo)</span> : null}
      </span>
    </p>
  );
}
