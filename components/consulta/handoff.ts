"use client";

import { CONSULTA_STORAGE_KEY, INITIAL_STATE, serializeState } from "@/lib/consulta/state";
import { EMPTY_ANSWERS, type TriageEntry } from "@/lib/triage/engine";

export const CONSULTA_PATH = "/consulta-virtual";

/**
 * Precarga el consultorio con la zona o condición elegida en la Home (vía sessionStorage, nunca en
 * la URL). El filtro de señales de alarma se sigue preguntando primero.
 */
export function prefillConsulta(entry: TriageEntry): void {
  try {
    window.sessionStorage.setItem(
      CONSULTA_STORAGE_KEY,
      serializeState({ ...INITIAL_STATE, answers: { ...EMPTY_ANSWERS, entry } }),
    );
  } catch {
    // Sin almacenamiento: el consultorio empieza desde cero.
  }
}
