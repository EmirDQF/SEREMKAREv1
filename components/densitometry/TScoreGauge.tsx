"use client";

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { densitometry } from "@/data/densitometry";
import {
  SCORE_MAX,
  SCORE_MIN,
  classifyTScore,
  classifyZScore,
  formatScore,
  percentToScore,
  scoreToPercent,
  stepScore,
} from "@/lib/densitometry";
import { cn } from "@/lib/utils";

type ScoreMode = "t" | "z";

const INITIAL_SCORE = -1.8;
const PAGE_STEPS = 5;

interface Zone {
  from: number;
  to: number;
  className: string;
}

const T_ZONES: readonly Zone[] = [
  { from: SCORE_MIN, to: -2.5, className: "bg-coral" },
  { from: -2.5, to: -1, className: "bg-[#e9a23b]" },
  { from: -1, to: SCORE_MAX, className: "bg-teal" },
];
const Z_ZONES: readonly Zone[] = [
  { from: SCORE_MIN, to: -2, className: "bg-coral" },
  { from: -2, to: SCORE_MAX, className: "bg-teal" },
];
const T_TICKS = [-4, -2.5, -1, 0, 2] as const;
const Z_TICKS = [-4, -2, 0, 2] as const;

interface Reading {
  label: string;
  explanation: string;
  tone: string;
}

function readingFor(mode: ScoreMode, score: number): Reading {
  if (mode === "z") {
    const below = classifyZScore(score) === "below-expected";
    return below
      ? { label: "Por debajo de lo esperado para tu edad", explanation: densitometry.zScore.explanation, tone: "text-coral" }
      : {
          label: "Dentro de lo esperado para tu edad",
          explanation: "Tu densidad ósea está en el rango esperado para personas de tu edad.",
          tone: "text-primary",
        };
  }
  const category = classifyTScore(score);
  const state = densitometry.states.find((item) => item.id === category) ?? densitometry.states[0];
  const tone = category === "normal" ? "text-primary" : category === "osteopenia" ? "text-[#955a0c] dark:text-[#f2b65a]" : "text-coral";
  return { label: state.label, explanation: state.explanation, tone };
}

interface TScoreGaugeProps {
  /** Versión reducida para la Home (sin interruptor T/Z ni notas). */
  compact?: boolean;
  className?: string;
}

/** Escala interactiva del resultado de la densitometría (criterios de la OMS). Solo orienta. */
export function TScoreGauge({ compact = false, className }: TScoreGaugeProps) {
  const id = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ScoreMode>("t");
  const [score, setScore] = useState(INITIAL_SCORE);
  const reading = readingFor(mode, score);
  const zones = mode === "t" ? T_ZONES : Z_ZONES;
  const ticks = mode === "t" ? T_TICKS : Z_TICKS;
  const name = mode === "t" ? "T-score" : "Z-score";

  function scoreFromPointer(clientX: number): number {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return score;
    return percentToScore((clientX - rect.left) / rect.width);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setScore(scoreFromPointer(event.clientX));
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    setScore(scoreFromPointer(event.clientX));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const actions: Record<string, () => number> = {
      ArrowRight: () => stepScore(score, 1),
      ArrowUp: () => stepScore(score, 1),
      ArrowLeft: () => stepScore(score, -1),
      ArrowDown: () => stepScore(score, -1),
      PageUp: () => stepScore(score, PAGE_STEPS),
      PageDown: () => stepScore(score, -PAGE_STEPS),
      Home: () => SCORE_MIN,
      End: () => SCORE_MAX,
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    setScore(action());
  }

  return (
    <div className={cn("rounded-[1.75rem] border border-line bg-card-solid p-5 shadow-soft sm:p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p id={`${id}-label`} className="font-display font-semibold text-heading">
          Prueba la escala: mueve el marcador
        </p>
        {compact ? null : (
          <div role="group" aria-label="Tipo de puntaje" className="inline-flex rounded-full border border-line bg-bg-alt p-1">
            {(["t", "z"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={mode === option}
                onClick={() => setMode(option)}
                className={cn(
                  "min-h-12 rounded-full px-4 font-display text-sm font-semibold transition-colors",
                  mode === option ? "bg-navy text-white dark:bg-teal dark:text-navy" : "text-muted hover:text-heading",
                )}
              >
                {option === "t" ? "T-score" : "Z-score"}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="relative mt-8 h-12 cursor-pointer touch-none select-none"
      >
        <div className="absolute inset-x-0 top-1/2 flex h-3 -translate-y-1/2 overflow-hidden rounded-full">
          {zones.map((zone) => (
            <span
              key={zone.from}
              className={cn("h-full opacity-85", zone.className)}
              style={{ width: `${scoreToPercent(zone.to) - scoreToPercent(zone.from)}%` }}
            />
          ))}
        </div>
        <div
          role="slider"
          tabIndex={0}
          aria-labelledby={`${id}-label`}
          aria-valuemin={SCORE_MIN}
          aria-valuemax={SCORE_MAX}
          aria-valuenow={score}
          aria-valuetext={`${name} ${formatScore(score)}: ${reading.label}`}
          onKeyDown={handleKeyDown}
          className="absolute top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
          style={{ left: `${scoreToPercent(score)}%` }}
        >
          <span aria-hidden className="size-7 rounded-full border-4 border-white bg-navy shadow-lift transition-transform dark:bg-teal" />
        </div>
      </div>
      <div aria-hidden className="relative mt-1 h-5 font-mono text-xs text-subtle">
        {ticks.map((tick) => (
          <span key={tick} className="absolute -translate-x-1/2" style={{ left: `${scoreToPercent(tick)}%` }}>
            {formatScore(tick)}
          </span>
        ))}
      </div>

      <div aria-live="polite" className="mt-5 rounded-2xl bg-bg-alt p-4">
        <p className="font-display text-lg font-bold text-heading">
          {name} {formatScore(score)} · <span className={reading.tone}>{reading.label}</span>
        </p>
        <p className="mt-1 text-base text-fg">{reading.explanation}</p>
      </div>
      {compact ? null : (
        <p className="mt-3 text-sm text-muted">{mode === "t" ? densitometry.tScoreNote : densitometry.zScore.note}</p>
      )}
      <p className="mt-2 text-sm text-muted">{densitometry.interpretationNote}</p>
    </div>
  );
}
