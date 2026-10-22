"use client";

import Link from "next/link";
import { useEffect } from "react";

interface SiteErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

const BUTTON =
  "inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-7 font-display text-base font-semibold transition-[transform,background-color] duration-200 active:scale-[0.97]";

/**
 * Error inesperado en una página del sitio: misma estética (aurora, eyebrow, CTA) y dos salidas claras.
 * Ligero a propósito (sin iconos ni datos del sitio): es la única pieza cliente que carga con cada ruta.
 */
export default function SiteError({ error, retry }: SiteErrorProps) {
  useEffect(() => {
    // Rastro en la consola del navegador (el servidor ya registra el error con su digest).
    console.error("Error en la página:", error.digest ?? error.message);
  }, [error]);

  return (
    <section aria-labelledby="error-title" className="relative isolate overflow-hidden pb-24 pt-40 sm:pt-48">
      <div aria-hidden className="aurora -z-10" />
      <div aria-hidden className="scan-grid -z-10" />
      <div className="container-page max-w-2xl text-center">
        <p className="eyebrow mx-auto">
          <span aria-hidden className="size-1.5 rounded-full bg-teal" />
          Algo no cargó bien
        </p>
        <h1 id="error-title" className="text-h2 mt-4">
          Tuvimos un problema al mostrar esta página
        </h1>
        <p className="mt-4 text-lg text-muted">
          No es tu culpa. Puedes intentarlo de nuevo o agendar tu cita directamente. Si el problema sigue, escríbenos desde la
          página de contacto.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => retry()} className={`${BUTTON} glow-cta bg-primary text-on-primary hover:bg-primary-hover`}>
            Intentar de nuevo
          </button>
          <Link href="/contacto" className={`${BUTTON} border border-line-strong bg-card-solid text-heading hover:border-primary`}>
            Ir a contacto
          </Link>
        </div>
      </div>
    </section>
  );
}
