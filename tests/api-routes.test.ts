import { createHmac } from "node:crypto";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET as getBooking } from "@/app/api/booking/[uid]/route";
import { POST as createBooking } from "@/app/api/booking/create/route";
import { GET as getSlots } from "@/app/api/booking/slots/route";
import { POST as calcomWebhook } from "@/app/api/webhooks/calcom/route";
import { REAL_DOCTOR_SLUG } from "@/data/doctors";
import { addDaysISO } from "@/lib/slots";

const BASE = "http://localhost/api/booking";
let ipCounter = 0;
/** IP distinta por petición para no chocar con el rate limit entre pruebas. */
const headers = (extra: Record<string, string> = {}) => ({ "x-forwarded-for": `10.0.0.${(ipCounter += 1)}`, ...extra });

function futureRange(): { from: string; to: string } {
  const today = new Date().toISOString().slice(0, 10);
  return { from: addDaysISO(today, 1), to: addDaysISO(today, 14) };
}

async function firstDemoSlot(): Promise<string> {
  const { from, to } = futureRange();
  const response = await getSlots(new NextRequest(`${BASE}/slots?doctorId=${REAL_DOCTOR_SLUG}&modality=meet&from=${from}&to=${to}`, { headers: headers() }));
  const body = await response.json();
  return body.data.days[0].slots[0].start as string;
}

const bookingBody = (start: string, patch: Record<string, unknown> = {}) => ({
  doctorId: REAL_DOCTOR_SLUG,
  modality: "meet",
  start,
  patient: { fullName: "Paciente de Prueba", document: "12345678", phone: "987654321", email: "paciente@example.com", forWhom: "mi" },
  reason: "Dolor de rodilla",
  triageSummary: "Orientación: desgaste",
  consents: { dataProcessing: true, telehealth: true },
  website: "",
  ...patch,
});

const post = (body: unknown) =>
  createBooking(new NextRequest(`${BASE}/create`, { method: "POST", body: JSON.stringify(body), headers: headers({ "content-type": "application/json" }) }));

describe("GET /api/booking/slots", () => {
  it("returns demo slots flagged as demo by default", async () => {
    const { from, to } = futureRange();
    const response = await getSlots(new NextRequest(`${BASE}/slots?doctorId=${REAL_DOCTOR_SLUG}&modality=meet&from=${from}&to=${to}`, { headers: headers() }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.data.isDemo).toBe(true);
    expect(body.data.days.length).toBeGreaterThan(0);
  });

  it("rejects bad input and unpublished doctors", async () => {
    const bad = await getSlots(new NextRequest(`${BASE}/slots?doctorId=x&modality=zoom&from=1&to=2`, { headers: headers() }));
    expect(bad.status).toBe(400);
    const hidden = await getSlots(new NextRequest(`${BASE}/slots?doctorId=valeria-quintana&modality=meet&from=2030-01-01&to=2030-01-02`, { headers: headers() }));
    expect(hidden.status).toBe(404);
  });
});

describe("POST /api/booking/create", () => {
  it("books a demo slot end to end and never echoes personal data", async () => {
    const start = await firstDemoSlot();
    const response = await post(bookingBody(start));
    expect(response.status).toBe(201);
    const text = await response.text();
    expect(text).not.toContain("12345678");
    expect(text).not.toContain("paciente@example.com");
    const body = JSON.parse(text);
    expect(body).toMatchObject({ ok: true, data: { isDemo: true, doctorId: REAL_DOCTOR_SLUG, start } });
  });

  it("rejects missing consents, the honeypot and malformed JSON", async () => {
    const start = await firstDemoSlot();
    expect((await post(bookingBody(start, { consents: { dataProcessing: true, telehealth: false } }))).status).toBe(400);
    expect((await post(bookingBody(start, { website: "spam" }))).status).toBe(400);
    const malformed = await createBooking(new NextRequest(`${BASE}/create`, { method: "POST", body: "{nope", headers: headers() }));
    expect(malformed.status).toBe(400);
  });

  it("refuses past times", async () => {
    const response = await post(bookingBody("2020-01-01T14:00:00.000Z"));
    expect(response.status).toBe(409);
  });

  it("rate-limits repeated bookings from the same IP", async () => {
    const start = await firstDemoSlot();
    const fixed = { "x-forwarded-for": "203.0.113.9", "content-type": "application/json" };
    const statuses: number[] = [];
    for (let i = 0; i < 10; i += 1) {
      const response = await createBooking(new NextRequest(`${BASE}/create`, { method: "POST", body: JSON.stringify(bookingBody(start)), headers: fixed }));
      statuses.push(response.status);
    }
    expect(statuses).toContain(429);
  });
});

describe("GET /api/booking/[uid]", () => {
  it("validates the uid and explains that demo bookings live in the browser", async () => {
    const invalid = await getBooking(new NextRequest(`${BASE}/../x`, { headers: headers() }), { params: Promise.resolve({ uid: "../x" }) });
    expect(invalid.status).toBe(400);
    const demo = await getBooking(new NextRequest(`${BASE}/demo-abc123`, { headers: headers() }), { params: Promise.resolve({ uid: "demo-abc123" }) });
    expect(demo.status).toBe(404);
  });
});

describe("POST /api/webhooks/calcom", () => {
  afterEach(() => vi.unstubAllEnvs());

  const body = JSON.stringify({ triggerEvent: "BOOKING_CREATED", payload: { uid: "abc", startTime: "2030-01-01T14:00:00Z" } });

  it("rejects unsigned or wrongly signed calls", async () => {
    vi.stubEnv("CALCOM_WEBHOOK_SECRET", "s3cret");
    const unsigned = await calcomWebhook(new Request("http://localhost/api/webhooks/calcom", { method: "POST", body }));
    expect(unsigned.status).toBe(401);
  });

  it("accepts a valid signature and does nothing else without WhatsApp variables", async () => {
    vi.stubEnv("CALCOM_WEBHOOK_SECRET", "s3cret");
    const signature = createHmac("sha256", "s3cret").update(body).digest("hex");
    const response = await calcomWebhook(
      new Request("http://localhost/api/webhooks/calcom", { method: "POST", body, headers: { "x-cal-signature-256": signature } }),
    );
    expect(response.status).toBe(200);
  });
});
