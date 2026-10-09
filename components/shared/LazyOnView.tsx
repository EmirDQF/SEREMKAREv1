"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";

/** Se empieza a descargar un poco antes de que la sección entre en pantalla. */
const DEFAULT_ROOT_MARGIN = "600px 0px";

interface LazyOnViewProps {
  /** Componente diferido (React.lazy): su JS solo se descarga al acercarse a la pantalla. */
  children: ReactNode;
  /** Marcador del mismo tamaño, renderizado en el servidor (sin saltos de layout ni pantalla vacía sin JS). */
  fallback: ReactNode;
  rootMargin?: string;
  /** Monta de inmediato (p. ej. el usuario pidió esta sección desde otro enlace). */
  force?: boolean;
}

/**
 * Islas interactivas bajo el pliegue (triage, densitometría): en el primer pintado solo viaja el
 * marcador; el JS de la isla se pide cuando la sección está a ~600 px de verse. En móviles que no
 * llegan a esa sección, nunca se descarga.
 */
export function LazyOnView({ children, fallback, rootMargin = DEFAULT_ROOT_MARGIN, force = false }: LazyOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (near) return;
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [near, rootMargin]);

  return <div ref={ref}>{near || force ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}</div>;
}
