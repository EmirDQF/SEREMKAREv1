/**
 * Une clases sin resolver conflictos de Tailwind. Para componentes cliente del JS inicial: `cn`
 * (clsx + tailwind-merge) suma ~9 KB gzip al navegador. Úsalo solo si las clases no se pisan entre sí;
 * en componentes de servidor sigue usando `cn` (no cuesta JS).
 */
export function cx(...parts: readonly (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
