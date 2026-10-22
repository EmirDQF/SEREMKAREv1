#!/usr/bin/env node
/**
 * Paleta 2026 «clínica de precisión»: escalas 50–950 definidas en OKLCH y su equivalente hex
 * (alternativa para navegadores sin OKLCH y para la comprobación de contraste de tests/contrast.test.ts).
 * Uso: node scripts/palette.mjs           → tabla de escalas con contraste sobre blanco y navy-950
 *      node scripts/palette.mjs --css > app/palette.css  → regenera las escalas (se importan en globals.css)
 */

const CSS_HEADER = "/* Generado con `node scripts/palette.mjs --css > app/palette.css`: no editar a mano (cambia SCALES en el script). */";

/** [L, C] por paso; el matiz es fijo por familia. */
export const SCALES = {
  navy: {
    hue: 264,
    steps: { 50: [0.972, 0.012], 100: [0.94, 0.022], 200: [0.875, 0.04], 300: [0.78, 0.06], 400: [0.655, 0.08], 500: [0.54, 0.095], 600: [0.45, 0.1], 700: [0.37, 0.092], 800: [0.3, 0.078], 900: [0.235, 0.06], 950: [0.185, 0.048] },
  },
  teal: {
    hue: 184,
    steps: { 50: [0.975, 0.022], 100: [0.94, 0.05], 200: [0.89, 0.085], 300: [0.83, 0.115], 400: [0.76, 0.13], 500: [0.67, 0.125], 600: [0.56, 0.105], 700: [0.49, 0.09], 800: [0.41, 0.075], 900: [0.335, 0.06], 950: [0.255, 0.045] },
  },
  aqua: {
    hue: 222,
    steps: { 50: [0.975, 0.016], 100: [0.945, 0.034], 200: [0.895, 0.062], 300: [0.83, 0.09], 400: [0.75, 0.115], 500: [0.66, 0.13], 600: [0.565, 0.13], 700: [0.48, 0.12], 800: [0.4, 0.1], 900: [0.32, 0.08], 950: [0.245, 0.06] },
  },
  mist: {
    hue: 250,
    steps: { 50: [0.982, 0.005], 100: [0.958, 0.009], 200: [0.918, 0.014], 300: [0.862, 0.019], 400: [0.72, 0.024], 500: [0.575, 0.027], 600: [0.47, 0.03], 700: [0.385, 0.032], 800: [0.3, 0.032], 900: [0.235, 0.03], 950: [0.175, 0.026] },
  },
};

function oklchToLinearRgb(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const [l, m, s] = [l_ ** 3, m_ ** 3, s_ ** 3];
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb) => rgb.every((v) => v >= -0.0005 && v <= 1.0005);

/** Reduce el croma hasta entrar en sRGB (misma luminosidad y matiz). */
export function oklchToHex(L, C, h) {
  let chroma = C;
  let rgb = oklchToLinearRgb(L, chroma, h);
  while (!inGamut(rgb) && chroma > 0) {
    chroma -= 0.002;
    rgb = oklchToLinearRgb(L, chroma, h);
  }
  const encode = (v) => {
    const x = Math.min(1, Math.max(0, v));
    const s = x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
    return Math.round(s * 255).toString(16).padStart(2, "0");
  };
  return `#${rgb.map(encode).join("")}`;
}

function luminance(hex) {
  const channel = (i) => {
    const s = parseInt(hex.slice(i, i + 2), 16) / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export function scaleHex() {
  return Object.fromEntries(
    Object.entries(SCALES).map(([name, { hue, steps }]) => [
      name,
      Object.fromEntries(Object.entries(steps).map(([step, [L, C]]) => [step, { hex: oklchToHex(L, C, hue), oklch: `oklch(${L} ${C} ${hue})` }])),
    ]),
  );
}

if (process.argv[1]?.endsWith("palette.mjs")) {
  const scales = scaleHex();
  if (process.argv.includes("--css")) {
    const hexLines = [];
    const oklchLines = [];
    for (const [name, steps] of Object.entries(scales)) {
      for (const [step, { hex, oklch }] of Object.entries(steps)) {
        hexLines.push(`  --${name}-${step}: ${hex};`);
        oklchLines.push(`    --${name}-${step}: ${oklch};`);
      }
    }
    process.stdout.write(`${CSS_HEADER}
:root {\n${hexLines.join("\n")}\n}\n@supports (color: oklch(0 0 0)) {\n  :root {\n${oklchLines.join("\n")}\n  }\n}\n`);
  } else {
    const dark = scales.navy[950].hex;
    for (const [name, steps] of Object.entries(scales)) {
      for (const [step, { hex }] of Object.entries(steps)) {
        process.stdout.write(`${name.padEnd(5)} ${step.padStart(3)} ${hex}  vs blanco ${contrast(hex, "#ffffff").toFixed(2).padStart(5)}  vs navy-950 ${contrast(hex, dark).toFixed(2).padStart(5)}\n`);
      }
    }
  }
}
