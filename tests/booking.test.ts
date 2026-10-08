import { describe, expect, it } from "vitest";
import {
  EMPTY_DRAFT,
  applyPrefill,
  withComplaint,
  withDoctor,
  withModality,
  buildTeleconsultMessage,
  describeBlock,
  doctorSlots,
  doctorsFor,
  firstInvalidStep,
  formatAge,
  hasRedFlags,
  normalizePhone,
  parseAge,
  validateStep1,
  validateStep2,
  validateStep3,
} from "@/lib/booking";
import { doctors } from "@/data/doctors";
import { bodyZones, complaintFor, complaints, getComplaint } from "@/data/bodyZones";
import { ENABLED_MODALITIES, teleconsultSchedule } from "@/data/teleconsult";
import { slotStarts } from "@/lib/slots";
import type { BookingDraft, ComplaintId, Doctor, Modality, Weekday } from "@/types/medical";

// 2026-10-05 es lunes; 2026-10-12 también.
const limaTime = (iso: string) => new Date(`${iso}-05:00`);
const NOW = limaTime("2026-10-05T12:00:00");

function makeDoctor(slug: string, days: readonly Weekday[], modalities: readonly Modality[], from = 1140, to = 1320): Doctor {
  return {
    slug,
    name: `Dra. ${slug}`,
    title: "Médica reumatóloga",
    specialty: "Reumatología",
    cmp: "00000",
    rne: "00000",
    yearsOfExperience: 10,
    education: [],
    focus: [],
    photo: "",
    photoAlt: "",
    complaints: ["rodilla", "general"],
    schedule: [{ days, from, to, modalities }],
    provisional: true,
    initials: "XX",
    sample: true,
  };
}

const ana = makeDoctor("ana", [1, 3, 5], ["videollamada", "llamada"]);
const bea = makeDoctor("bea", [2, 4], ["videollamada"], 1200, 1260);
const roster = [ana, bea] as const;

const valid: BookingDraft = {
  ...EMPTY_DRAFT,
  age: "72",
  forWhom: "familiar",
  complaint: "rodilla",
  intensity: 6,
  since: "semanas",
  modality: "videollamada",
  doctorSlug: "ana",
  slot: { date: "2026-10-12", minutes: 1170 },
  fullName: "  María Pérez ",
  phone: "+51 987 654 321",
  consent: true,
};

describe("parseAge / formatAge", () => {
  it("accepts whole numbers from 0 to 120", () => {
    expect(parseAge("0")).toBe(0);
    expect(parseAge(" 45 ")).toBe(45);
    expect(parseAge("120")).toBe(120);
  });

  it("rejects empty, negative, decimal, too high or non-numeric ages", () => {
    for (const raw of ["", " ", "-1", "121", "12.5", "abc", "4e1", "1e3"]) expect(parseAge(raw)).toBeNull();
  });

  it("reads naturally in Spanish", () => {
    expect(formatAge(0)).toBe("menos de 1 año");
    expect(formatAge(1)).toBe("1 año");
    expect(formatAge(72)).toBe("72 años");
  });
});

describe("validateStep1", () => {
  it("passes with a valid age and complaint", () => {
    expect(validateStep1(valid)).toEqual({});
  });

  it("flags an invalid age and a missing complaint", () => {
    expect(validateStep1({ ...valid, age: "130", complaint: null })).toEqual({
      age: expect.any(String),
      complaint: expect.any(String),
    });
  });

  it("red flags always block the teleconsulta and point to emergencies (D9)", () => {
    const flagged = { ...valid, redFlags: ["pecho"] as const };
    expect(hasRedFlags(flagged)).toBe(true);
    expect(validateStep1(flagged).redFlags).toMatch(/emergencias|SAMU 106/i);
  });

  it("without red flags step 1 passes", () => {
    expect(hasRedFlags(valid)).toBe(false);
    expect(validateStep1(valid)).toEqual({});
  });
});

