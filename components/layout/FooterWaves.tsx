const WAVES = 6;
const WIDTH = 1440;
const HEIGHT = 220;
const SEGMENTS = 24;

function wavePath(index: number): string {
  const baseY = 40 + index * 30;
  const amplitude = 10 + index * 3;
  const points: string[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const x = (i / SEGMENTS) * WIDTH;
    const y = baseY + Math.sin((i / SEGMENTS) * Math.PI * 2 * 1.4 + index * 0.7) * amplitude;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}

/**
 * Malla de ondas muy tenue detrás del contenido del pie. SVG estático generado en el servidor:
 * antes reaccionaba al mouse con motion (JS en todas las páginas). Decorativa; no captura eventos.
 */
export function FooterWaves() {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 w-full"
    >
      {Array.from({ length: WAVES }, (_, index) => (
        <path key={index} d={wavePath(index)} fill="none" stroke="#2dd4bf" strokeOpacity={0.12 + index * 0.025} strokeWidth="1.2" />
      ))}
    </svg>
  );
}
