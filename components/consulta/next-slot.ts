import { fetchSlots } from "@/components/consulta/slots-client";
import { formatLimaDateTime } from "@/lib/lima-format";

export interface NextSlot {
  /** «mar 14 de oct, 7:00 p. m.» o el texto alternativo si no hay horarios. */
  label: string;
  isDemo: boolean;
}

const NO_SLOTS_LABEL = "escríbenos por WhatsApp";

/**
 * Próximo horario de teleconsulta. Se importa con import() desde NextSlotChip cuando el navegador
 * está libre: la consulta, lib/slots y el formateo con Intl no entran al JS inicial.
 */
export async function loadNextSlot(doctorSlug: string, signal: AbortSignal): Promise<NextSlot | null> {
  const result = await fetchSlots(doctorSlug, "meet", signal);
  if (signal.aborted || result.status !== "ready") return null;
  const start = result.days[0]?.slots[0]?.start ?? null;
  return { label: start ? formatLimaDateTime(start) : NO_SLOTS_LABEL, isDemo: result.isDemo };
}
