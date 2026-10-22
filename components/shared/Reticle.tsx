import { cn } from "@/lib/utils";

interface ReticleProps {
  className?: string;
}

const CENTER = 100;
const OUTER = 94;
const TICK_COUNT = 36;

/** Marcas de escala del anillo exterior en un solo trazado (un nodo SVG en lugar de 36 <line>). */
const TICKS_PATH = Array.from({ length: TICK_COUNT }, (_, index) => {
  const angle = (index * 2 * Math.PI) / TICK_COUNT;
  const length = index % 3 === 0 ? 10 : 5;
  const [sin, cos] = [Math.sin(angle), Math.cos(angle)];
  const point = (radius: number) => `${(CENTER + radius * sin).toFixed(1)} ${(CENTER - radius * cos).toFixed(1)}`;
  return `M${point(OUTER)}L${point(OUTER - length)}`;
}).join("");

/**
 * Retícula de medición (motivo «escáner»): anillos concéntricos, marcas de escala y cruz central,
 * como el visor de un densitómetro. Decorativa, trazo fino en `currentColor` (opacidad baja en uso).
 * Componente de servidor, sin animación; 5 nodos SVG en total.
 */
export function Reticle({ className }: ReticleProps) {
  return (
    <svg aria-hidden viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.75" className={cn("shrink-0", className)}>
      <circle cx={CENTER} cy={CENTER} r="96" />
      <circle cx={CENTER} cy={CENTER} r="72" strokeDasharray="2 4" />
      <circle cx={CENTER} cy={CENTER} r="40" />
      <path d={`M100 0v36M100 164v36M0 100h36M164 100h36M97 100a3 3 0 1 0 6 0a3 3 0 1 0-6 0${TICKS_PATH}`} />
    </svg>
  );
}
