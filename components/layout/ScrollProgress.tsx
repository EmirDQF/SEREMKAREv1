"use client";

import { useScroll } from "motion/react";
import * as m from "motion/react-m";

/** Barra fina de progreso de lectura (teal) en el borde superior de la ventana. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <m.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[65] h-[3px] origin-left bg-gradient-to-r from-teal via-teal to-video-glow"
    />
  );
}
