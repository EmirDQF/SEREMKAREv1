"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { useMotionValue, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

const TILT_SPRING = { stiffness: 150, damping: 18, mass: 0.6 };

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Inclinación máxima en grados (6° por defecto: elegante, nunca mareante). */
  maxTilt?: number;
  /** Brillo holográfico que sigue al cursor. */
  sheen?: boolean;
}

/**
 * Inclinación 3D que sigue al mouse (no al tacto) con resorte amortiguado. Expone
 * --tilt-x / --tilt-y (-1..1) para parallax interno y --sheen-x / --sheen-y para el brillo.
 * Sin efecto con movimiento reducido.
 */
export function TiltCard({ children, className, maxTilt = 6, sheen = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotionPreference() !== false;
  const rotateX = useSpring(useMotionValue(0), TILT_SPRING);
  const rotateY = useSpring(useMotionValue(0), TILT_SPRING);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node || reduceMotion || event.pointerType !== "mouse") return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    rotateY.set((x - 0.5) * 2 * maxTilt);
    rotateX.set(-(y - 0.5) * 2 * maxTilt);
    node.style.setProperty("--tilt-x", ((x - 0.5) * 2).toFixed(3));
    node.style.setProperty("--tilt-y", ((y - 0.5) * 2).toFixed(3));
    node.style.setProperty("--sheen-x", `${x * 100}%`);
    node.style.setProperty("--sheen-y", `${y * 100}%`);
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
    ref.current?.style.setProperty("--tilt-x", "0");
    ref.current?.style.setProperty("--tilt-y", "0");
  }

  return (
    <m.div
      ref={ref}
      data-micro-host
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={cn("group/tilt relative [transform-style:preserve-3d]", className)}
    >
      {children}
      {sheen ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover/tilt:opacity-100 bg-[radial-gradient(380px_circle_at_var(--sheen-x,50%)_var(--sheen-y,50%),rgb(255_255_255/0.55),rgb(125_211_252/0.25)_35%,transparent_65%)]"
        />
      ) : null}
    </m.div>
  );
}
