import { densitometry } from "@/data/densitometry";
import { cn } from "@/lib/utils";

/** Escala dibujada de +1 a −4 (T-score); las zonas cortan en −1,0 y −2,5. */
const SCALE_MAX = 1;
const SCALE_MIN = -4;
const WIDTH = 320;
const ZONES = [
  { from: 1, to: -1, color: "var(--teal-400)" },
  { from: -1, to: -2.5, color: "var(--aqua-400)" },
  { from: -2.5, to: -4, color: "var(--navy-400)" },
] as const;
const TICKS = [1, -1, -2.5, -4] as const;

const x = (value: number) => ((SCALE_MAX - value) / (SCALE_MAX - SCALE_MIN)) * WIDTH;
const label = (value: number) => (value > 0 ? `+${value}` : String(value).replace("-", "−").replace(".", ","));

interface TScoreScaleProps {
  className?: string;
}

/**
 * Escala T-score estática (servidor, SVG liviano): las 3 zonas de la OMS con su nombre y rango en
 * texto (el color nunca es la única señal) y una línea de barrido que la recorre (CSS, solo transform).
 * La versión interactiva vive en /densitometria-osea.
 */
export function TScoreScale({ className }: TScoreScaleProps) {
  return (
    <figure className={cn("min-w-0", className)}>
      <svg viewBox={`-14 0 ${WIDTH + 28} 62`} className="h-auto w-full" role="img" aria-labelledby="tscore-escala-desc">
        <desc id="tscore-escala-desc">
          Escala T-score: normal de −1,0 o más; osteopenia entre −1,0 y −2,5; osteoporosis de −2,5 o menos.
        </desc>
        {ZONES.map((zone) => (
          <rect key={zone.from} x={x(zone.from)} y="14" width={x(zone.to) - x(zone.from)} height="12" rx="3" fill={zone.color} />
        ))}
        {TICKS.map((tick) => (
          <g key={tick}>
            <line x1={x(tick)} x2={x(tick)} y1="30" y2={Number.isInteger(tick) ? 36 : 40} stroke="currentColor" strokeOpacity="0.55" />
            <text x={x(tick)} y="54" textAnchor="middle" fontSize="14" fill="currentColor" className="font-mono">
              {label(tick)}
            </text>
          </g>
        ))}
        <g className="tscore-sweep">
          <line x1="0" x2="0" y1="6" y2="32" stroke="var(--mist-50)" strokeWidth="2" />
          <circle cx="0" cy="6" r="3" fill="var(--mist-50)" />
        </g>
      </svg>
      <figcaption>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {densitometry.states.map((state, index) => (
            <li key={state.id} className="flex items-start gap-2">
              <span aria-hidden className="mt-1.5 size-3 shrink-0 rounded-sm" style={{ background: ZONES[index].color }} />
              <span>
                <span className="block font-display font-bold text-white">{state.label}</span>
                <span className="data-mono block text-base text-on-navy-subtle">{state.range.replace("T-score ", "")}</span>
              </span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
