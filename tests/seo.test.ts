import { describe, expect, it } from "vitest";
import { SHARE_IMAGE, buildMetadata, locationMetadata, locationPageTitle, metaDescription } from "@/lib/seo";
import { getLocation } from "@/lib/locations";
import { site } from "@/data/site";

describe("buildMetadata", () => {
  it("sets the canonical and Open Graph URL to the page path", () => {
    const metadata = buildMetadata({ title: "T", description: "D", path: "/contacto" });
    expect(metadata.alternates?.canonical).toBe("/contacto");
    expect(metadata.openGraph).toMatchObject({ url: "/contacto", locale: "es_PE", siteName: site.name });
  });

  it("shares the image with the doctor photo on Open Graph and Twitter", () => {
    const metadata = buildMetadata({ title: "T", description: "D", path: "/contacto" });
    expect(metadata.openGraph?.images).toEqual([SHARE_IMAGE]);
    expect(metadata.twitter?.images).toEqual([SHARE_IMAGE.url]);
    expect(SHARE_IMAGE).toMatchObject({ url: "/opengraph-image", width: 1200, height: 630 });
  });
});

describe("locationPageTitle", () => {
  it("names each district the way patients search it", () => {
    expect(locationPageTitle(getLocation("los-olivos"))).toBe("Densitometría ósea en Los Olivos");
    expect(locationPageTitle(getLocation("callao"))).toBe("Densitometría ósea en el Callao");
    expect(locationPageTitle(getLocation("puente-piedra"))).toBe("Densitometría ósea en Puente Piedra");
  });
});

describe("locationMetadata", () => {
  const all = site.locations.map(locationMetadata);

  it("gives every branch its own canonical under /sedes", () => {
    expect(all.map((metadata) => metadata.alternates?.canonical)).toEqual(site.locations.map((l) => `/sedes/${l.id}`));
  });

  it("uses a unique absolute title and description per branch", () => {
    const titles = all.map((metadata) => (metadata.title as { absolute: string }).absolute);
    expect(new Set(titles).size).toBe(site.locations.length);
    expect(new Set(all.map((metadata) => metadata.description)).size).toBe(site.locations.length);
    expect(titles[0]).toBe(`Densitometría ósea en Los Olivos | ${site.name}`);
  });

  it("mentions the hospital reference in the description when the branch has one", () => {
    const callao = locationMetadata(getLocation("callao"));
    expect(callao.description).toContain("Daniel Alcides Carrión");
    expect(callao.openGraph).toMatchObject({ url: "/sedes/callao", title: `Densitometría ósea en el Callao | ${site.name}` });
  });
});

describe("metaDescription", () => {
  it("keeps short descriptions untouched (collapsing whitespace)", () => {
    expect(metaDescription("  Densitometría   ósea en Lima.  ")).toBe("Densitometría ósea en Lima.");
  });

  it("cuts long text at the last full sentence that fits", () => {
    const text = `${"Primera frase con información útil para el paciente. ".repeat(2)}${"Segunda parte muy larga ".repeat(10)}`;
    const result = metaDescription(text, 120);
    expect(result.length).toBeLessThanOrEqual(120);
    expect(result.endsWith(".")).toBe(true);
  });

  it("falls back to a word boundary with an ellipsis when there is no sentence break", () => {
    const result = metaDescription("palabra ".repeat(40), 60);
    expect(result.length).toBeLessThanOrEqual(61);
    expect(result.endsWith("…")).toBe(true);
    expect(result).not.toMatch(/ …$/);
  });
});
