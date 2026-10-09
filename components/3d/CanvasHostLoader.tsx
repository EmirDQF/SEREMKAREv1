"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { pickDeviceTier, readTierSignals } from "@/lib/device-tier";

/** El host del lienzo 3D (y su estado) viaja en otro chunk. */
const CanvasHost = dynamic(() => import("@/components/3d/CanvasHost").then((mod) => mod.CanvasHost), {
  ssr: false,
  loading: () => null,
});

/**
 * Monta el lienzo 3D global solo en equipos que pueden mostrar 3D. En teléfonos, gama baja, ahorro
 * de datos, red lenta o movimiento reducido no descarga nada (ni el host ni three.js).
 */
export function CanvasHostLoader() {
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura única de las señales del navegador
    setCapable(pickDeviceTier(readTierSignals()) !== "low");
  }, []);

  if (!capable) return null;
  return <CanvasHost />;
}
