"use client";

import { lazy } from "react";
import { LazyOnView } from "@/components/shared/LazyOnView";
import { cx } from "@/lib/cx";

/** Islas de densitometría con JS propio (hueso 3D y escala T-score): se descargan al acercarse. */
const BoneDensityExplorer = lazy(() =>
  import("@/components/densitometry/BoneDensityExplorer").then((mod) => ({ default: mod.BoneDensityExplorer })),
);
const TScoreGauge = lazy(() => import("@/components/densitometry/TScoreGauge").then((mod) => ({ default: mod.TScoreGauge })));

const STATE_SLOTS = 3;

interface ExplorerProps {
  className?: string;
}

/** Marcador con las mismas medidas que BoneDensityExplorer (hueso cuadrado + 3 botones + texto). */
function ExplorerPlaceholder({ className }: ExplorerProps) {
  return (
    <div aria-hidden className={cx("rounded-[2rem] border border-line bg-card-solid/70 p-4 shadow-soft sm:p-6", className)}>
      <div className="mx-auto aspect-square w-full max-w-[26rem] rounded-[1.5rem] bg-bg-alt" />
      <div className="mt-4 grid grid-cols-3 gap-2">
        {Array.from({ length: STATE_SLOTS }, (_, index) => (
          <span key={index} className="min-h-12 rounded-full border border-line-strong" />
        ))}
      </div>
      <div className="mt-4 min-h-[3.25rem]" />
    </div>
  );
}

export function BoneDensityExplorerLazy({ className }: ExplorerProps) {
  return (
    <LazyOnView fallback={<ExplorerPlaceholder className={className} />}>
      <BoneDensityExplorer className={className} />
    </LazyOnView>
  );
}

interface GaugeProps {
  compact?: boolean;
  className?: string;
}

/** Marcador del alto aproximado de la escala T-score (compacta o completa). */
function GaugePlaceholder({ compact = false, className }: GaugeProps) {
  return (
    <div
      aria-hidden
      className={cx("rounded-[1.75rem] border border-line bg-card-solid", compact ? "min-h-[20rem]" : "min-h-[26rem]", className)}
    />
  );
}

export function TScoreGaugeLazy({ compact = false, className }: GaugeProps) {
  return (
    <LazyOnView fallback={<GaugePlaceholder compact={compact} className={className} />}>
      <TScoreGauge compact={compact} className={className} />
    </LazyOnView>
  );
}
