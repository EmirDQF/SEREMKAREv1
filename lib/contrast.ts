/** Contraste WCAG 2.2 de los tokens de color (app/globals.css). Lógica pura, sin DOM. */

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type Theme = "light" | "dark";
export type ThemeTokens = Readonly<Record<string, string>>;

/** Par a verificar: fg y bg son nombres de token (sin "--"). `over` es la base de un fondo translúcido. */
export interface ContrastPair {
  use: string;
  fg: string;
  bg: string;
  over?: string;
  /** 7 cuerpo (AAA) · 4.5 texto normal (AA) · 3 texto grande, íconos y bordes de foco. */
  min: 7 | 4.5 | 3;
}

export interface ContrastRow extends ContrastPair {
  ratio: number;
  pass: boolean;
}

const BODY = 7;
const TEXT = 4.5;
const NON_TEXT = 3;

/** Texto de cuerpo (párrafos largos de pacientes, a menudo con baja visión): AAA en ambos temas. */
export const BODY_PAIRS: readonly ContrastPair[] = [
  { use: "Cuerpo · fondo", fg: "foreground", bg: "background", min: BODY },
  { use: "Cuerpo · fondo alterno", fg: "foreground", bg: "background-alt", min: BODY },
  { use: "Cuerpo · tarjeta", fg: "foreground", bg: "card-solid", min: BODY },
  { use: "Cuerpo secundario · fondo", fg: "muted", bg: "background", min: BODY },
  { use: "Cuerpo secundario · fondo alterno", fg: "muted", bg: "background-alt", min: BODY },
  { use: "Cuerpo secundario · tarjeta", fg: "muted", bg: "card-solid", min: BODY },
  { use: "Cuerpo sobre navy", fg: "on-navy-muted", bg: "navy", min: BODY },
];

export const PALETTE_PAIRS: readonly ContrastPair[] = [
  { use: "Texto · fondo", fg: "foreground", bg: "background", min: TEXT },
  { use: "Texto · tarjeta", fg: "foreground", bg: "card-solid", min: TEXT },
  { use: "Títulos · fondo alterno", fg: "heading", bg: "background-alt", min: TEXT },
  { use: "Texto secundario · fondo", fg: "muted", bg: "background", min: TEXT },
  { use: "Texto secundario · fondo alterno", fg: "muted", bg: "background-alt", min: TEXT },
  { use: "Texto secundario · tarjeta", fg: "muted", bg: "card-solid", min: TEXT },
  { use: "Texto tenue · fondo", fg: "subtle", bg: "background", min: TEXT },
  { use: "Texto tenue · fondo alterno", fg: "subtle", bg: "background-alt", min: TEXT },
  { use: "Texto tenue · tarjeta", fg: "subtle", bg: "card-solid", min: TEXT },
  { use: "Teal (texto) · fondo", fg: "teal-strong", bg: "background", min: TEXT },
  { use: "Teal (texto) · tarjeta", fg: "teal-strong", bg: "card-solid", min: TEXT },
  { use: "Teal (texto) · chip teal", fg: "teal-strong", bg: "teal-tint", over: "card-solid", min: TEXT },
  { use: "Botón primario", fg: "on-primary", bg: "teal-strong", min: TEXT },
  { use: "Botón primario (hover)", fg: "on-primary", bg: "teal-strong-hover", min: TEXT },
  { use: "Enlaces · fondo", fg: "link", bg: "background", min: TEXT },
  { use: "Enlaces · tarjeta", fg: "link", bg: "card-solid", min: TEXT },
  { use: "Azul teleconsulta · fondo", fg: "video", bg: "background", min: TEXT },
  { use: "Azul teleconsulta · tarjeta", fg: "video", bg: "card-solid", min: TEXT },
  { use: "Azul teleconsulta · chip azul", fg: "video", bg: "video-tint", over: "card-solid", min: TEXT },
  { use: "Paso activo / toggle (relleno)", fg: "on-video", bg: "video-strong", min: TEXT },
  { use: "Dolor (texto) · tarjeta", fg: "pain-text", bg: "card-solid", min: TEXT },
  { use: "Dolor (texto) · chip ámbar", fg: "pain-text", bg: "pain-tint", over: "card-solid", min: TEXT },
  { use: "Alerta · tarjeta", fg: "alert", bg: "card-solid", min: TEXT },
  { use: "Alerta · fondo", fg: "alert", bg: "background", min: TEXT },
  { use: "Alerta (texto) · aviso rojo", fg: "alert-strong", bg: "alert-tint", over: "card-solid", min: TEXT },
  { use: "Alerta (ícono/borde) · aviso rojo", fg: "alert", bg: "alert-tint", over: "card-solid", min: NON_TEXT },
  { use: "En línea · tarjeta", fg: "online", bg: "card-solid", min: TEXT },
  { use: "En línea · fondo", fg: "online", bg: "background", min: TEXT },
  { use: "En línea · badge", fg: "online", bg: "online-tint", over: "card-solid", min: TEXT },
  { use: "Botón WhatsApp (texto)", fg: "on-whatsapp", bg: "whatsapp-strong", min: TEXT },
  { use: "Botón WhatsApp (hover)", fg: "on-whatsapp", bg: "whatsapp-strong-hover", min: TEXT },
  { use: "Texto sobre navy", fg: "on-navy", bg: "navy", min: TEXT },
  { use: "Texto secundario sobre navy", fg: "on-navy-muted", bg: "navy", min: TEXT },
  { use: "Texto tenue sobre navy", fg: "on-navy-subtle", bg: "navy", min: TEXT },
  { use: "Texto secundario sobre navy-3", fg: "on-navy-muted", bg: "navy-3", min: TEXT },
  { use: "Ícono teal sobre navy", fg: "teal", bg: "navy", min: NON_TEXT },
  { use: "Punto en línea sobre navy", fg: "online-dot", bg: "navy", min: NON_TEXT },
  { use: "Ícono WhatsApp en botón flotante", fg: "on-whatsapp-brand", bg: "whatsapp", min: NON_TEXT },
  { use: "Estrellas · tarjeta", fg: "rating", bg: "card-solid", min: NON_TEXT },
  { use: "Estrellas · fondo", fg: "rating", bg: "background", min: NON_TEXT },
  { use: "Anillo de foco · fondo", fg: "ring", bg: "background", min: NON_TEXT },
  { use: "Anillo de foco · tarjeta", fg: "ring", bg: "card-solid", min: NON_TEXT },
];

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const RGB = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*(?:[/,]\s*([\d.]+))?\s*\)$/i;

