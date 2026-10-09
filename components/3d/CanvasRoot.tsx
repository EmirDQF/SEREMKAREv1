"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas, useThree, type RootState } from "@react-three/fiber";
import { PerformanceMonitor, View } from "@react-three/drei";
import { SceneEnvContext, type SceneEnv } from "@/components/3d/scene-context";
import { SceneErrorBoundary } from "@/components/3d/SceneErrorBoundary";
import { useCanvasStatus, useReducedMotion } from "@/components/3d/hooks";
import { sceneRegistry } from "@/lib/scene-registry";
import { pickDeviceTier, readTierSignals } from "@/lib/device-tier";
import { QUALITY_SETTINGS, downgradeTier, pickQualityTier, readDeviceSignals, type QualityTier } from "@/lib/quality";
import { useTheme } from "@/lib/theme";

/** Encima del contenido de las secciones (z-10) y debajo del header (z-60), menús y diálogos (z-50+). */
const CANVAS_Z_INDEX = 40;
const PERFORMANCE_FLIPFLOPS = 3;
/** Algo por debajo de 1 para que el hueso conserve volumen bajo el tone mapping ACES. */
const TONE_MAPPING_EXPOSURE = 0.88;

const CANVAS_STYLE = {
  position: "fixed",
  inset: 0,
  width: "100vw",
  height: "100lvh",
  zIndex: CANVAS_Z_INDEX,
  pointerEvents: "none",
} as const;

interface FrameloopGuardProps {
  active: boolean;
  reducedMotion: boolean;
}

/**
 * Cuando no queda ninguna escena en pantalla, limpia el lienzo (el bucle ya se detuvo).
 * Con movimiento reducido el lienzo renderiza bajo demanda: solo al hacer scroll o redimensionar.
 */
function FrameloopGuard({ active, reducedMotion }: FrameloopGuardProps) {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!active) {
      gl.setScissorTest(false);
      gl.clear();
      return;
    }
    if (!reducedMotion) return;
    const redraw = () => invalidate();
    window.addEventListener("scroll", redraw, { passive: true });
    window.addEventListener("resize", redraw);
    redraw();
    return () => {
      window.removeEventListener("scroll", redraw);
      window.removeEventListener("resize", redraw);
    };
  }, [active, reducedMotion, gl, invalidate]);

  return null;
}

function handleCreated({ gl }: RootState): void {
  gl.toneMappingExposure = TONE_MAPPING_EXPOSURE;
  gl.domElement.addEventListener("webglcontextlost", () => sceneRegistry.markFailed(), { once: true });
  sceneRegistry.markReady();
}

/**
 * Lienzo WebGL único y fijo para toda la web. Cada sección dibuja su escena con <View>
 * (drei) dentro de su propio hueco del DOM; aquí solo vive <View.Port />.
 */
export default function CanvasRoot() {
  const { activeSlots } = useCanvasStatus();
  const reducedMotion = useReducedMotion();
  const theme = useTheme() ?? "light";
  // Gama media (lib/device-tier): 3D simplificado desde el inicio (DPR bajo, sin postprocesado).
  const [tier, setTier] = useState<QualityTier>(() =>
    pickDeviceTier(readTierSignals()) === "mid" ? "mobile" : pickQualityTier(readDeviceSignals()),
  );
  const [finePointer] = useState(() => window.matchMedia("(pointer: fine)").matches);

  const active = activeSlots.length > 0;
  const settings = QUALITY_SETTINGS[tier];
  const frameloop = !active ? "never" : reducedMotion ? "demand" : "always";

  const env = useMemo<SceneEnv>(
    () => ({ tier, settings, reducedMotion, theme, finePointer }),
    [tier, settings, reducedMotion, theme, finePointer],
  );

  return (
    <SceneErrorBoundary onError={() => sceneRegistry.markFailed()}>
      <Canvas
        aria-hidden
        style={CANVAS_STYLE}
        eventSource={document.body}
        eventPrefix="client"
        frameloop={frameloop}
        dpr={settings.dpr}
        resize={{ scroll: false }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
        camera={{ position: [0, 0, 6], fov: 35 }}
        onCreated={handleCreated}
      >
        {frameloop === "always" ? (
          <PerformanceMonitor
            flipflops={PERFORMANCE_FLIPFLOPS}
            onDecline={() => setTier(downgradeTier)}
            onFallback={() => setTier("mobile")}
          />
        ) : null}
        <FrameloopGuard active={active} reducedMotion={reducedMotion} />
        <SceneEnvContext value={env}>
          <View.Port />
        </SceneEnvContext>
      </Canvas>
    </SceneErrorBoundary>
  );
}
