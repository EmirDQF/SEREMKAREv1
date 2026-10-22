import { afterEach, describe, expect, it, vi } from "vitest";
import { REAL_DOCTOR_SLUG } from "@/data/doctors";
import { createCalcomProvider } from "@/lib/booking-provider/calcom";
import { createDemoProvider } from "@/lib/booking-provider/demo";
import { resolveProvider } from "@/lib/booking-provider";
import type { BookingInput } from "@/lib/booking-provider/types";
import { isoToLimaSlot, limaSlotToISO } from "@/lib/slots";

// 2026-10-05 es lunes. Lima es UTC-5 todo el año.
const NOW = new Date("2026-10-05T08:00:00-05:00");

const patient = {
  fullName: "Paciente de Prueba",
  document: "12345678",
  phone: "51987654321",
  email: "paciente@example.com",
  forWhom: "mi" as const,
};

describe("limaSlotToISO / isoToLimaSlot", () => {
  it("converts Lima wall time to UTC and back", () => {
    expect(limaSlotToISO("2026-10-05", 9 * 60 + 30)).toBe("2026-10-05T14:30:00.000Z");
    expect(isoToLimaSlot("2026-10-05T14:30:00.000Z")).toEqual({ date: "2026-10-05", minutes: 570 });
  });

  it("handles times that cross midnight in UTC", () => {
    expect(limaSlotToISO("2026-10-05", 21 * 60)).toBe("2026-10-06T02:00:00.000Z");
    expect(isoToLimaSlot("2026-10-06T02:00:00.000Z")).toEqual({ date: "2026-10-05", minutes: 1260 });
  });
});

describe("demo provider", () => {
  const demo = createDemoProvider({ now: () => NOW });

  it("returns deterministic slots per day, only on working days", async () => {
    const first = await demo.getSlots({ doctorId: REAL_DOCTOR_SLUG, modality: "meet", from: "2026-10-05", to: "2026-10-11" });
    const second = await demo.getSlots({ doctorId: REAL_DOCTOR_SLUG, modality: "meet", from: "2026-10-05", to: "2026-10-11" });
    expect(first).toEqual(second);
    if (!first.ok) throw new Error("expected slots");
    const dates = first.data.map((day) => day.date);
    expect(dates).not.toContain("2026-10-11"); // domingo
    expect(first.data.some((day) => day.slots.length > 0)).toBe(true);
  });

  it("never offers past times or times inside the minimum lead", async () => {
    const result = await demo.getSlots({ doctorId: REAL_DOCTOR_SLUG, modality: "meet", from: "2026-10-05", to: "2026-10-05" });
    if (!result.ok) throw new Error("expected slots");
    for (const slot of result.data.flatMap((day) => day.slots)) {
      expect(Date.parse(slot.start)).toBeGreaterThan(NOW.getTime());
    }
  });

  it("rejects unknown doctors and oversized ranges", async () => {
    expect((await demo.getSlots({ doctorId: "no-existe", modality: "meet", from: "2026-10-05", to: "2026-10-06" })).ok).toBe(false);
    const wide = await demo.getSlots({ doctorId: REAL_DOCTOR_SLUG, modality: "meet", from: "2026-10-05", to: "2027-01-05" });
    expect(wide).toMatchObject({ ok: false, error: { code: "validation" } });
  });

  it("books an offered slot and labels it as demo, without a fake Meet link", async () => {
    const slots = await demo.getSlots({ doctorId: REAL_DOCTOR_SLUG, modality: "meet", from: "2026-10-06", to: "2026-10-06" });
    if (!slots.ok) throw new Error("expected slots");
    const start = slots.data[0].slots[0].start;
    const input: BookingInput = { doctorId: REAL_DOCTOR_SLUG, modality: "meet", start, patient, reason: "Dolor de rodilla", triageSummary: null };
    const booking = await demo.createBooking(input);
    expect(booking).toMatchObject({ ok: true, data: { isDemo: true, meetingUrl: null, status: "accepted", start } });
    if (booking.ok) expect(booking.data.uid).toMatch(/^demo-/);
  });

  it("refuses a slot that is not offered", async () => {
    const input: BookingInput = {
      doctorId: REAL_DOCTOR_SLUG,
      modality: "meet",
      start: limaSlotToISO("2026-10-11", 10 * 60), // domingo
      patient,
      reason: "Dolor",
      triageSummary: null,
    };
    expect(await demo.createBooking(input)).toMatchObject({ ok: false, error: { code: "slot_unavailable" } });
  });
});

