"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useMotionValue } from "motion/react";
import { Scene3DSlot } from "@/components/3d/Scene3DSlot";
import type { MicroVariant } from "@/lib/micro-variants";
import { cn } from "@/lib/utils";

interface MicroIconProps {
  variant: MicroVariant;
  /** Icono plano actual: se ve sin WebGL y mientras carga el 3D. */
  fallback: ReactNode;
  className?: string;
}

/**
 * Icono 3D de cristal (Nivel 2) para tarjetas. Se "enciende" con el hover o el foco del
 * contenedor más cercano marcado con `data-micro-host` (toda la tarjeta, no solo el icono).
 */
export function MicroIcon3D({ variant, fallback, className }: MicroIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const energy = useMotionValue(0);
  const sceneProps = useMemo(() => ({ variant, energy }), [variant, energy]);

  useEffect(() => {
    const host = ref.current?.closest<HTMLElement>("[data-micro-host]") ?? ref.current;
    if (!host) return;
    const activate = () => energy.set(1);
    const rest = () => energy.set(0);
    host.addEventListener("pointerenter", activate);
    host.addEventListener("pointerleave", rest);
    host.addEventListener("focusin", activate);
    host.addEventListener("focusout", rest);
    return () => {
      host.removeEventListener("pointerenter", activate);
      host.removeEventListener("pointerleave", rest);
      host.removeEventListener("focusin", activate);
      host.removeEventListener("focusout", rest);
    };
  }, [energy]);

  return (
    <div ref={ref} className={cn("shrink-0", className)}>
      <Scene3DSlot
        scene="micro"
        sceneProps={sceneProps}
        className="size-full"
        fallback={<div className="grid size-full place-items-center">{fallback}</div>}
      />
    </div>
  );
}
