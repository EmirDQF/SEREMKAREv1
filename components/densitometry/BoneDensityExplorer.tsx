"use client";

import { useMemo, useState } from "react";
import { Scene3DSlot } from "@/components/3d/Scene3DSlot";
import { densitometry } from "@/data/densitometry";
import { createRandom } from "@/lib/prng";
import { cn } from "@/lib/utils";
import type { BoneDensityLevel } from "@/types/medical";

/* ---------- Fallback 2D: corte de hueso con poros (sin WebGL o mientras carga) ---------- */

const PORE_SEED = 5;
const PORE_GRID = 9;
const PORE_RADIUS: Record<BoneDensityLevel, number> = { normal: 2.2, osteopenia: 4.2, osteoporosis: 6.4 };
const LEVEL_TONE: Record<BoneDensityLevel, string> = {
  normal: "var(--teal)",
  osteopenia: "#e9a23b",
  osteoporosis: "var(--coral)",
};

const PORES = (() => {
  const random = createRandom(PORE_SEED);
  const step = 100 / (PORE_GRID + 1);
  const pores: { x: number; y: number; scale: number }[] = [];
  for (let i = 1; i <= PORE_GRID; i++) {
    for (let j = 1; j <= PORE_GRID; j++) {
      const x = i * step + (random() - 0.5) * step * 0.5;
      const y = j * step + (random() - 0.5) * step * 0.5;
      if (Math.hypot(x - 50, y - 50) < 38) pores.push({ x, y, scale: 0.7 + random() * 0.6 });
    }
  }
  return pores;
})();

function BoneSectionFallback({ level }: { level: BoneDensityLevel }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className="mx-auto size-[78%] drop-shadow-xl">
      <circle cx="50" cy="50" r="46" fill="var(--joint-bone)" stroke="var(--joint-bone-stroke)" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="41" fill="none" stroke={LEVEL_TONE[level]} strokeOpacity="0.5" strokeWidth="1" />
      {PORES.map((pore) => (
        <circle
          key={`${pore.x}-${pore.y}`}
          cx={pore.x}
          cy={pore.y}
          r={PORE_RADIUS[level] * pore.scale}
          fill="var(--background)"
          stroke={LEVEL_TONE[level]}
          strokeOpacity="0.55"
          strokeWidth="0.6"
          className="transition-[r] duration-700"
        />
      ))}
    </svg>
  );
}

/* ---------- Explorador ---------- */

const STATE_ACTIVE: Record<BoneDensityLevel, string> = {
  normal: "border-transparent bg-teal text-navy",
  osteopenia: "border-transparent bg-[#e9a23b] text-navy",
  osteoporosis: "border-transparent bg-coral text-navy",
};

interface BoneDensityExplorerProps {
  className?: string;
}

/**
 * Corte 3D de hueso trabecular con un selector Normal / Osteopenia / Osteoporosis.
 * Cada estado transforma la estructura en vivo y muestra su explicación en una frase.
 */
export function BoneDensityExplorer({ className }: BoneDensityExplorerProps) {
  const [level, setLevel] = useState<BoneDensityLevel>("normal");
  const sceneProps = useMemo(() => ({ level }), [level]);
  const current = densitometry.states.find((state) => state.id === level) ?? densitometry.states[0];

  return (
    <div className={cn("rounded-[2rem] border border-line bg-card-solid/70 p-4 shadow-soft backdrop-blur sm:p-6", className)}>
      <Scene3DSlot
        scene="bone"
        sceneProps={sceneProps}
        className="mx-auto aspect-square w-full max-w-[26rem]"
        fallback={
          <div className="grid size-full place-items-center">
            <BoneSectionFallback level={level} />
          </div>
        }
      />
      <div role="group" aria-label="Estado del hueso" className="mt-4 grid grid-cols-3 gap-2">
        {densitometry.states.map((state) => {
          const active = state.id === level;
          return (
            <button
              key={state.id}
              type="button"
              aria-pressed={active}
              onClick={() => setLevel(state.id)}
              className={cn(
                "min-h-12 rounded-full border px-2 font-display text-base font-semibold transition-colors sm:px-4",
                active ? STATE_ACTIVE[state.id] : "border-line-strong bg-card-solid text-heading hover:border-primary hover:text-primary",
              )}
            >
              {state.label}
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="mt-4 min-h-[3.25rem] text-center text-base text-fg">
        <span className="font-display font-semibold text-heading">{current.range}: </span>
        {current.explanation}
      </p>
    </div>
  );
}
