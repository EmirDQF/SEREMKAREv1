"use client";

import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { fetchSlots } from "@/components/consulta/slots-client";
import { REAL_DOCTOR_SLUG } from "@/data/doctors";
import { formatLimaDateTime } from "@/lib/lima-format";
import { cn } from "@/lib/utils";

const IDLE_TIMEOUT_MS = 3000;
const FALLBACK_DELAY_MS = 1500;

type ChipState = { status: "idle" } | { status: "ready"; start: string | null; isDemo: boolean };

/**
 * «Próximo horario disponible» en vivo. Se consulta cuando el navegador está libre (no compite
 * con el LCP) y, si los horarios son de demostración, lo dice.
 */
export function NextSlotChip({ className }: { className?: string }) {
  const [state, setState] = useState<ChipState>({ status: "idle" });

  useEffect(() => {
    const controller = new AbortController();
    const run = () =>
      fetchSlots(REAL_DOCTOR_SLUG, "meet", controller.signal).then((result) => {
        if (controller.signal.aborted || result.status !== "ready") return;
        setState({ status: "ready", start: result.days[0]?.slots[0]?.start ?? null, isDemo: result.isDemo });
      });
    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle ? window.requestIdleCallback(run, { timeout: IDLE_TIMEOUT_MS }) : window.setTimeout(run, FALLBACK_DELAY_MS);
    return () => {
      controller.abort();
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  return (
    <p
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-card-solid/80 px-4 py-2 text-sm text-heading shadow-soft",
        className,
      )}
      aria-live="polite"
    >
      <span aria-hidden className="online-dot" />
      <CalendarClock aria-hidden className="size-4 text-primary" />
      <span>
        <span className="font-semibold">Próximo horario disponible:</span>{" "}
        {state.status === "idle" ? "consultando…" : state.start ? formatLimaDateTime(state.start) : "escríbenos por WhatsApp"}
        {state.status === "ready" && state.isDemo ? <span className="ml-1 font-bold uppercase text-amber-800 dark:text-amber-200">(demo)</span> : null}
      </span>
    </p>
  );
}
