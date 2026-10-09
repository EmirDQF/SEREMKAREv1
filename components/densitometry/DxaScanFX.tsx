"use client";

import type { ComponentProps } from "react";
import { MotionScope } from "@/components/layout/MotionScope";

import { useEffect, useId, useRef } from "react";
import { animate, useInView, useMotionValue, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { densitometry } from "@/data/densitometry";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

/** Recorrido del brazo del equipo sobre la camilla (coordenadas del dibujo; el viewBox recorta los márgenes vacíos). */
const SCAN_START = 92;
const SCAN_END = 330;
const BODY_LEFT = 78;
const SCAN_SECONDS = 4.5;
const VERTEBRAE = ["L1", "L2", "L3", "L4"] as const;

interface DxaScanFXProps {
  className?: string;
}

/**
 * Ilustración del estudio: persona recostada en la camilla y el brazo del densitómetro
 * barriendo con una línea láser; a su paso se revela (estilo rayos X) la columna lumbar y la cadera.
 */
function DxaScanFXContent({ className }: DxaScanFXProps) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduceMotion = useReducedMotionPreference() !== false;
  const armX = useMotionValue(SCAN_END);
  const revealWidth = useTransform(armX, (x) => Math.max(0, x - BODY_LEFT));

  useEffect(() => {
    if (reduceMotion || !inView) {
      armX.set(SCAN_END);
      return;
    }
    const controls = animate(armX, [SCAN_START, SCAN_END], {
      duration: SCAN_SECONDS,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [armX, inView, reduceMotion]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden rounded-[2rem] bg-navy p-4 shadow-lift sm:p-6 dark:bg-[#071222]", className)}>
      <div aria-hidden className="immersive-glow opacity-70" />
      <svg
        viewBox="22 26 358 196"
        role="img"
        aria-label="Persona recostada en la camilla mientras el brazo del densitómetro pasa por encima, sin tocarla, y mide la columna lumbar y la cadera"
        className="relative h-auto w-full"
      >
        <defs>
          <clipPath id={`reveal-${uid}`}>
            <m.rect x={BODY_LEFT} y="100" height="90" width={revealWidth} />
          </clipPath>
          <linearGradient id={`beam-${uid}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Camilla */}
        <rect x="30" y="172" width="340" height="12" rx="6" fill="#1e3e62" />
        <rect x="70" y="184" width="8" height="34" rx="3" fill="#1e3e62" />
        <rect x="322" y="184" width="8" height="34" rx="3" fill="#1e3e62" />

        {/* Persona recostada */}
        <g fill="#c9d6e3" fillOpacity="0.9">
          <circle cx="62" cy="152" r="16" />
          <path d="M80 140 Q86 132 110 134 L246 136 Q262 138 264 152 Q262 168 246 169 L110 170 Q86 171 80 162 Z" />
          <path d="M262 140 L366 146 Q374 151 366 158 L262 166 Z" />
        </g>

        {/* Capa "rayos X" revelada por el barrido */}
        <g clipPath={`url(#reveal-${uid})`}>
          <path
            d="M80 140 Q86 132 110 134 L246 136 Q262 138 264 152 Q262 168 246 169 L110 170 Q86 171 80 162 Z M262 140 L366 146 Q374 151 366 158 L262 166 Z"
            fill="#0b192c"
            fillOpacity="0.82"
          />
          {VERTEBRAE.map((label, index) => (
            <g key={label}>
              <rect x={152 + index * 19} y="145" width="15" height="13" rx="3" fill="#5eead4" fillOpacity="0.85" />
              <text x={159.5 + index * 19} y="140" textAnchor="middle" fontSize="7" fill="#99f6e4" fontFamily="monospace">
                {label}
              </text>
            </g>
          ))}
          <path d="M232 142 Q246 136 256 146 Q258 158 246 164 Q236 162 232 152 Z" fill="#5eead4" fillOpacity="0.55" />
          <circle cx="262" cy="151" r="6" fill="#5eead4" fillOpacity="0.85" />
          <path d="M266 150 L330 152" stroke="#5eead4" strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* Brazo del densitómetro con la línea láser */}
        <m.g style={{ x: armX }}>
          <rect x="-3" y="34" width="6" height="74" rx="3" fill="#7dd3fc" fillOpacity="0.5" />
          <rect x="-22" y="104" width="44" height="14" rx="5" fill="#e6edf5" />
          <polygon points="-16,118 16,118 7,170 -7,170" fill={`url(#beam-${uid})`} />
          <line x1="0" y1="118" x2="0" y2="172" stroke="#2dd4bf" strokeWidth="2" />
          <circle cx="0" cy="111" r="2.5" fill="#00a896" />
        </m.g>
      </svg>
      <ul aria-label="Datos del estudio" className="relative mt-3 flex flex-wrap justify-center gap-2 font-mono text-xs text-teal-200">
        {densitometry.hud.map((item) => (
          <li key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Con su propio MotionScope: motion solo se carga donde se usa (no en el layout raíz). */
export function DxaScanFX(props: ComponentProps<typeof DxaScanFXContent>) {
  return (
    <MotionScope>
      <DxaScanFXContent {...props} />
    </MotionScope>
  );
}