describe("doctorsFor / doctorSlots", () => {
  it("filters by complaint and modality", () => {
    expect(doctorsFor("rodilla", "llamada", roster).map((d) => d.slug)).toEqual(["ana"]);
    expect(doctorsFor("rodilla", "videollamada", roster).map((d) => d.slug)).toEqual(["ana", "bea"]);
    expect(doctorsFor("huesos", "videollamada", roster)).toEqual([]);
  });

  it("returns only the slots inside the doctor's window on their days", () => {
    expect(doctorSlots(bea, "2026-10-06", "videollamada", NOW)).toEqual([1200, 1230]);
    expect(doctorSlots(bea, "2026-10-05", "videollamada", NOW)).toEqual([]);
    expect(doctorSlots(bea, "2026-10-06", "llamada", NOW)).toEqual([]);
  });
});

describe("validateStep2", () => {
  it("passes with an available doctor and slot", () => {
    expect(validateStep2(valid, NOW, roster)).toEqual({});
  });

  it("requires a doctor and a slot", () => {
    expect(validateStep2({ ...valid, doctorSlug: null, slot: null }, NOW, roster)).toEqual({
      doctor: expect.any(String),
      slot: expect.any(String),
    });
  });

  it("rejects a slot the doctor does not attend or that already passed", () => {
    expect(validateStep2({ ...valid, slot: { date: "2026-10-13", minutes: 1170 } }, NOW, roster).slot).toBeDefined();
    const late = limaTime("2026-10-12T19:20:00");
    expect(validateStep2(valid, late, roster).slot).toBeDefined();
  });

  it("rejects a doctor that does not offer the chosen modality", () => {
    const draft = { ...valid, doctorSlug: "bea", modality: "llamada" as const, slot: { date: "2026-10-06", minutes: 1200 } };
    expect(validateStep2(draft, NOW, roster).doctor).toBeDefined();
  });
});

describe("validateStep3 / normalizePhone", () => {
  it("passes with name, Peruvian mobile and consent", () => {
    expect(validateStep3(valid)).toEqual({});
  });

  it("flags short name, invalid phone and missing consent", () => {
    expect(validateStep3({ ...valid, fullName: "A", phone: "01 640 0000", consent: false })).toEqual({
      fullName: expect.any(String),
      phone: expect.any(String),
      consent: expect.any(String),
    });
  });

  it("normalizes Peruvian mobiles with or without +51", () => {
    expect(normalizePhone("+51 987-654-321")).toBe("987 654 321");
    expect(normalizePhone("987654321")).toBe("987 654 321");
    expect(normalizePhone("87654321")).toBeNull();
    expect(normalizePhone("587654321")).toBeNull();
  });
});

describe("firstInvalidStep", () => {
  it("points to the first step with errors, or null when everything is valid", () => {
    expect(firstInvalidStep(valid, NOW, roster)).toBeNull();
    expect(firstInvalidStep({ ...valid, consent: false }, NOW, roster)).toBe(3);
    expect(firstInvalidStep({ ...valid, doctorSlug: null }, NOW, roster)).toBe(2);
    expect(firstInvalidStep({ ...valid, age: "x" }, NOW, roster)).toBe(1);
  });
});

describe("buildTeleconsultMessage", () => {
  it("follows the WhatsApp template exactly", () => {
    expect(buildTeleconsultMessage(valid, "Dra. Ana Prueba")).toBe(
      [
        "Hola SERMEKARE, quiero agendar una teleconsulta.",
        "• Paciente: María Pérez, 72 años",
        "• Molestia: Rodilla · intensidad 6/10 · desde hace semanas",
        "• Modalidad: Videollamada",
        "• Doctor/a: Dra. Ana Prueba",
        "• Día y hora: lunes 12 de octubre, 7:30 p.m.",
        "• Celular: 987 654 321",
      ].join("\n"),
    );
  });

  it("omits the optional intensity and duration when not given", () => {
    const msg = buildTeleconsultMessage({ ...valid, intensity: null, since: null, modality: "llamada" }, "Dra. Ana");
    expect(msg).toContain("• Molestia: Rodilla\n");
    expect(msg).toContain("• Modalidad: Llamada");
  });

  it("never includes red flags or medication requests", () => {
    const msg = buildTeleconsultMessage({ ...valid, redFlags: ["fiebre"] }, "Dra. Ana");
    expect(msg).not.toMatch(/fiebre|medicamento|receta/i);
  });
});

