/**
 * Nivel del dispositivo para decidir si se descarga el 3D:
 * - low: teléfono, gama baja, ahorro de datos, red lenta o «reducir animaciones» → three.js NO se descarga
 *   (se muestra el póster/SVG del fallback).
 * - mid: 3D simplificado (DPR bajo, sin postprocesado).
 * - high: 3D completo.
 */
export type DeviceTier = "low" | "mid" | "high";

export interface TierSignals {
  /** navigator.deviceMemory (GB). No existe en Safari/Firefox. */
  memoryGb?: number;
  cores: number;
  saveData: boolean;
  /** navigator.connection.effectiveType: "slow-2g" | "2g" | "3g" | "4g". */
  effectiveType?: string;
  reducedMotion: boolean;
  /** Pantalla táctil pequeña (teléfono): nunca 3D, por batería, datos y CPU. */
  phone?: boolean;
}

const LOW_MAX_MEMORY_GB = 2;
const LOW_MAX_CORES = 2;
const HIGH_MIN_MEMORY_GB = 8;
const HIGH_MIN_CORES = 8;
const SLOW_NETWORKS: ReadonlySet<string> = new Set(["slow-2g", "2g", "3g"]);
/** Lado corto de la pantalla por debajo del cual un dispositivo táctil se trata como teléfono. */
const PHONE_MAX_SHORT_SIDE_PX = 768;

export function pickDeviceTier({ memoryGb, cores, saveData, effectiveType, reducedMotion, phone = false }: TierSignals): DeviceTier {
  if (phone || reducedMotion || saveData) return "low";
  if (effectiveType && SLOW_NETWORKS.has(effectiveType)) return "low";
  if ((memoryGb !== undefined && memoryGb <= LOW_MAX_MEMORY_GB) || cores <= LOW_MAX_CORES) return "low";
  const enoughMemory = memoryGb === undefined || memoryGb >= HIGH_MIN_MEMORY_GB;
  return cores >= HIGH_MIN_CORES && enoughMemory ? "high" : "mid";
}

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

/** Lee las señales del navegador actual (solo cliente). */
export function readTierSignals(): TierSignals {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: NetworkInformationLike };
  const reduceToggle = document.documentElement.dataset.reduceMotion === "true";
  return {
    memoryGb: nav.deviceMemory,
    cores: nav.hardwareConcurrency || 4,
    saveData: Boolean(nav.connection?.saveData),
    effectiveType: nav.connection?.effectiveType,
    reducedMotion: reduceToggle || window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    phone:
      window.matchMedia("(pointer: coarse)").matches &&
      Math.min(window.screen.width, window.screen.height) < PHONE_MAX_SHORT_SIDE_PX,
  };
}
