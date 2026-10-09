"use client";

import * as m from "motion/react-m";
import { CheckCircle2 } from "lucide-react";

const PARTICLES = 10;
const RINGS = [0, 0.18, 0.36] as const;

/** Micro-celebración teal al enviar: check con resorte, anillos que se expanden y chispas. */
export function SuccessBurst() {
  return (
    <span aria-hidden className="relative mx-auto grid size-24 place-items-center">
      {RINGS.map((delay) => (
        <m.span
          key={delay}
          className="absolute inset-0 rounded-full border-2 border-teal"
          initial={{ scale: 0.4, opacity: 0.8 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      {Array.from({ length: PARTICLES }, (_, index) => {
        const angle = (index / PARTICLES) * Math.PI * 2;
        return (
          <m.span
            key={index}
            className="absolute size-1.5 rounded-full bg-teal"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(angle) * 64, y: Math.sin(angle) * 64, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
          />
        );
      })}
      <m.span
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 14 }}
        className="relative"
      >
        <CheckCircle2 strokeWidth={1.5} className="size-16 text-primary" />
      </m.span>
    </span>
  );
}