describe("real roster (data/doctors.ts)", () => {
  const weekdays = teleconsultSchedule.days;
  const modalities = ENABLED_MODALITIES;

  it("covers every complaint, every business day and every enabled modality", () => {
    for (const complaint of complaints) {
      for (const modality of modalities) {
        for (const day of weekdays) {
          const available = doctorsFor(complaint.id, modality).filter((d) =>
            d.schedule.some((s) => s.days.includes(day) && s.modalities.includes(modality)),
          );
          expect(available.length, `${complaint.id} · ${modality} · día ${day}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("keeps every doctor window inside the teleconsult hours, from 7 p.m.", () => {
    for (const doctor of doctors) {
      for (const block of doctor.schedule) {
        expect(block.from).toBeGreaterThanOrEqual(teleconsultSchedule.opensAt);
        expect(block.to).toBeLessThanOrEqual(teleconsultSchedule.closesAt);
        expect(block.days.every((d) => weekdays.includes(d))).toBe(true);
        expect(slotStarts(teleconsultSchedule, block).length).toBeGreaterThan(0);
      }
    }
  });
});

describe("complaintFor (precarga desde BodyMap y SymptomTriage)", () => {
  it("maps body zones and conditions to a complaint chip", () => {
    expect(complaintFor({ kind: "zone", zone: "rodillas" })).toBe("rodilla");
    expect(complaintFor({ kind: "zone", zone: "cuello" })).toBe("espalda");
    expect(complaintFor({ kind: "zone", zone: "manos" })).toBe("articulaciones");
    expect(complaintFor({ kind: "condition", slug: "osteoporosis" })).toBe("huesos");
    expect(complaintFor({ kind: "condition", slug: "fibromialgia" })).toBe("generalizado");
  });

  it("every body zone resolves to a specific chip", () => {
    for (const zone of bodyZones) expect(complaintFor({ kind: "zone", zone: zone.id })).not.toBe("general");
  });

  it("getComplaint throws for unknown ids", () => {
    expect(() => getComplaint("nada" as ComplaintId)).toThrow();
  });
});

describe("describeBlock", () => {
  it("renders a doctor's schedule block for humans", () => {
    expect(describeBlock({ days: [1, 3, 5], from: 1140, to: 1320, modalities: ["videollamada", "llamada"] })).toEqual({
      key: "135-1140",
      days: "Lunes, miércoles y viernes",
      hours: "7:00 p.m. – 10:00 p.m.",
      modalities: "Videollamada o llamada",
    });
    expect(describeBlock({ days: [2, 4], from: 1200, to: 1320, modalities: ["videollamada"] }).modalities).toBe("Videollamada");
  });
});

describe("draft transitions (immutable)", () => {
  it("applyPrefill sets the complaint and a doctor only if that doctor treats it", () => {
    const next = applyPrefill(EMPTY_DRAFT, { complaint: "rodilla", doctorSlug: "ana" }, roster);
    expect(next).toMatchObject({ complaint: "rodilla", doctorSlug: "ana", slot: null });
    expect(EMPTY_DRAFT.complaint).toBeNull();
    expect(applyPrefill(EMPTY_DRAFT, { complaint: "huesos", doctorSlug: "ana" }, roster).doctorSlug).toBeNull();
    expect(applyPrefill(valid, { complaint: "rodilla" }, roster).doctorSlug).toBe("ana");
  });

  it("withComplaint keeps the doctor only if they still fit", () => {
    expect(withComplaint(valid, "general", roster).doctorSlug).toBe("ana");
    expect(withComplaint(valid, "huesos", roster)).toMatchObject({ complaint: "huesos", doctorSlug: null, slot: null });
  });

  it("withModality drops a doctor who does not offer it", () => {
    const withBea = { ...valid, doctorSlug: "bea", slot: { date: "2026-10-06", minutes: 1200 } };
    expect(withModality(withBea, "llamada", roster)).toMatchObject({ modality: "llamada", doctorSlug: null, slot: null });
    expect(withModality(valid, "llamada", roster)).toMatchObject({ modality: "llamada", doctorSlug: "ana" });
  });

  it("withDoctor resets the slot when switching doctors", () => {
    expect(withDoctor(valid, "ana").slot).toEqual(valid.slot);
    expect(withDoctor(valid, "bea")).toMatchObject({ doctorSlug: "bea", slot: null });
  });
});
