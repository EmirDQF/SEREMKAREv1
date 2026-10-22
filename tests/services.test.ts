import { describe, expect, it } from "vitest";
import { getServiceDetail } from "@/data/service-details";
import { corePillars, extraPillar, servicePillars } from "@/data/services";

describe("service pillars (client offer)", () => {
  it("publishes the 4 core pillars of the integral care model, diagnosis first", () => {
    expect(corePillars.map((pillar) => pillar.slug)).toEqual([
      "apoyo-diagnostico",
      "apoyo-terapeutico",
      "consulta-externa",
      "procedimientos",
    ]);
    expect(corePillars[0]?.size).toBe("lg");
  });

  it("keeps telemedicine apart as the extra service, with its three remote modes", () => {
    expect(extraPillar?.slug).toBe("telemedicina");
    expect(extraPillar?.services.map((service) => service.name)).toEqual(["Teleconsulta", "Teleinterconsulta", "Atención híbrida"]);
  });

  it("shows every service the client listed (none hidden)", () => {
    const names = servicePillars.flatMap((pillar) => pillar.services.map((service) => service.name));
    for (const name of ["Densitometría ósea", "Evaluación de osteoporosis severa (VFA)", "Medicamentos biotecnológicos", "Psicología", "Infiltraciones ecoguiadas por radiólogo"]) {
      expect(names).toContain(name);
    }
  });

  it("answers who it is for and how to prepare on every published pillar", () => {
    for (const pillar of servicePillars) {
      const detail = getServiceDetail(pillar.slug);
      expect(pillar.summary.length).toBeGreaterThan(20);
      expect(detail.forWhom.length).toBeGreaterThan(20);
      expect(detail.preparation.length).toBeGreaterThanOrEqual(2);
    }
  });
});
