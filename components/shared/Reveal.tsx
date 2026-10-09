import type { ReactNode } from "react";

/**
 * Entrada suave al aparecer en pantalla. Componentes de servidor (sin JS): la animación es CSS ligada
 * al scroll (`[data-reveal]` en globals.css), solo transform + opacity y solo en tablet/escritorio.
 * En móvil, sin soporte o con movimiento reducido, el contenido se ve fijo desde el primer pintado.
 */

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Se conserva por compatibilidad: la entrada la marca el scroll, no un retardo. */
  delay?: number;
  as?: "div" | "li" | "section" | "article";
}

export function Reveal({ children, className, as: Component = "div" }: RevealProps) {
  return (
    <Component data-reveal className={className}>
      {children}
    </Component>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
}

/** Contenedor de `RevealItem` (cada ítem entra según su propia posición en pantalla). */
export function RevealGroup({ children, className, as: Component = "div" }: RevealGroupProps) {
  return <Component className={className}>{children}</Component>;
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
  /** Se conserva por compatibilidad (antes: entrada desde el eje Z). */
  depth?: boolean;
}

export function RevealItem({ children, className, as: Component = "div" }: RevealItemProps) {
  return (
    <Component data-reveal className={className}>
      {children}
    </Component>
  );
}
