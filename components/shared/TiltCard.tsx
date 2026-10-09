import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Se conservan por compatibilidad: la inclinación con el mouse se retiró (JS en cada tarjeta). */
  maxTilt?: number;
  sheen?: boolean;
}

/**
 * Contenedor de tarjeta. Componente de servidor: antes inclinaba la tarjeta siguiendo al mouse con
 * motion, lo que sumaba JS a cada página con tarjetas. `data-micro-host` enciende el icono 3D al hover.
 */
export function TiltCard({ children, className }: TiltCardProps) {
  return (
    <div data-micro-host className={cn("relative", className)}>
      {children}
    </div>
  );
}
