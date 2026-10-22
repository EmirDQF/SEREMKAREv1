import { allDoctors } from "@/data/doctors";
import { createCalcomProvider, type EventTypeLookup } from "@/lib/booking-provider/calcom";
import { createDemoProvider } from "@/lib/booking-provider/demo";
import type { BookingModality, BookingProvider } from "@/lib/booking-provider/types";

/**
 * Variables de entorno que usa el adaptador (solo servidor: nunca con NEXT_PUBLIC_):
 * BOOKING_PROVIDER, CALCOM_API_KEY, CALCOM_API_URL, CALCOM_WEB_URL.
 */
export type BookingEnv = Readonly<Record<string, string | undefined>>;

const DEFAULT_CALCOM_API_URL = "https://api.cal.com/v2";
const DEFAULT_CALCOM_WEB_URL = "https://cal.com";

/** «calcom», aunque en el panel se escriba con mayúsculas o espacios («Calcom », «CALCOM»). */
const wantsCalcomProvider = (env: BookingEnv): boolean => env.BOOKING_PROVIDER?.trim().toLowerCase() === "calcom";

/** ID del tipo de evento de Cal.com según data/doctors.ts (null = sin configurar). */
export const eventTypeFromData: EventTypeLookup = (doctorId, modality) => {
  const doctor = allDoctors.find((d) => d.slug === doctorId);
  return doctor?.booking.calEventTypeIds[modality] ?? null;
};

const demoProvider = createDemoProvider();

/**
 * Proveedor para un médico y una modalidad. Cal.com solo si está elegido, hay API key y el
 * médico tiene su tipo de evento; en cualquier otro caso, modo demo (nunca se rompe la web).
 */
export function resolveProvider(
  env: BookingEnv,
  doctorId: string,
  modality: BookingModality,
  lookup: EventTypeLookup = eventTypeFromData,
): BookingProvider {
  const wantsCalcom = wantsCalcomProvider(env);
  const apiKey = env.CALCOM_API_KEY?.trim();
  if (!wantsCalcom || !apiKey || lookup(doctorId, modality) === null) return demoProvider;
  return createCalcomProvider(
    {
      apiKey,
      apiUrl: env.CALCOM_API_URL?.trim() || DEFAULT_CALCOM_API_URL,
      webUrl: env.CALCOM_WEB_URL?.trim() || DEFAULT_CALCOM_WEB_URL,
    },
    lookup,
  );
}

/** Proveedor para buscar una cita por uid: demo si el uid es de demo; si no, Cal.com si está configurado. */
export function resolveProviderForUid(env: BookingEnv, uid: string): BookingProvider {
  if (uid.startsWith("demo-") || !wantsCalcomProvider(env) || !env.CALCOM_API_KEY?.trim()) return demoProvider;
  return createCalcomProvider(
    {
      apiKey: env.CALCOM_API_KEY.trim(),
      apiUrl: env.CALCOM_API_URL?.trim() || DEFAULT_CALCOM_API_URL,
      webUrl: env.CALCOM_WEB_URL?.trim() || DEFAULT_CALCOM_WEB_URL,
    },
    eventTypeFromData,
  );
}
