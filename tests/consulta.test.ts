import { describe, expect, it } from "vitest";
import { REAL_DOCTOR_SLUG } from "@/data/doctors";
import { buildIcs, googleCalendarUrl } from "@/lib/calendar-links";
import {
  CONSULTA_STORAGE_KEY,
  INITIAL_STATE,
  canEnter,
  confirmationKey,
  parseConfirmation,
  parseState,
  serializeState,
  triageNotes,
  type ConsultaState,
} from "@/lib/consulta/state";
import { EMPTY_ANSWERS, triage } from "@/lib/triage/engine";

const EVENT = {
  title: "Teleconsulta con Dr. Daniel Ccolcca",
  start: "2026-10-06T14:00:00.000Z",
  end: "2026-10-06T14:30:00.000Z",
  details: "Ten a mano tus exámenes; buena luz, conexión estable.",
  location: "Google Meet",
};

describe("googleCalendarUrl", () => {
  it("builds the template link with UTC dates", () => {
    const url = new URL(googleCalendarUrl(EVENT));
    expect(url.origin + url.pathname).toBe("https://calendar.google.com/calendar/render");
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("dates")).toBe("20261006T140000Z/20261006T143000Z");
    expect(url.searchParams.get("text")).toBe(EVENT.title);
    expect(url.searchParams.get("ctz")).toBe("America/Lima");
  });
});

describe("buildIcs", () => {
  const ics = buildIcs({ ...EVENT, uid: "demo-123" }, new Date("2026-10-01T00:00:00Z"));

  it("is a valid VCALENDAR with CRLF line endings", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
    expect(ics).toContain("DTSTART:20261006T140000Z");
    expect(ics).toContain("DTEND:20261006T143000Z");
    expect(ics).toContain("UID:demo-123@sermekare");
  });

  it("escapes commas, semicolons and line breaks in text", () => {
    expect(ics).toContain("DESCRIPTION:Ten a mano tus exámenes\\; buena luz\\, conexión estable.");
  });

  it("adds a 1-hour reminder", () => {
    expect(ics).toContain("TRIGGER:-PT1H");
  });
});

describe("consulta state", () => {
  it("round-trips through sessionStorage JSON", () => {
    const state: ConsultaState = { ...INITIAL_STATE, step: "horario", doctorId: REAL_DOCTOR_SLUG, slotStart: "2026-10-06T14:00:00.000Z" };
    expect(parseState(serializeState(state))).toEqual(state);
  });

  it("ignores corrupted or foreign data", () => {
    expect(parseState("{not json")).toEqual(INITIAL_STATE);
    expect(parseState(JSON.stringify({ version: 99 }))).toEqual(INITIAL_STATE);
    expect(parseState(null)).toEqual(INITIAL_STATE);
  });

  it("never stores personal data fields", () => {
    const json = serializeState({ ...INITIAL_STATE, reason: "Dolor" });
    expect(json).not.toMatch(/fullName|document|email|phone/);
  });

  it("only lets the patient reach the calendar after the red-flag filter and without alarms", () => {
    expect(canEnter("horario", INITIAL_STATE)).toBe(false);
    const checked = { ...INITIAL_STATE, answers: { ...EMPTY_ANSWERS, redFlagsChecked: true }, skipped: true };
    expect(canEnter("horario", checked)).toBe(true);
    const alarm = { ...checked, answers: { ...checked.answers, redFlags: ["pecho" as const] } };
    expect(canEnter("horario", alarm)).toBe(false);
  });

  it("requires a slot before the patient form", () => {
    const ready = { ...INITIAL_STATE, answers: { ...EMPTY_ANSWERS, redFlagsChecked: true }, skipped: true, doctorId: REAL_DOCTOR_SLUG };
    expect(canEnter("datos", ready)).toBe(false);
    expect(canEnter("datos", { ...ready, slotStart: "2026-10-06T14:00:00.000Z" })).toBe(true);
  });

  it("uses a stable storage key", () => {
    expect(CONSULTA_STORAGE_KEY).toBe("sermekare:consulta");
    expect(confirmationKey("abc")).toBe("sermekare:cita:abc");
  });
});

describe("triageNotes", () => {
  it("summarizes the orientation for the doctor without diagnosing", () => {
    const result = triage({
      ...EMPTY_ANSWERS,
      redFlagsChecked: true,
      entry: { kind: "zone", zone: "rodillas" },
      duration: "gt3m",
      swelling: true,
      stiffness: "gt30",
      priorExams: true,
    });
    const notes = triageNotes(result);
    expect(notes).toMatch(/inflamaci/i);
    expect(notes).toMatch(/exámenes previos: sí/i);
    expect(notes).not.toMatch(/diagn[oó]stico/i);
  });
});

describe("parseConfirmation", () => {
  it("accepts a stored confirmation and rejects anything else", () => {
    const confirmation = {
      uid: "demo-1",
      doctorId: REAL_DOCTOR_SLUG,
      modality: "meet",
      start: "2026-10-06T14:00:00.000Z",
      end: "2026-10-06T14:30:00.000Z",
      status: "accepted",
      meetingUrl: null,
      rescheduleUrl: null,
      cancelUrl: null,
      isDemo: true,
    };
    expect(parseConfirmation(JSON.stringify(confirmation))).toEqual(confirmation);
    expect(parseConfirmation(JSON.stringify({ uid: 1 }))).toBeNull();
    expect(parseConfirmation(JSON.stringify({ ...confirmation, meetingUrl: "javascript:alert(1)" }))).toBeNull();
  });
});
