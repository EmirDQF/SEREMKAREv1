import { describe, expect, it } from "vitest";
import { APPOINTMENT_HREF, footerOnlyLinks, mainNav, moreLinks, primaryLinks } from "@/data/navigation";

describe("navigation", () => {
  it("follows the order numbered by the client", () => {
    const labels = mainNav.map((link) => link.label).filter((label) => label !== "Suplementos");
    expect(labels).toEqual([
      "Densitometría",
      "Especialidades",
      "Especialistas",
      "Teleconsulta",
      "Servicios",
      "Evaluación rápida",
      "Tarifas",
      "Sedes",
      "Blog",
    ]);
  });

  it("splits the same list between the desktop bar and «Más» without losing or repeating items", () => {
    expect([...primaryLinks, ...moreLinks]).toEqual(mainNav);
    expect(new Set(mainNav.map((link) => link.href)).size).toBe(mainNav.length);
  });

  it("keeps FAQ and Contacto only in the footer", () => {
    const main = new Set(mainNav.map((link) => link.href));
    expect(footerOnlyLinks.map((link) => link.href)).toEqual(["/preguntas-frecuentes", "/contacto"]);
    for (const link of footerOnlyLinks) expect(main.has(link.href)).toBe(false);
  });

  it("marks Densitometría with a clinical icon and no text badge", () => {
    expect(mainNav[0]).toMatchObject({ href: "/densitometria-osea", icon: "scan" });
  });

  it("sends «Agendar cita» to the virtual clinic type picker", () => {
    expect(APPOINTMENT_HREF).toBe("/consulta-virtual?servicio=elegir");
  });
});
