"use client";

import type { ReactNode } from "react";
import { useOpenStatus } from "@/lib/use-open-status";

/**
 * «Abierto ahora / Cerrado» en vivo (hora de Lima). Solo se monta cuando el horario de la sede está
 * confirmado; mientras tanto la TopBar muestra un texto fijo y no carga este JS.
 */
export function OpenStatusLine({ fallback }: { fallback: ReactNode }) {
  const status = useOpenStatus();
  if (!status) return fallback;
  return (
    <span className="inline-flex min-w-0 items-center gap-2" aria-live="polite">
      <span aria-hidden className={status.isOpen ? "online-dot" : "offline-dot"} />
      <span className="truncate">
        <strong className="font-semibold text-white">{status.headline}</strong>
        <span className="hidden sm:inline"> · {status.detail}</span>
      </span>
    </span>
  );
}
