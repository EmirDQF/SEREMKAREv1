import type { BookingPrefill, PainPoint } from "@/types/medical";

export const TRIAGE_EVENT = "sermekare:triage";
export const TRIAGE_SECTION_ID = "donde-te-duele";
export const BOOKING_EVENT = "sermekare:booking";
export const BOOKING_SECTION_ID = "agendar";

export type TriageTarget = PainPoint["target"];

/** Pide al triage "¿Dónde te duele?" que preseleccione una zona o condición. */
export function requestTriage(target: TriageTarget): void {
  window.dispatchEvent(new CustomEvent<TriageTarget>(TRIAGE_EVENT, { detail: target }));
}

/** Pide al agendador que precargue el paso 1 (molestia y, si encaja, el doctor recomendado). */
export function requestBooking(prefill: BookingPrefill): void {
  window.dispatchEvent(new CustomEvent<BookingPrefill>(BOOKING_EVENT, { detail: prefill }));
}

/** Atributos de los enlaces de «¿Te identificas?» (servidor) que preseleccionan el triage (cliente). */
export const TRIAGE_KIND_ATTRIBUTE = "data-triage-kind";
const TRIAGE_VALUE_ATTRIBUTE = "data-triage-value";

/** { "data-triage-kind": "zone", "data-triage-value": "rodillas" } */
export function triageTargetAttributes(target: TriageTarget): Record<string, string> {
  return {
    [TRIAGE_KIND_ATTRIBUTE]: target.kind,
    [TRIAGE_VALUE_ATTRIBUTE]: target.kind === "zone" ? target.zone : target.slug,
  };
}

/** Lee el destino del triage desde esos atributos; null si faltan o no son válidos. */
export function readTriageTarget(element: Element): TriageTarget | null {
  const kind = element.getAttribute(TRIAGE_KIND_ATTRIBUTE);
  const value = element.getAttribute(TRIAGE_VALUE_ATTRIBUTE);
  if (!value) return null;
  if (kind === "zone") return { kind, zone: value as Extract<TriageTarget, { kind: "zone" }>["zone"] };
  if (kind === "condition") return { kind, slug: value as Extract<TriageTarget, { kind: "condition" }>["slug"] };
  return null;
}
