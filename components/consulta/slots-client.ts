"use client";

import { useEffect, useState } from "react";
import type { BookingModality, SlotDay } from "@/lib/booking-provider/types";
import { addDaysISO } from "@/lib/slots";
import { limaToday } from "@/lib/lima-format";

export const DAYS_AHEAD = 14;

export type SlotsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; days: readonly SlotDay[]; isDemo: boolean };

interface SlotsResponse {
  ok: boolean;
  data?: { days: SlotDay[]; isDemo: boolean };
  error?: { message: string };
}

export async function fetchSlots(doctorId: string, modality: BookingModality, signal?: AbortSignal): Promise<SlotsState> {
  const from = limaToday();
  const params = new URLSearchParams({ doctorId, modality, from, to: addDaysISO(from, DAYS_AHEAD) });
  try {
    const response = await fetch(`/api/booking/slots?${params}`, { signal, cache: "no-store" });
    const body = (await response.json()) as SlotsResponse;
    if (!body.ok || !body.data) return { status: "error", message: body.error?.message ?? "No pudimos cargar los horarios." };
    return { status: "ready", days: body.data.days, isDemo: body.data.isDemo };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return { status: "loading" };
    return { status: "error", message: "No pudimos cargar los horarios. Revisa tu conexión e intenta de nuevo." };
  }
}

/** Horarios de un médico (se recargan al cambiar de médico o al pedir `reloadKey`). */
export function useSlots(doctorId: string | null, modality: BookingModality, reloadKey = 0): SlotsState {
  const [state, setState] = useState<SlotsState>({ status: "loading" });

  useEffect(() => {
    if (!doctorId) return;
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reinicia el estado al cambiar de médico
    setState({ status: "loading" });
    fetchSlots(doctorId, modality, controller.signal).then((next) => {
      if (!controller.signal.aborted) setState(next);
    });
    return () => controller.abort();
  }, [doctorId, modality, reloadKey]);

  return state;
}
