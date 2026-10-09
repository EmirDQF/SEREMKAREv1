"use client";

import { lazy, useEffect, useState, type ReactNode } from "react";
import { LazyOnView } from "@/components/shared/LazyOnView";
import { TRIAGE_KIND_ATTRIBUTE, readTriageTarget, requestTriage, type TriageTarget } from "@/lib/triage-events";

/** El triage «¿Dónde te duele?» (pestañas, mapa corporal, holograma 3D) viaja en su propio chunk. */
const SymptomTriage = lazy(() => import("@/components/sections/SymptomTriage").then((mod) => ({ default: mod.SymptomTriage })));

interface SymptomTriageLazyProps {
  /** Versión estática de la sección (servidor): se ve hasta que el triage carga y sin JS. */
  fallback: ReactNode;
}

/**
 * Carga el triage al acercarse a la pantalla o al tocar una frase de «¿Te identificas?»
 * (enlaces con data-triage-kind/value), que además preselecciona la zona o condición.
 */
export function SymptomTriageLazy({ fallback }: SymptomTriageLazyProps) {
  const [initialTarget, setInitialTarget] = useState<TriageTarget | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest(`[${TRIAGE_KIND_ATTRIBUTE}]`) : null;
      const target = link ? readTriageTarget(link) : null;
      if (!target) return;
      setInitialTarget(target); // si el triage aún no cargó, nace con esta selección
      requestTriage(target); // si ya cargó, la actualiza
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <LazyOnView fallback={fallback} force={initialTarget !== null}>
      <SymptomTriage initialTarget={initialTarget} />
    </LazyOnView>
  );
}
