"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";
import { useReducedMotionPreference } from "@/lib/motion-preference";

/** El motor de animación viaja en un chunk diferido. */
const loadMotionFeatures = () => import("@/components/layout/motion-features").then((mod) => mod.default);

/**
 * Habilita `motion` (componentes `m.*`) solo dentro de las islas que lo usan. Antes envolvía toda la
 * app desde el layout raíz y motion entraba en el JS inicial de cada página, aunque no animara nada.
 * Respeta prefers-reduced-motion y el interruptor «Reducir animaciones» del pie.
 */
export function MotionScope({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotionPreference();
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>{children}</MotionConfig>
    </LazyMotion>
  );
}
