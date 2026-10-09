"use client";

import { useEffect, type ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";
import { pickDeviceTier, readTierSignals } from "@/lib/device-tier";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const HEADER_OFFSET_PX = -96;

/** El motor de animación viaja en un chunk diferido: no suma al JS inicial. */
const loadMotionFeatures = () => import("@/components/layout/motion-features").then((mod) => mod.default);

interface ProvidersProps {
  children: ReactNode;
}

/** Scroll suave solo en escritorio con puntero fino y equipo capaz (nunca en táctil ni gama baja). */
function wantsSmoothScroll(): boolean {
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  return finePointer && pickDeviceTier(readTierSignals()) !== "low";
}

/**
 * Smooth scroll (Lenis, cargado bajo demanda) y preferencias de movimiento para toda la app.
 * Respeta prefers-reduced-motion y el interruptor "Reducir animaciones" del footer.
 */
export function Providers({ children }: ProvidersProps) {
  const reduceMotion = useReducedMotionPreference();

  useEffect(() => {
    if (reduceMotion !== false || !wantsSmoothScroll()) return;
    let destroy = () => {};
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({
        autoRaf: true,
        lerp: 0.12,
        anchors: { offset: HEADER_OFFSET_PX },
        prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
      });
      destroy = () => lenis.destroy();
    });
    return () => {
      cancelled = true;
      destroy();
    };
  }, [reduceMotion]);

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>{children}</MotionConfig>
    </LazyMotion>
  );
}
