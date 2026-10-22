import type { Theme } from "@/lib/theme";

/**
 * Colores de marca para WebGL: espejo de los tokens de app/globals.css (paleta 2026: teal clínico × aqua tecnológico × navy índigo).
 * three no lee variables CSS; si cambias un token, cámbialo también aquí.
 */
export const PALETTE = {
  teal: "#0dac9d", // --teal (claro)
  tealLight: "#61e0d0", // --teal (oscuro)
  coral: "#f97362", // --coral (claro)
  coralLight: "#fb8a7b", // --coral (oscuro)
  sky: "#0283a1", // --ring (claro)
  skyLight: "#82d5f1", // --video (oscuro) / --video-glow
  video: "#036881", // --video (claro)
  videoStrong: "#49bee2", // --video-strong (oscuro)
  pain: "#f59e0b", // --pain (claro)
  painLight: "#fbbf24", // --pain (oscuro)
  online: "#10b981", // --online-dot (claro)
  cyan: "#b0e6fa",
  navy: "#0f1d3a", // --navy
  navy2: "#263d70", // --navy-2
} as const;

export interface ThemeColors {
  bone: string;
  boneSheen: string;
  glassTint: string;
  /** Teal "sano" que mejor contrasta con el fondo de cada tema. */
  health: string;
  /** Coral "inflamación" de cada tema. */
  inflammation: string;
}

const LIGHT: ThemeColors = {
  bone: "#e9e2d6",
  boneSheen: "#cdeee8",
  glassTint: "#e6fbf7",
  health: PALETTE.teal,
  inflammation: PALETTE.coral,
};

const DARK: ThemeColors = {
  bone: "#c9d6e3",
  boneSheen: "#7dd3fc",
  glassTint: "#bfeee7",
  health: PALETTE.tealLight,
  inflammation: PALETTE.coralLight,
};

export function themeColors(theme: Theme): ThemeColors {
  return theme === "dark" ? DARK : LIGHT;
}
