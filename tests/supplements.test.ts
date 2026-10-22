import { describe, expect, it } from "vitest";
import { mainNav } from "@/data/navigation";
import { SUPPLEMENTS_DISCLAIMER, supplementCategories, supplements } from "@/data/supplements";
import { visibility } from "@/data/visibility";
import { supplementOrderMessage } from "@/lib/whatsapp";

describe("supplements", () => {
  it("publishes no product while the catalog flag is off (no invented products)", () => {
    expect(visibility.supplementsCatalog).toBe(false);
    expect(supplements).toEqual([]);
  });

  it("only publishes products with a sanitary registry", () => {
    for (const product of supplements) expect(product.sanitaryRegistry).toBeTruthy();
  });

  it("shows the three categories with neutral copy (no cure or prevention claims)", () => {
    expect(supplementCategories.map((category) => category.id)).toEqual(["salud-osea", "articular", "bienestar"]);
    for (const category of supplementCategories) expect(category.description).not.toMatch(/cura|previene|trata|mejora/i);
  });

  it("warns that supplements are not medicines", () => {
    expect(SUPPLEMENTS_DISCLAIMER).toMatch(/no son medicamentos/);
  });

  it("prefills the WhatsApp order with the product only", () => {
    expect(supplementOrderMessage({ name: "Producto X", presentation: "Frasco x 60" })).toBe(
      "Hola SERMEKARE, quiero pedir: Producto X (Frasco x 60). ¿Está disponible?",
    );
    expect(supplementOrderMessage()).toMatch(/información sobre los suplementos/);
  });

  it("puts Suplementos right before Sedes in the menu", () => {
    const labels = mainNav.map((link) => link.label);
    expect(labels.indexOf("Suplementos")).toBe(labels.indexOf("Sedes") - 1);
  });
});
