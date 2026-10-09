import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Tarjeta con halo y borde que se iluminan al hover y elevación (solo CSS: transform + opacity).
 * Componente de servidor: antes seguía al cursor con JS. `data-micro-host` enciende su icono 3D.
 */
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  return (
    <div
      data-micro-host
      className={cn(
        "gradient-border group relative isolate overflow-hidden rounded-[1.75rem] border border-line bg-card-solid shadow-soft",
        "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-lift",
        "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        "before:bg-[radial-gradient(420px_circle_at_50%_0%,var(--teal-tint),transparent_65%)]",
        className,
      )}
    >
      <span aria-hidden className="spotlight-ring z-10 group-hover:opacity-100" />
      {children}
    </div>
  );
}
