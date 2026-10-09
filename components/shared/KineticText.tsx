"use client";

import { Fragment } from "react";
import { type Variants } from "motion/react";
import * as m from "motion/react-m";
import { splitKineticWords } from "@/lib/kinetic";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};

/**
 * Títulos sobre el pliegue (h1): sin partir de opacity 0, porque Chrome no cuenta el texto invisible
 * como pintado y el LCP se retrasaba hasta el final de la animación (~1 s). El texto nace desenfocado.
 */
const priorityWord: Variants = {
  hidden: { y: "0.35em", filter: "blur(8px)" },
  visible: { y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};

const VIEWPORT = { once: true, amount: 0.6 } as const;

interface KineticTextProps {
  text: string;
  /** Frase contenida en `text` que se pinta con el gradiente teal animado. */
  accent?: string;
  /** inverted: gradiente claro para fondos navy. */
  tone?: "default" | "inverted";
  className?: string;
  /** Título visible al cargar (h1 de cabecera): anima al montar y no retrasa el LCP. */
  priority?: boolean;
}

/**
 * Tipografía cinética: las palabras entran con blur escalonado al aparecer en pantalla.
 * El texto completo queda en el HTML (SEO y lectores de pantalla); sin JS se ve igual (noscript en layout).
 */
export function KineticText({ text, accent, tone = "default", className, priority = false }: KineticTextProps) {
  const words = splitKineticWords(text, accent);
  const accentClass = tone === "inverted" ? "text-gradient-teal-light" : "text-gradient-teal";

  return (
    <m.span
      data-kinetic
      className={className}
      variants={container}
      initial="hidden"
      {...(priority ? { animate: "visible" } : { whileInView: "visible", viewport: VIEWPORT })}
    >
      {words.map((item, index) => (
        <Fragment key={`${item.word}-${index}`}>
          <m.span variants={priority ? priorityWord : word} className={cn("inline-block", item.accent && accentClass)}>
            {item.word}
          </m.span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </m.span>
  );
}
