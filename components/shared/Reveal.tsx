"use client";

import type { ReactNode } from "react";
import { type Transition, type Variants } from "motion/react";
import * as m from "motion/react-m";

const EASE = [0.22, 1, 0.36, 1] as const;
const RISE_PX = 24;

/**
 * Se dispara un poco antes de que el bloque entre en pantalla (margen inferior positivo)
 * y con poca superficie visible: el contenido nunca queda invisible mientras se lee.
 */
const VIEWPORT = { once: true, amount: 0.15, margin: "0px 0px 12% 0px" } as const;

/** Física amortiguada para el desplazamiento; la opacidad entra con una curva corta. */
const SPRING: Transition = { type: "spring", stiffness: 100, damping: 20 };

function entrance(delay = 0): Transition {
  return {
    y: { ...SPRING, delay },
    scale: { ...SPRING, delay },
    rotateX: { ...SPRING, delay },
    opacity: { duration: 0.45, ease: EASE, delay },
  };
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article";
}

/** Entrada suave (opacidad + desplazamiento) al entrar en pantalla. Sin JS se ve igual (noscript en layout). */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Component = m[as];
  return (
    <Component
      data-reveal
      className={className}
      initial={{ opacity: 0, y: RISE_PX }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={entrance(delay)}
    >
      {children}
    </Component>
  );
}

const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: RISE_PX },
  visible: { opacity: 1, y: 0, transition: entrance() },
};

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
}

/** Contenedor que escalona la entrada de sus `RevealItem`. */
export function RevealGroup({ children, className, as = "div" }: RevealGroupProps) {
  const Component = m[as];
  return (
    <Component className={className} variants={groupVariants} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
      {children}
    </Component>
  );
}

/** Entrada "desde la profundidad" (eje Z): la tarjeta viene del fondo con una leve inclinación. */
const depthItemVariants: Variants = {
  hidden: { opacity: 0, y: RISE_PX * 1.5, scale: 0.92, rotateX: 14, transformPerspective: 900 },
  visible: { opacity: 1, y: 0, scale: 1, rotateX: 0, transformPerspective: 900, transition: entrance() },
};

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
  /** Entra desde el fondo (eje Z) en lugar de subir. */
  depth?: boolean;
}

export function RevealItem({ children, className, as = "div", depth = false }: RevealItemProps) {
  const Component = m[as];
  return (
    <Component data-reveal className={className} variants={depth ? depthItemVariants : itemVariants}>
      {children}
    </Component>
  );
}
