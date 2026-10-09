"use client";

import { pickDeviceTier, readTierSignals, type DeviceTier } from "@/lib/device-tier";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import { sceneRegistry, type SceneRegistryState } from "@/lib/scene-registry";
import { isWebGLAvailable } from "@/lib/webgl";
import { useReducedMotionPreference } from "@/lib/motion-preference";

/* Hooks del lado DOM. Ninguno importa three: se pueden usar en cualquier sección sin engordar el bundle. */

interface SceneInView {
  /** Visible o a menos de `rootMargin` de serlo: la escena debe renderizar. */
  inView: boolean;
  /** Ya estuvo cerca de la pantalla alguna vez: la escena puede montarse. */
  entered: boolean;
}

const DEFAULT_ROOT_MARGIN = "20% 0px";

/** Observa un hueco 3D para activar su escena solo cuando está en (o cerca de) la pantalla. */
export function useSceneInView(ref: RefObject<Element | null>, rootMargin = DEFAULT_ROOT_MARGIN): SceneInView {
  const [state, setState] = useState<SceneInView>({ inView: false, entered: false });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setState((prev) =>
          prev.inView === inView && (prev.entered || !inView) ? prev : { inView, entered: prev.entered || inView },
        );
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return state;
}

const noopSubscribe = () => () => {};

/** true/false en el cliente; null en el servidor (aún no se sabe). */
export function useWebGLSupport(): boolean | null {
  return useSyncExternalStore(noopSubscribe, isWebGLAvailable, () => null);
}

/** Estado del lienzo global (cargando, listo, fallido) y huecos activos. */
export function useCanvasStatus(): SceneRegistryState {
  return useSyncExternalStore(sceneRegistry.subscribe, sceneRegistry.getState, sceneRegistry.getState);
}

/** true si hay que reducir animaciones (sistema operativo o interruptor del footer). */
export function useReducedMotion(): boolean {
  return useReducedMotionPreference() ?? false;
}

const IDLE_TIMEOUT_MS = 2000;
const FALLBACK_DELAY_MS = 300;

/**
 * Se vuelve true cuando la página terminó de cargar y el navegador está libre.
 * Así el 3D nunca compite con el texto ni con la foto del hero (LCP).
 */
export function usePageIdle(): boolean {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let cancelIdle = () => {};
    const schedule = () => {
      if ("requestIdleCallback" in window) {
        const handle = window.requestIdleCallback(() => setIdle(true), { timeout: IDLE_TIMEOUT_MS });
        cancelIdle = () => window.cancelIdleCallback(handle);
      } else {
        const handle = setTimeout(() => setIdle(true), FALLBACK_DELAY_MS);
        cancelIdle = () => clearTimeout(handle);
      }
    };
    if (document.readyState === "complete") {
      schedule();
      return () => cancelIdle();
    }
    window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      cancelIdle();
    };
  }, []);

  return idle;
}

/**
 * Nivel del dispositivo (lib/device-tier). null en el servidor y hasta hidratar; en «low» el 3D
 * nunca se monta y three.js no se descarga.
 */
export function useDeviceTier(): DeviceTier | null {
  const [tier, setTier] = useState<DeviceTier | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura única de las señales del navegador
    setTier(pickDeviceTier(readTierSignals()));
  }, []);
  return tier;
}
