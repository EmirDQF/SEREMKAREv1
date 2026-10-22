import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PALETTE } from "@/components/3d/palette";
import { BODY_PAIRS, PALETTE_PAIRS, contrastRatio, evaluatePairs, parseColor, readThemeTokens } from "@/lib/contrast";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

describe("contrast math (WCAG 2.2)", () => {
  it("parses hex and rgb() with alpha", () => {
    expect(parseColor("#fff")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor("#0B192C")).toEqual({ r: 11, g: 25, b: 44, a: 1 });
    expect(parseColor("rgb(2 132 199 / 0.10)")).toEqual({ r: 2, g: 132, b: 199, a: 0.1 });
    expect(parseColor("rgb(16, 185, 129)")).toEqual({ r: 16, g: 185, b: 129, a: 1 });
    expect(() => parseColor("var(--x)")).toThrow();
  });

  it("computes the reference ratios", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
    expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
    expect(contrastRatio("#777777", "#ffffff")).toBeCloseTo(4.48, 2);
  });

  it("composites translucent backgrounds over their base before measuring", () => {
    // Un tinte casi transparente sobre blanco se comporta como blanco.
    expect(contrastRatio("#000000", "rgb(0 0 0 / 0)", "#ffffff")).toBeCloseTo(21, 1);
  });
});

describe("palette tokens (app/globals.css)", () => {
  for (const theme of ["light", "dark"] as const) {
    it(`every text/icon pair passes WCAG AA in ${theme} mode`, () => {
      const tokens = readThemeTokens(css, theme);
      const failing = evaluatePairs(tokens, PALETTE_PAIRS).filter((row) => !row.pass);
      expect(failing.map((row) => `${row.use}: ${row.ratio.toFixed(2)} < ${row.min}`)).toEqual([]);
    });
  }

  for (const theme of ["light", "dark"] as const) {
    it(`body text reaches WCAG AAA (7:1) in ${theme} mode`, () => {
      const tokens = readThemeTokens(css, theme);
      const failing = evaluatePairs(tokens, BODY_PAIRS).filter((row) => !row.pass);
      expect(failing.map((row) => `${row.use}: ${row.ratio.toFixed(2)} < ${row.min}`)).toEqual([]);
    });
  }

  it("defines the new teleconsult tokens in both themes", () => {
    for (const theme of ["light", "dark"] as const) {
      const tokens = readThemeTokens(css, theme);
      for (const name of ["video", "video-strong", "video-tint", "pain", "pain-text", "alert", "online", "online-dot"]) {
        expect(tokens[name], `${theme}: --${name}`).toBeDefined();
      }
    }
  });

  it("uses the 2026 palette (roles mapped to the OKLCH scales of scripts/palette.mjs)", () => {
    const light = readThemeTokens(css, "light");
    const dark = readThemeTokens(css, "dark");
    expect(light["teal-strong"].toLowerCase()).toBe("#037066"); // teal-700
    expect(light.foreground.toLowerCase()).toBe("#0f1d3a"); // navy-900
    expect(light.video.toLowerCase()).toBe("#036881"); // aqua-700
    expect(dark.background.toLowerCase()).toBe("#081128"); // navy-950
    expect(dark["teal-strong"].toLowerCase()).toBe("#61e0d0"); // teal-300
    expect(dark.video.toLowerCase()).toBe("#82d5f1"); // aqua-300
    expect(light.whatsapp.toLowerCase()).toBe("#25d366");
  });
});

describe("3D palette mirrors the CSS tokens", () => {
  it("keeps WebGL colors in sync with app/globals.css", () => {
    const light = readThemeTokens(css, "light");
    const dark = readThemeTokens(css, "dark");
    expect(PALETTE.teal).toBe(light.teal);
    expect(PALETTE.tealLight).toBe(dark.teal);
    expect(PALETTE.coral).toBe(light.coral);
    expect(PALETTE.video).toBe(light.video);
    expect(PALETTE.skyLight).toBe(dark.video);
    expect(PALETTE.videoStrong).toBe(dark["video-strong"]);
    expect(PALETTE.pain).toBe(light.pain);
    expect(PALETTE.painLight).toBe(dark.pain);
    expect(PALETTE.online).toBe(light["online-dot"]);
    expect(PALETTE.navy).toBe(light.navy);
    expect(PALETTE.navy2).toBe(light["navy-2"]);
  });
});
