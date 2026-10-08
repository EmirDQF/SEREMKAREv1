import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { REAL_DOCTOR_SLUG } from "@/data/doctors";
import { createRateLimiter } from "@/lib/api/rate-limit";
import { createBookingSchema, slotsQuerySchema } from "@/lib/api/schemas";
import { verifyCalcomSignature } from "@/lib/api/webhook-signature";

const validBooking = {
  doctorId: REAL_DOCTOR_SLUG,
  modality: "meet",
  start: "2026-10-06T14:00:00.000Z",
  patient: {
    fullName: "Paciente de Prueba",
    document: "12345678",
    phone: "987 654 321",
    email: "paciente@example.com",
    forWhom: "mi",
  },
  reason: "Dolor de rodilla desde hace meses",
  triageSummary: null,
  consents: { dataProcessing: true, telehealth: true },
  website: "",
};

describe("createBookingSchema", () => {
  it("accepts a valid request and normalizes the Peruvian phone to 51XXXXXXXXX", () => {
    const parsed = createBookingSchema.safeParse(validBooking);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.patient.phone).toBe("51987654321");
  });

  it("requires both consents (Ley 29733 and Ley 30421)", () => {
    const noData = { ...validBooking, consents: { dataProcessing: false, telehealth: true } };
    const noTele = { ...validBooking, consents: { dataProcessing: true, telehealth: false } };
    expect(createBookingSchema.safeParse(noData).success).toBe(false);
    expect(createBookingSchema.safeParse(noTele).success).toBe(false);
  });

  it("rejects the honeypot when a bot fills it", () => {
    expect(createBookingSchema.safeParse({ ...validBooking, website: "http://spam" }).success).toBe(false);
  });

  it("rejects invalid documents, phones, emails and unknown doctors", () => {
    const bad = (patch: Record<string, unknown>) => ({ ...validBooking, patient: { ...validBooking.patient, ...patch } });
    expect(createBookingSchema.safeParse(bad({ document: "12" })).success).toBe(false);
    expect(createBookingSchema.safeParse(bad({ phone: "123" })).success).toBe(false);
    expect(createBookingSchema.safeParse(bad({ email: "no-es-correo" })).success).toBe(false);
    expect(createBookingSchema.safeParse({ ...validBooking, doctorId: "../../etc" }).success).toBe(false);
  });

  it("caps free text to avoid abuse", () => {
    expect(createBookingSchema.safeParse({ ...validBooking, reason: "x".repeat(2000) }).success).toBe(false);
  });
});

describe("slotsQuerySchema", () => {
  it("accepts dates in AAAA-MM-DD and a known modality", () => {
    expect(slotsQuerySchema.safeParse({ doctorId: REAL_DOCTOR_SLUG, modality: "meet", from: "2026-10-05", to: "2026-10-11" }).success).toBe(true);
  });

  it("rejects malformed dates or a range that ends before it starts", () => {
    expect(slotsQuerySchema.safeParse({ doctorId: REAL_DOCTOR_SLUG, modality: "meet", from: "05/10/2026", to: "2026-10-11" }).success).toBe(false);
    expect(slotsQuerySchema.safeParse({ doctorId: REAL_DOCTOR_SLUG, modality: "meet", from: "2026-10-11", to: "2026-10-05" }).success).toBe(false);
  });
});

describe("createRateLimiter", () => {
  it("allows up to the limit per window and then blocks", () => {
    let now = 0;
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: () => now });
    expect(limiter.check("1.1.1.1")).toBe(true);
    expect(limiter.check("1.1.1.1")).toBe(true);
    expect(limiter.check("1.1.1.1")).toBe(false);
    expect(limiter.check("2.2.2.2")).toBe(true);
    now = 1500;
    expect(limiter.check("1.1.1.1")).toBe(true);
  });
});

describe("verifyCalcomSignature", () => {
  const secret = "test-secret";
  const body = JSON.stringify({ triggerEvent: "BOOKING_CREATED", payload: { uid: "abc" } });
  const signature = createHmac("sha256", secret).update(body).digest("hex");

  it("accepts the HMAC-SHA256 hex signature of the raw body", () => {
    expect(verifyCalcomSignature(body, signature, secret)).toBe(true);
  });

  it("rejects a missing, tampered or wrong-length signature", () => {
    expect(verifyCalcomSignature(body, null, secret)).toBe(false);
    expect(verifyCalcomSignature(`${body} `, signature, secret)).toBe(false);
    expect(verifyCalcomSignature(body, "abc", secret)).toBe(false);
    expect(verifyCalcomSignature(body, signature, "")).toBe(false);
  });
});

describe("WhatsApp Cloud (opcional)", async () => {
  const { buildTemplatePayload, formatLimaDateTime, whatsappCloudConfig } = await import("@/lib/api/whatsapp-cloud");

  it("stays off without token and phone id", () => {
    expect(whatsappCloudConfig({})).toBeNull();
    expect(whatsappCloudConfig({ WHATSAPP_CLOUD_TOKEN: "t" })).toBeNull();
  });

  it("builds the template with first name and Lima time only (no symptoms)", () => {
    const config = whatsappCloudConfig({ WHATSAPP_CLOUD_TOKEN: "t", WHATSAPP_PHONE_ID: "123" });
    if (!config) throw new Error("expected config");
    const payload = buildTemplatePayload(config, { phone: "+51 987 654 321", name: "Ana Pérez", startTime: "2026-10-06T14:00:00Z" });
    expect(payload.to).toBe("51987654321");
    expect(payload.template.name).toBe("confirmacion_cita");
    const texts = payload.template.components[0].parameters.map((p) => p.text);
    expect(texts[0]).toBe("Ana");
    expect(texts[1]).toBe(formatLimaDateTime("2026-10-06T14:00:00Z"));
    expect(texts[1]).toMatch(/6 de octubre/);
  });
});
