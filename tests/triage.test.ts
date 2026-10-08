import { describe, expect, it } from "vitest";
import { doctors } from "@/data/doctors";
import { densitometry } from "@/data/densitometry";
import {
  EMPTY_ANSWERS,
  isComplete,
  nextQuestion,
  questionFlow,
  triage,
  type TriageAnswers,
} from "@/lib/triage/engine";

const answered = (patch: Partial<TriageAnswers>): TriageAnswers => ({
  ...EMPTY_ANSWERS,
  redFlagsChecked: true,
  ...patch,
});

const KNEE: TriageAnswers["entry"] = { kind: "zone", zone: "rodillas" };
const BACK: TriageAnswers["entry"] = { kind: "zone", zone: "espalda" };

const FORBIDDEN = /diagn[oó]stic|\btienes\b|cura/i;

describe("questionFlow / nextQuestion", () => {
  it("always starts with the red-flag filter", () => {
    expect(nextQuestion(EMPTY_ANSWERS)).toBe("redFlags");
    expect(questionFlow(EMPTY_ANSWERS)[0]).toBe("redFlags");
  });

  it("stops asking as soon as a red flag is marked", () => {
    const answers = answered({ redFlags: ["pecho"] });
    expect(nextQuestion(answers)).toBeNull();
    expect(isComplete(answers)).toBe(true);
  });

  it("asks where it hurts after the filter", () => {
    expect(nextQuestion(answered({}))).toBe("entry");
  });

  it("joint path: duration → swelling → stiffness → prior exams", () => {
    expect(questionFlow(answered({ entry: KNEE }))).toEqual([
      "redFlags",
      "entry",
      "duration",
      "swelling",
      "stiffness",
      "priorExams",
    ]);
  });

  it("back path adds the movement question", () => {
    expect(questionFlow(answered({ entry: BACK }))).toContain("backPattern");
  });

  it("bone path asks the densitometry risk checklist instead of joint questions", () => {
    expect(questionFlow(answered({ entry: { kind: "bone" } }))).toEqual(["redFlags", "entry", "boneRisks", "priorExams"]);
  });

  it("returns null when every applicable question is answered", () => {
    const answers = answered({ entry: KNEE, duration: "gt3m", swelling: false, stiffness: "none", priorExams: true });
    expect(nextQuestion(answers)).toBeNull();
    expect(isComplete(answers)).toBe(true);
  });
});

describe("triage — red flags", () => {
  it.each(["fiebre", "fractura", "debilidad", "pecho", "aire"] as const)("%s → emergency, never teleconsulta", (flag) => {
    const result = triage(answered({ redFlags: [flag], entry: KNEE, duration: "gt3m" }));
    expect(result.kind).toBe("emergency");
    if (result.kind === "emergency") expect(result.flags).toEqual([flag]);
  });
});

describe("triage — orientation", () => {
  it("swelling → inflammation, priority, teleconsulta", () => {
    const result = triage(answered({ entry: KNEE, duration: "lt6w", swelling: true, stiffness: "none", priorExams: false }));
    expect(result).toMatchObject({ kind: "orientation", orientation: "inflamacion", urgency: "prioritaria", recommendedService: "teleconsulta" });
  });

  it("morning stiffness over 30 min → inflammation", () => {
    const result = triage(answered({ entry: KNEE, duration: "gt3m", swelling: false, stiffness: "gt30", priorExams: false }));
    expect(result).toMatchObject({ orientation: "inflamacion" });
  });

  it("back pain that improves with movement → inflammation", () => {
    const result = triage(answered({ entry: BACK, duration: "gt3m", swelling: false, stiffness: "lt30", backPattern: true, priorExams: false }));
    expect(result).toMatchObject({ orientation: "inflamacion" });
  });

  it("long-standing pain without inflammatory signs → wear, routine", () => {
    const result = triage(answered({ entry: KNEE, duration: "gt3m", swelling: false, stiffness: "lt30", priorExams: true }));
    expect(result).toMatchObject({ orientation: "desgaste", urgency: "habitual", bringExams: true });
  });

  it("recent pain without signs → general evaluation", () => {
    const result = triage(answered({ entry: KNEE, duration: "lt6w", swelling: false, stiffness: "none", priorExams: false }));
    expect(result).toMatchObject({ orientation: "general", urgency: "habitual", bringExams: false });
  });

  it("bone health with any risk factor → densitometry (in person) plus teleconsulta", () => {
    const [first] = densitometry.checklist;
    const result = triage(answered({ entry: { kind: "bone" }, boneRisks: { [first.id]: true }, priorExams: false }));
    expect(result).toMatchObject({ orientation: "salud-osea", recommendedService: "densitometria", alsoTeleconsult: true });
  });

  it("bone health without risk factors → teleconsulta", () => {
    const result = triage(answered({ entry: { kind: "bone" }, boneRisks: {}, priorExams: false }));
    expect(result).toMatchObject({ orientation: "salud-osea", recommendedService: "teleconsulta" });
  });

  it("osteoporosis condition goes through the bone path", () => {
    expect(questionFlow(answered({ entry: { kind: "condition", slug: "osteoporosis" } }))).toContain("boneRisks");
  });

  it("suggests only published doctors", () => {
    const published = new Set(doctors.map((d) => d.slug));
    const result = triage(answered({ entry: KNEE, duration: "gt3m", swelling: false, stiffness: "none", priorExams: false }));
    if (result.kind !== "orientation") throw new Error("expected orientation");
    expect(result.suggestedDoctorIds.length).toBeGreaterThan(0);
    for (const id of result.suggestedDoctorIds) expect(published.has(id)).toBe(true);
  });

  it("links only to visible specialties (or none)", () => {
    const result = triage(answered({ entry: { kind: "zone", zone: "pies" }, duration: "gt3m", swelling: false, stiffness: "none", priorExams: false }));
    if (result.kind !== "orientation") throw new Error("expected orientation");
    const visible = ["artrosis", "artritis-reumatoide", "lupus", "osteoporosis"];
    expect(result.specialtySlug === null || visible.includes(result.specialtySlug)).toBe(true);
  });
});

describe("triage — clinical language", () => {
  const cases: TriageAnswers[] = [
    answered({ entry: KNEE, duration: "lt6w", swelling: true, stiffness: "none", priorExams: false }),
    answered({ entry: KNEE, duration: "gt3m", swelling: false, stiffness: "none", priorExams: false }),
    answered({ entry: KNEE, duration: "lt6w", swelling: false, stiffness: "none", priorExams: false }),
    answered({ entry: { kind: "bone" }, boneRisks: { corticoides: true }, priorExams: false }),
    answered({ entry: { kind: "unsure" }, duration: "6w-3m", swelling: false, stiffness: "none", priorExams: false }),
  ];

  it("orients without diagnosing: always «Por lo que nos cuentas…», never «diagnóstico» or «tienes»", () => {
    for (const answers of cases) {
      const result = triage(answers);
      if (result.kind !== "orientation") throw new Error("expected orientation");
      expect(result.message.startsWith("Por lo que nos cuentas")).toBe(true);
      expect(result.message).not.toMatch(FORBIDDEN);
    }
  });
});
