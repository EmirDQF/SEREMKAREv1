"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";

const WAVES = 6;
const WIDTH = 1440;
const HEIGHT = 220;
const SEGMENTS = 24;

function wavePath(index: number, phase: number, lift: number): string {
  const baseY = 40 + index * 30;
  const amplitude = 10 + index * 3 + lift * 18;
  const points: string[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const x = (i / SEGMENTS) * WIDTH;
    const y = baseY + Math.sin((i / SEGMENTS) * Math.PI * 2 * 1.4 + phase + index * 0.7) * amplitude;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}

interface WaveProps {
  index: number;
  phase: MotionValue<number>;
  lift: MotionValue<number>;
}

function Wave({ index, phase, lift }: WaveProps) {
  const d = useTransform([phase, lift], ([p, l]) => wavePath(index, p as number, l as number));
  return <m.path d={d} fill="none" stroke="#2dd4bf" strokeOpacity={0.12 + index * 0.025} strokeWidth="1.2" />;
}

/**
 * Malla de ondas navy muy tenue detrás del contenido del footer: el mouse sobre el footer
 * desplaza la fase y la amplitud con un resorte. Decorativa; no captura eventos.
 */
export function FooterWaves() {
  const ref = useRef<SVGSVGElement>(null);
  const phase = useSpring(useMotionValue(0), { stiffness: 40, damping: 14 });
  const lift = useSpring(useMotionValue(0), { stiffness: 60, damping: 16 });

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      phase.set(((event.clientX - rect.left) / rect.width) * Math.PI * 2);
      lift.set(1 - Math.min(1, Math.abs(event.clientY - rect.top) / (HEIGHT * 1.5)));
    };
    const handleLeave = () => lift.set(0);
    host.addEventListener("pointermove", handleMove);
    host.addEventListener("pointerleave", handleLeave);
    return () => {
      host.removeEventListener("pointermove", handleMove);
      host.removeEventListener("pointerleave", handleLeave);
    };
  }, [phase, lift]);

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 w-full"
    >
      {Array.from({ length: WAVES }, (_, index) => (
        <Wave key={index} index={index} phase={phase} lift={lift} />
      ))}
    </svg>
  );
}
