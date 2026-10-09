"use client";

import { type Variants } from "motion/react";
import * as m from "motion/react-m";

const LEAD_WORDS = ["Consulta", "con", "un", "reumatólogo", "especialista"] as const;
const ACCENT_WORDS = ["sin", "salir", "de", "casa"] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

/** Sin opacity 0: el h1 cuenta para el LCP desde el primer pintado (ver KineticText `priority`). */
const word: Variants = {
  hidden: { y: "0.45em", filter: "blur(8px)" },
  visible: { y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

interface HeroHeadlineProps {
  id?: string;
}

/** Titular con revelado palabra a palabra (el texto completo queda en el HTML para SEO y lectores de pantalla). */
export function HeroHeadline({ id }: HeroHeadlineProps) {
  return (
    <m.h1
      id={id}
      className="text-display text-heading"
      variants={container}
      initial="hidden"
      animate="visible"
      aria-label="Consulta con un reumatólogo especialista sin salir de casa"
    >
      {LEAD_WORDS.map((w) => (
        <m.span key={w} variants={word} aria-hidden className="mr-[0.24em] inline-block">
          {w}
        </m.span>
      ))}
      {ACCENT_WORDS.map((w) => (
        <m.span
          key={w}
          variants={word}
          aria-hidden
          className="mr-[0.24em] inline-block bg-gradient-to-r from-primary to-video bg-clip-text text-transparent last:mr-0 dark:from-teal"
        >
          {w}
        </m.span>
      ))}
    </m.h1>
  );
}
