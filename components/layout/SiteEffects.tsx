"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pickDeviceTier, readTierSignals } from "@/lib/device-tier";
import { setMotionPreference, shouldReduceMotion, parseStoredPreference, MOTION_STORAGE_KEY } from "@/lib/motion-preference";
import { applyTheme } from "@/lib/theme";

const HEADER_OFFSET_PX = -96;
const SCROLL_THRESHOLD_PX = 24;
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

/*
 * Única isla cliente del chrome del sitio. No renderiza nada: la cabecera, el menú móvil, los diálogos
 * y los interruptores son HTML de servidor con atributos `data-*`, y aquí se conecta su comportamiento
 * con escuchas delegadas en `document`. Así la hidratación no recorre árboles cliente y no hay tareas
 * largas antes de que el paciente pueda tocar «Agendar cita».
 *
 * Contratos (atributos):
 *   [data-dialog-open="id"]   abre <dialog id> con showModal (foco atrapado y Escape los da el navegador)
 *   [data-dialog-close]       cierra el <dialog> que lo contiene
 *   <dialog data-close-on-link> se cierra al elegir un enlace (menú móvil)
 *   [data-theme-toggle]       alterna claro/oscuro (aria-pressed se sincroniza)
 *   [data-motion-toggle]      interruptor «Reducir animaciones» (role=switch, aria-checked)
 *   details[data-dropdown]    se cierra con Escape, clic fuera, al elegir opción y al navegar
 *   #site-header              recibe data-scrolled="true|false"
 */

function syncThemeButtons(): void {
  const dark = document.documentElement.dataset.theme === "dark";
  document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-pressed", String(dark));
    button.setAttribute("aria-label", dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  });
}

function readMotionPreference() {
  try {
    return parseStoredPreference(localStorage.getItem(MOTION_STORAGE_KEY));
  } catch {
    return "auto" as const;
  }
}

function syncMotionSwitches(): void {
  const systemReduces = window.matchMedia(REDUCE_QUERY).matches;
  const preference = readMotionPreference();
  const reduced = shouldReduceMotion(preference, systemReduces);
  const forced = reduced && preference !== "reduce";
  document.querySelectorAll<HTMLButtonElement>("[data-motion-toggle]").forEach((button) => {
    button.setAttribute("aria-checked", String(reduced));
    button.disabled = forced;
    button.dataset.forced = String(forced);
  });
}

function closeDropdowns(except?: Element | null): void {
  document.querySelectorAll<HTMLDetailsElement>("details[data-dropdown][open]").forEach((menu) => {
    if (menu !== except) menu.open = false;
  });
}

function handleClick(event: MouseEvent): void {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const opener = target.closest<HTMLElement>("[data-dialog-open]");
  if (opener) {
    const dialog = document.getElementById(opener.dataset.dialogOpen ?? "");
    if (dialog instanceof HTMLDialogElement && !dialog.open) {
      dialog.showModal();
      opener.setAttribute("aria-expanded", "true");
      dialog.addEventListener("close", () => opener.setAttribute("aria-expanded", "false"), { once: true });
    }
    return;
  }

  const dialog = target.closest("dialog");
  if (dialog?.open) {
    // Clic en el fondo (el propio <dialog>), en «Cerrar» o en un enlace de un menú.
    const onBackdrop = target === dialog;
    const onClose = target.closest("[data-dialog-close]") !== null;
    const onLink = dialog.hasAttribute("data-close-on-link") && target.closest("a") !== null;
    if (onBackdrop || onClose || onLink) dialog.close();
  }

  if (target.closest("[data-theme-toggle]")) {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    syncThemeButtons();
  }

  const motionSwitch = target.closest<HTMLButtonElement>("[data-motion-toggle]");
  if (motionSwitch && !motionSwitch.disabled) {
    setMotionPreference(motionSwitch.getAttribute("aria-checked") === "true" ? "auto" : "reduce");
    syncMotionSwitches();
  }

  const insideDropdown = target.closest("details[data-dropdown]");
  const pickedOption = insideDropdown !== null && target.closest("a") !== null;
  closeDropdowns(pickedOption ? null : insideDropdown);
}

function handleKey(event: KeyboardEvent): void {
  if (event.key !== "Escape") return;
  document.querySelectorAll<HTMLDetailsElement>("details[data-dropdown][open]").forEach((menu) => {
    menu.open = false;
    menu.querySelector("summary")?.focus();
  });
}

/** Scroll suave solo en escritorio con puntero fino y equipo capaz (nunca en táctil ni gama baja). */
function wantsSmoothScroll(): boolean {
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const reduce = document.documentElement.dataset.reduceMotion === "true" || window.matchMedia(REDUCE_QUERY).matches;
  return finePointer && !reduce && pickDeviceTier(readTierSignals()) !== "low";
}

function useHeaderScrollState(): void {
  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;
    let scheduled = false;
    const update = () => {
      scheduled = false;
      header.dataset.scrolled = window.scrollY > SCROLL_THRESHOLD_PX ? "true" : "false";
    };
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

function useSmoothScroll(): void {
  useEffect(() => {
    let destroy = () => {};
    let cancelled = false;
    // Después del primer pintado y en un momento ocioso: Lenis nunca compite con la hidratación.
    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 1200));
    idle(() => {
      if (cancelled || !wantsSmoothScroll()) return;
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
    });
    return () => {
      cancelled = true;
      destroy();
    };
  }, []);
}

export function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    syncThemeButtons();
    syncMotionSwitches();
    const media = window.matchMedia(REDUCE_QUERY);
    media.addEventListener("change", syncMotionSwitches);
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      media.removeEventListener("change", syncMotionSwitches);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Al navegar: menús cerrados y los botones de la página nueva con su estado real.
  useEffect(() => {
    closeDropdowns();
    syncThemeButtons();
    syncMotionSwitches();
  }, [pathname]);

  useHeaderScrollState();
  useSmoothScroll();
  return null;
}
