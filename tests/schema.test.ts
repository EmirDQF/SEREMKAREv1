import { describe, expect, it } from "vitest";
import {
  ORGANIZATION_ID,
  breadcrumbSchema,
  diagnosticProcedureSchema,
  locationClinicId,
  locationClinicSchema,
  medicalServiceSchema,
  organizationSchema,
  physicianSchema,
  procedureSchema,
} from "@/lib/schema";
import { getLocation, primaryLocation } from "@/lib/locations";
import { site } from "@/data/site";

const OFFICIAL_NUMBERS = site.whatsappLines.map((line) => `+${line.number}`);

describe("organizationSchema", () => {
  const schema = organizationSchema();

  it("is the KARE SAC medical organization reachable on the main WhatsApp line", () => {
    expect(schema["@type"]).toBe("MedicalOrganization");
    expect(schema["@id"]).toBe(`${site.url}/#organization`);
    expect(ORGANIZATION_ID).toBe(schema["@id"]);
    expect(schema.legalName).toBe("KARE SAC");
    expect(schema.telephone).toBe("+51994931540");
  });

  it("groups the three branches instead of claiming a single address", () => {
    expect(schema).not.toHaveProperty("address");
    expect(schema.subOrganization).toEqual(site.locations.map((location) => ({ "@id": locationClinicId(location) })));
  });

  it("only publishes the RUC once it is confirmed", () => {
    expect(site.taxId).toBeUndefined();
    expect(schema).not.toHaveProperty("taxID");
  });

  it("never invents ratings or unconfirmed hours", () => {
    expect(primaryLocation().hours.confirmed).toBe(false);
    expect(schema).not.toHaveProperty("aggregateRating");
    expect(schema).not.toHaveProperty("openingHoursSpecification");
  });
});

describe.each(site.locations.map((location) => [location.id, location] as const))("locationClinicSchema(%s)", (id, location) => {
  const schema = locationClinicSchema(location);

  it("has its own @id under its page and belongs to the organization", () => {
    expect(schema["@id"]).toBe(`${site.url}/sedes/${id}#clinic`);
    expect(schema.url).toBe(`${site.url}/sedes/${id}`);
    expect(schema.parentOrganization).toEqual({ "@id": ORGANIZATION_ID });
  });

  it("uses one of the three official WhatsApp numbers and a Google Maps link", () => {
    expect(OFFICIAL_NUMBERS).toContain(schema.telephone);
    expect(schema.hasMap).toBe(location.mapsUrl);
    expect(String(schema.hasMap)).toMatch(/^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/);
  });

  it("describes the branch with its hospital reference when it has one, without repeating it", () => {
    const description = String(schema.description);
    expect(description).toContain(location.intro);
    if (location.reference) expect(description.split(location.reference)).toHaveLength(2);
  });

  it("never publishes coordinates or ratings", () => {
    expect(schema).not.toHaveProperty("geo");
    expect(schema).not.toHaveProperty("aggregateRating");
  });
});

describe("locationClinicSchema (Callao)", () => {
  const schema = locationClinicSchema(getLocation("callao")) as Record<string, unknown> & {
    address: { addressLocality: string };
    areaServed: { name: string }[];
    availableService: { "@type": string; name: string };
  };

  it("uses the branch WhatsApp, map and hospital reference", () => {
    const location = getLocation("callao");
    expect(schema.telephone).toBe(`+${location.whatsapp.number}`);
    expect(schema.hasMap).toBe(location.mapsUrl);
    expect(schema.description).toContain("Daniel Alcides Carrión");
    expect(schema.address.addressLocality).toBe("Callao");
  });

  it("serves nearby districts and offers bone densitometry", () => {
    expect(schema.areaServed.map((area) => area.name)).toEqual(getLocation("callao").nearbyDistricts);
    expect(schema.availableService).toEqual({ "@type": "DiagnosticProcedure", name: "Densitometría ósea (DXA)" });
  });

  it("never invents coordinates, ratings or unconfirmed hours", () => {
    expect(schema).not.toHaveProperty("geo");
    expect(schema).not.toHaveProperty("aggregateRating");
    expect(schema).not.toHaveProperty("openingHoursSpecification");
  });
});

describe("breadcrumbSchema", () => {
  it("lists absolute URLs in order", () => {
    const schema = breadcrumbSchema([
      { label: "Inicio", href: "/" },
      { label: "Densitometría ósea", href: "/densitometria-osea" },
    ]) as { itemListElement: { position: number; item: string }[] };
    expect(schema.itemListElement.map((i) => [i.position, i.item])).toEqual([
      [1, `${site.url}/`],
      [2, `${site.url}/densitometria-osea`],
    ]);
  });
});

describe("diagnosticProcedureSchema", () => {
  const info = {
    name: "Densitometría ósea",
    alternateName: ["DXA"],
    description: "d",
    path: "/densitometria-osea",
    bodyLocation: "Columna lumbar y cadera",
    howPerformed: "h",
    preparation: "p",
    followup: "f",
  };

  it("is a non-invasive diagnostic procedure linked to the organization by default", () => {
    const schema = diagnosticProcedureSchema(info);
    expect(schema["@type"]).toBe("DiagnosticProcedure");
    expect(schema.procedureType).toBe("https://schema.org/NoninvasiveProcedure");
    expect(schema.availableAt).toEqual({ "@id": ORGANIZATION_ID });
  });

  it("can point to the branches (places) where the study is done", () => {
    const schema = diagnosticProcedureSchema({ ...info, availableAt: site.locations });
    expect(schema.availableAt).toEqual(site.locations.map((location) => ({ "@id": locationClinicId(location) })));
  });
});

describe("procedureSchema and medicalServiceSchema", () => {
  it("marks therapeutic procedures with their own type", () => {
    const schema = procedureSchema("TherapeuticProcedure", {
      name: "Infiltración",
      alternateName: [],
      description: "d",
      path: "/tratamientos/infiltraciones-ecoguiadas",
      bodyLocation: "Articulaciones",
      howPerformed: "h",
      preparation: "p",
      followup: "f",
    });
    expect(schema["@type"]).toBe("TherapeuticProcedure");
  });

  it("lists every sub-service as an offer of the clinic", () => {
    const schema = medicalServiceSchema({ name: "Telemedicina", description: "d", path: "/servicios/telemedicina", offers: ["A", "B"] });
    const catalog = schema.hasOfferCatalog as { itemListElement: { itemOffered: { name: string } }[] };
    expect(catalog.itemListElement.map((item) => item.itemOffered.name)).toEqual(["A", "B"]);
    expect(schema.provider).toEqual({ "@id": ORGANIZATION_ID });
  });
});

describe("physicianSchema", () => {
  const base = { name: "Dr. Daniel Ccolcca", path: "/staff/daniel-ccolcca", specialty: "Reumatología", knowsAbout: ["Lupus"] };

  it("publishes the photo as an absolute URL", () => {
    const schema = physicianSchema({ ...base, image: "/images/doctor/daniel-ccolcca-552.jpg" });
    expect(schema.image).toBe(`${site.url}/images/doctor/daniel-ccolcca-552.jpg`);
  });

  it("omits image when there is no real photo", () => {
    expect(physicianSchema({ ...base, image: null })).not.toHaveProperty("image");
  });
});
