"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CONSULTA_STORAGE_KEY,
  INITIAL_STATE,
  STEP_ORDER,
  canEnter,
  parseState,
  serializeState,
  type ConsultaState,
  type ConsultaStep,
} from "@/lib/consulta/state";

function readStorage(): ConsultaState {
  try {
    return parseState(window.sessionStorage.getItem(CONSULTA_STORAGE_KEY));
  } catch {
    return INITIAL_STATE;
  }
}

function writeStorage(state: ConsultaState): void {
  try {
    window.sessionStorage.setItem(CONSULTA_STORAGE_KEY, serializeState(state));
  } catch {
    // Modo privado o almacenamiento bloqueado: el flujo sigue funcionando sin persistir.
  }
}

/** Primer paso al que se puede volver con este estado (nunca salta el filtro de alarmas). */
function reachableStep(state: ConsultaState): ConsultaStep {
  const index = STEP_ORDER.indexOf(state.step);
  for (let i = index; i > 0; i -= 1) {
    if (canEnter(STEP_ORDER[i], state)) return STEP_ORDER[i];
  }
  return "evaluacion";
}

/**
 * Estado del consultorio conservado en sessionStorage. Hasta hidratar se usa el estado inicial
 * (igual en servidor y cliente), así no hay errores de hidratación.
 */
export function useConsultaState(initial: Partial<ConsultaState> = {}) {
  const [state, setState] = useState<ConsultaState>({ ...INITIAL_STATE, ...initial });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStorage();
    const merged = stored === INITIAL_STATE ? { ...INITIAL_STATE, ...initial } : stored;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura única de sessionStorage tras montar
    setState({ ...merged, step: reachableStep(merged) });
    setHydrated(true);
    // Solo al montar: `initial` viene de la URL del primer render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hydrated) writeStorage(state);
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<ConsultaState>) => setState((current) => ({ ...current, ...patch })), []);

  const goTo = useCallback((step: ConsultaStep) => {
    setState((current) => (canEnter(step, current) ? { ...current, step } : current));
  }, []);

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  return { state, hydrated, update, goTo, reset };
}
