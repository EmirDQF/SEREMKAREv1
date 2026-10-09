"use client";

import { useEffect } from "react";

const SCROLL_THRESHOLD_PX = 24;

interface HeaderScrollStateProps {
  /** id del <header> que recibe data-scrolled="true|false". */
  headerId: string;
}

/**
 * Única pieza de JS de la cabecera: marca `data-scrolled` (la TopBar se oculta y la barra se compacta
 * con CSS, sin re-render de React).
 */
export function HeaderScrollState({ headerId }: HeaderScrollStateProps) {
  useEffect(() => {
    const header = document.getElementById(headerId);
    if (!header) return;
    const update = () => {
      header.dataset.scrolled = window.scrollY > SCROLL_THRESHOLD_PX ? "true" : "false";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [headerId]);

  return null;
}
