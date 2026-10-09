"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { cx } from "@/lib/cx";

/** Parte visible necesaria para considerar que el motivo «entró en pantalla». */
const IN_VIEW_THRESHOLD = 0.6;

/** true la primera vez que el elemento entra en pantalla (IntersectionObserver nativo, sin motion). */
function useSeenOnce(ref: RefObject<Element | null>, enabled: boolean): boolean {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!enabled || seen || !element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSeen(true);
        observer.disconnect();
      },
      { threshold: IN_VIEW_THRESHOLD },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, enabled, seen]);
  return seen;
}

type JointMotifMode = "inview" | "hover" | "loop";

interface JointMotifProps {
  /**
   * inview: pasa de inflamación (coral) a alivio (teal) al entrar en pantalla.
   * hover: cambia a alivio cuando el contenedor con la clase `group` recibe hover/foco.
   * loop: alterna suavemente (separadores y estados de carga).
   */
  mode?: JointMotifMode;
  className?: string;
  /** Texto accesible; si se omite, el motivo es decorativo. */
  label?: string;
}

const FEMUR =
  "M80 0H120V68C120 80 140 84 142 99C144 113 128 118 112 114C106 112 94 112 88 114C72 118 56 113 58 99C60 84 80 80 80 68Z";
const TIBIA =
  "M62 133C62 124 80 122 100 124C120 122 138 124 138 133C138 144 124 149 120 157V240H80V157C76 149 62 144 62 133Z";
const CARTILAGE = "M64 119C80 116 92 118 100 119C108 118 120 116 136 119";

const TRANSITION = "transition-opacity duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Firma visual "del dolor al alivio": una rodilla estilizada que pasa de coral a teal. */
export function JointMotif({ mode = "inview", className, label }: JointMotifProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useSeenOnce(ref, mode === "inview");
  const uid = useId().replace(/:/g, "");
  const relieved = mode === "inview" && inView;

  const painClass = cx(
    TRANSITION,
    mode === "inview" && (relieved ? "opacity-0 delay-500" : "opacity-100"),
    mode === "hover" && "opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0",
    mode === "loop" && "joint-swap",
  );
  const reliefClass = cx(
    TRANSITION,
    mode === "inview" && (relieved ? "opacity-100 delay-500" : "opacity-0"),
    mode === "hover" && "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
    mode === "loop" && "joint-swap joint-swap-reverse",
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 240"
      className={cx("overflow-visible", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <radialGradient id={`pain-${uid}`}>
          <stop offset="0%" stopColor="var(--coral)" stopOpacity="0.55" />
          <stop offset="70%" stopColor="var(--coral)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--coral)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`relief-${uid}`}>
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.45" />
          <stop offset="70%" stopColor="var(--teal)" stopOpacity="0.07" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Halo de inflamación (coral) con pulso */}
      <g className={painClass}>
        <circle cx="100" cy="118" r="88" fill={`url(#pain-${uid})`} />
        <circle cx="100" cy="118" r="46" fill="none" stroke="var(--coral)" strokeWidth="2" className="joint-pulse" />
        <circle cx="52" cy="92" r="3" fill="var(--coral)" />
        <circle cx="150" cy="142" r="2.5" fill="var(--coral)" />
        <circle cx="146" cy="84" r="2" fill="var(--coral)" />
      </g>

      {/* Halo de alivio (teal) */}
      <g className={reliefClass}>
        <circle cx="100" cy="118" r="88" fill={`url(#relief-${uid})`} />
        <circle cx="100" cy="118" r="56" fill="none" stroke="var(--teal)" strokeOpacity="0.35" strokeWidth="1.5" />
      </g>

      {/* Huesos */}
      <path d={FEMUR} fill="var(--joint-bone)" stroke="var(--joint-bone-stroke)" strokeWidth="2" />
      <path d={TIBIA} fill="var(--joint-bone)" stroke="var(--joint-bone-stroke)" strokeWidth="2" />
      <ellipse cx="150" cy="108" rx="8" ry="14" fill="var(--joint-bone)" stroke="var(--joint-bone-stroke)" strokeWidth="2" />

      {/* Cartílago: coral (inflamado) → teal (sano) */}
      <path d={CARTILAGE} fill="none" stroke="var(--coral)" strokeWidth="5" strokeLinecap="round" className={painClass} />
      <path d={CARTILAGE} fill="none" stroke="var(--teal)" strokeWidth="5" strokeLinecap="round" className={reliefClass} />
    </svg>
  );
}