describe("calcom provider", () => {
  afterEach(() => vi.unstubAllGlobals());

  const config = { apiKey: "cal_test_key", apiUrl: "https://api.cal.com/v2", webUrl: "https://cal.com" };
  const eventTypeIdFor = () => 4242;

  it("calls /v2/slots with the documented headers and maps the response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        status: "success",
        data: { "2026-10-06": [{ start: "2026-10-06T09:00:00.000-05:00", end: "2026-10-06T09:30:00.000-05:00" }] },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const provider = createCalcomProvider(config, eventTypeIdFor);
    const result = await provider.getSlots({ doctorId: REAL_DOCTOR_SLUG, modality: "meet", from: "2026-10-06", to: "2026-10-06" });

    expect(result).toEqual({ ok: true, data: [{ date: "2026-10-06", slots: [{ start: "2026-10-06T14:00:00.000Z" }] }] });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("https://api.cal.com/v2/slots?");
    expect(String(url)).toContain("eventTypeId=4242");
    expect(init.headers["cal-api-version"]).toBe("2024-09-04");
    expect(init.headers.Authorization).toBe("Bearer cal_test_key");
  });

  it("creates a booking with the patient as attendee and the notes, and maps uid and Meet link", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json(
        {
          status: "success",
          data: {
            uid: "abc123",
            start: "2026-10-06T14:00:00.000Z",
            end: "2026-10-06T14:30:00.000Z",
            location: "https://meet.google.com/xyz-abcd-efg",
            status: "accepted",
          },
        },
        { status: 201 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const provider = createCalcomProvider(config, eventTypeIdFor);
    const result = await provider.createBooking({
      doctorId: REAL_DOCTOR_SLUG,
      modality: "meet",
      start: "2026-10-06T14:00:00.000Z",
      patient,
      reason: "Dolor de rodilla",
      triageSummary: "Orientación: desgaste",
    });

    expect(result).toMatchObject({
      ok: true,
      data: { uid: "abc123", meetingUrl: "https://meet.google.com/xyz-abcd-efg", isDemo: false, rescheduleUrl: "https://cal.com/reschedule/abc123" },
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("https://api.cal.com/v2/bookings");
    expect(init.headers["cal-api-version"]).toBe("2026-02-25");
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({ eventTypeId: 4242, start: "2026-10-06T14:00:00.000Z" });
    expect(body.attendee).toMatchObject({ name: patient.fullName, email: patient.email, timeZone: "America/Lima", phoneNumber: "+51987654321" });
    expect(body.bookingFieldsResponses.notes).toContain("Dolor de rodilla");
  });

  it("maps provider failures to a safe Spanish message without leaking details", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ status: "error", error: { message: "internal stack" } }, { status: 500 })));
    const provider = createCalcomProvider(config, eventTypeIdFor);
    const result = await provider.getSlots({ doctorId: REAL_DOCTOR_SLUG, modality: "meet", from: "2026-10-06", to: "2026-10-06" });
    expect(result).toMatchObject({ ok: false, error: { code: "provider_error" } });
    if (!result.ok) expect(result.error.message).not.toMatch(/stack/);
  });

  it("returns a friendly error (no crash) when Cal.com is unreachable — no internet or timeout", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    const provider = createCalcomProvider(config, eventTypeIdFor);
    const result = await provider.getSlots({ doctorId: REAL_DOCTOR_SLUG, modality: "meet", from: "2026-10-06", to: "2026-10-06" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toMatch(/[a-záéíóúñ]/i);
  });

  it("maps a taken slot (409) to slot_unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ status: "error" }, { status: 409 })));
    const provider = createCalcomProvider(config, eventTypeIdFor);
    const result = await provider.createBooking({
      doctorId: REAL_DOCTOR_SLUG,
      modality: "meet",
      start: "2026-10-06T14:00:00.000Z",
      patient,
      reason: "x",
      triageSummary: null,
    });
    expect(result).toMatchObject({ ok: false, error: { code: "slot_unavailable" } });
  });
});

describe("resolveProvider", () => {
  it("uses demo by default", () => {
    expect(resolveProvider({}, REAL_DOCTOR_SLUG, "meet").id).toBe("demo");
  });

  it("falls back to demo when Cal.com is selected but the key or event type is missing", () => {
    expect(resolveProvider({ BOOKING_PROVIDER: "calcom" }, REAL_DOCTOR_SLUG, "meet").id).toBe("demo");
    expect(resolveProvider({ BOOKING_PROVIDER: "calcom", CALCOM_API_KEY: "cal_x" }, REAL_DOCTOR_SLUG, "meet").id).toBe("demo");
  });

  it("uses Cal.com when the key and the doctor's event type exist", () => {
    const env = { BOOKING_PROVIDER: "calcom", CALCOM_API_KEY: "cal_x" };
    expect(resolveProvider(env, REAL_DOCTOR_SLUG, "meet", () => 99).id).toBe("calcom");
  });

  it("tolerates case and spaces in BOOKING_PROVIDER, and stays in demo with an unknown value", () => {
    expect(resolveProvider({ BOOKING_PROVIDER: " Calcom ", CALCOM_API_KEY: "cal_x" }, REAL_DOCTOR_SLUG, "meet", () => 99).id).toBe("calcom");
    expect(resolveProvider({ BOOKING_PROVIDER: "calcomm", CALCOM_API_KEY: "cal_x" }, REAL_DOCTOR_SLUG, "meet", () => 99).id).toBe("demo");
  });
});
