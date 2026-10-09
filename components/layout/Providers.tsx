"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { pickDeviceTier, readTierSignals } from "@/lib/device-tier";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const HEADER_OFFSET_PX = -96;

interface ProvidersProps {
  children: ReactNode;
}

/** Scroll suave solo en escritorio con puntero fino y equipo capaz (nunca en táctil ni gama baja). */
function wantsSmoothScroll(): boolean {
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  return finePointer && pickDeviceTier(readTierSignals()) !== "low";
}

/**
 * Desplegables nativos (<details data-dropdown>: menú «Más», selector de sedes): se cierran con
 * Escape, al hacer clic fuera, al elegir una opción y al navegar. Una sola escucha para todo el sitio.
 */
function useDropdownDismiss(): void {
  const pathname = usePathname();
  useEffect(() => {
    const openMenus = () => document.querySelectorAll<HTMLDetailsElement>("details[data-dropdown][open]");
    openMenus().forEach((menu) => (menu.open = false));
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      openMenus().forEach((menu) => {
        const inside = target !== null && menu.contains(target);
        const pickedOption = inside && target.closest("a") !== null;
        if (!inside || pickedOption) menu.open = false;
      });
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      openMenus().forEach((menu) => {
        menu.open = false;
        menu.querySelector("summary")?.focus();
      });
    };
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [pathname]);
}

/**
 * Smooth scroll (Lenis, cargado bajo demanda solo en escritorio). Respeta prefers-reduced-motion y
 * el interruptor «Reducir animaciones». motion ya no se monta aquí: cada isla animada trae su
 * MotionScope, así motion no entra en el JS inicial de todas las páginas.
 */
export function Providers({ children }: ProvidersProps) {
  const reduceMotion = useReducedMotionPreference();
  useDropdownDismiss();

  useEffect(() => {
    if (reduceMotion !== false || !wantsSmoothScroll()) return;
    let destroy = () => {};
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({
        autoRaf: true,
        lerp: 0.12,
        anchors: { offset: HEADER_OFFSET_PX },
        prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
      });
      destroy = () => lenis.destroy();
    });
    return () => {
      cancelled = true;
      destroy();
    };
  }, [reduceMotion]);

  return children;
}
