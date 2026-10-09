"use client";

import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { pickDeviceTier, readTierSignals } from "@/lib/device-tier";
import type { MicroVariant } from "@/lib/micro-variants";
import { cx } from "@/lib/cx";

/** motion + la escena 3D viajan en otro chunk: en teléfonos y gama baja nunca se descargan. */
const MicroIcon3D = lazy(() => import("@/components/3d/MicroIcon3D").then((mod) => ({ default: mod.MicroIcon3D })));

interface MicroIconProps {
  variant: MicroVariant;
  /** Icono plano: es lo que se ve en móvil, sin WebGL y mientras carga el 3D. */
  fallback: ReactNode;
  className?: string;
}

/**
 * Icono de las tarjetas (servicios, especialidades, tratamientos). Muestra el icono plano y, solo en
 * equipos capaces (no teléfonos ni gama baja), carga su versión 3D de cristal.
 */
export function MicroIcon({ variant, fallback, className }: MicroIconProps) {
  const [capable, setCapable] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura única de las señales del navegador
    setCapable(pickDeviceTier(readTierSignals()) !== "low");
  }, []);
  const flat = (
    <div className={cx("shrink-0", className)}>
      <div className="grid size-full place-items-center">{fallback}</div>
    </div>
  );
  if (!capable) return flat;
  return (
    <Suspense fallback={flat}>
      <MicroIcon3D variant={variant} fallback={fallback} className={className} />
    </Suspense>
  );
}