export function parseColor(value: string): Rgba {
  const text = value.trim();
  const hex = HEX.exec(text);
  if (hex) {
    const digits = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join("") : hex[1];
    const channel = (i: number) => parseInt(digits.slice(i, i + 2), 16);
    return { r: channel(0), g: channel(2), b: channel(4), a: 1 };
  }
  const rgb = RGB.exec(text);
  if (rgb) return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]), a: rgb[4] === undefined ? 1 : Number(rgb[4]) };
  throw new Error(`Unsupported color: ${value}`);
}

function composite(top: Rgba, base: Rgba): Rgba {
  const mix = (a: number, b: number) => Math.round(a * top.a + b * (1 - top.a));
  return { r: mix(top.r, base.r), g: mix(top.g, base.g), b: mix(top.b, base.b), a: 1 };
}

function luminance({ r, g, b }: Rgba): number {
  const linear = (channel: number) => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** Contraste de fg sobre bg; si bg es translúcido se mezcla antes con `over` (blanco por defecto). */
export function contrastRatio(fg: string, bg: string, over = "#ffffff"): number {
  const background = composite(parseColor(bg), parseColor(over));
  const foreground = composite(parseColor(fg), background);
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

function blockTokens(css: string, selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`Selector not found: ${selector}`);
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}

/** Tokens efectivos de un tema: el oscuro hereda de :root lo que no redefine. */
export function readThemeTokens(css: string, theme: Theme): ThemeTokens {
  const light = blockTokens(css, ":root");
  return theme === "light" ? light : { ...light, ...blockTokens(css, '[data-theme="dark"]') };
}

function token(tokens: ThemeTokens, name: string): string {
  const value = tokens[name];
  if (!value) throw new Error(`Missing token: --${name}`);
  return value;
}

export function evaluatePairs(tokens: ThemeTokens, pairs: readonly ContrastPair[]): ContrastRow[] {
  return pairs.map((pair) => {
    const over = pair.over ? token(tokens, pair.over) : token(tokens, "background");
    const ratio = contrastRatio(token(tokens, pair.fg), token(tokens, pair.bg), over);
    return { ...pair, ratio, pass: ratio >= pair.min };
  });
}
