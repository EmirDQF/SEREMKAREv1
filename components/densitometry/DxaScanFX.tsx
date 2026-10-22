import { densitometry } from "@/data/densitometry";
import { cn } from "@/lib/utils";

const VERTEBRAE = ["L1", "L2", "L3", "L4"] as const;

interface DxaScanFXProps {
  className?: string;
  /** Prefijo de ids del SVG (único si hay dos ilustraciones en la misma página). */
  idPrefix?: string;
}

/**
 * Ilustración del estudio: persona recostada en la camilla y el brazo del densitómetro barriendo con
 * una línea láser sobre la columna lumbar y la cadera (capa estilo rayos X).
 * Componente de servidor: el barrido es una animación CSS (`.dxa-arm` en globals.css), solo transform;
 * con movimiento reducido el brazo queda quieto al final del recorrido.
 */
export function DxaScanFX({ className, idPrefix = "dxa" }: DxaScanFXProps) {
  const uid = idPrefix;
  return (
    <div className={cn("scan-panel relative overflow-hidden rounded-[2rem] p-4 shadow-lift sm:p-6", className)}>
      <div aria-hidden className="aurora opacity-80" />
      <div aria-hidden className="scan-grid" />
      <svg
        viewBox="22 26 358 196"
        role="img"
        aria-label="Persona recostada en la camilla mientras el brazo del densitómetro pasa por encima, sin tocarla, y mide la columna lumbar y la cadera"
        className="relative h-auto w-full"
      >
        <defs>
          <linearGradient id={`beam-${uid}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--teal-300)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--teal-300)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Camilla */}
        <rect x="30" y="172" width="340" height="12" rx="6" fill="var(--navy-700)" />
        <rect x="70" y="184" width="8" height="34" rx="3" fill="var(--navy-700)" />
        <rect x="322" y="184" width="8" height="34" rx="3" fill="var(--navy-700)" />

        {/* Persona recostada */}
        <g fill="var(--mist-300)" fillOpacity="0.9">
          <circle cx="62" cy="152" r="16" />
          <path d="M80 140 Q86 132 110 134 L246 136 Q262 138 264 152 Q262 168 246 169 L110 170 Q86 171 80 162 Z" />
          <path d="M262 140 L366 146 Q374 151 366 158 L262 166 Z" />
        </g>

        {/* Capa de rayos X: columna lumbar y cadera (lo que mide el estudio) */}
        <g>
          <path
            d="M80 140 Q86 132 110 134 L246 136 Q262 138 264 152 Q262 168 246 169 L110 170 Q86 171 80 162 Z M262 140 L366 146 Q374 151 366 158 L262 166 Z"
            fill="var(--navy-950)"
            fillOpacity="0.82"
          />
          {VERTEBRAE.map((label, index) => (
            <g key={label}>
              <rect x={152 + index * 19} y="145" width="15" height="13" rx="3" fill="var(--teal-300)" fillOpacity="0.85" />
              <text x={159.5 + index * 19} y="140" textAnchor="middle" fontSize="7" fill="var(--teal-200)" className="font-mono">
                {label}
              </text>
            </g>
          ))}
          <path d="M232 142 Q246 136 256 146 Q258 158 246 164 Q236 162 232 152 Z" fill="var(--teal-300)" fillOpacity="0.55" />
          <circle cx="262" cy="151" r="6" fill="var(--teal-300)" fillOpacity="0.85" />
          <path d="M266 150 L330 152" stroke="var(--teal-300)" strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* Brazo del densitómetro con la línea láser */}
        <g className="dxa-arm">
          <rect x="-3" y="34" width="6" height="74" rx="3" fill="var(--aqua-300)" fillOpacity="0.5" />
          <rect x="-22" y="104" width="44" height="14" rx="5" fill="var(--mist-100)" />
          <polygon points="-16,118 16,118 7,170 -7,170" fill={`url(#beam-${uid})`} />
          <line x1="0" y1="118" x2="0" y2="172" stroke="var(--teal-400)" strokeWidth="2" />
          <circle cx="0" cy="111" r="2.5" fill="var(--teal-500)" />
        </g>
      </svg>
      <ul aria-label="Datos del estudio" className="relative mt-3 flex flex-wrap justify-center gap-2 font-mono text-sm text-teal-200">
        {densitometry.hud.map((item) => (
          <li key={item} className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
