"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useCanvasStatus, useDeviceTier, usePageIdle, useSceneInView, useWebGLSupport } from "@/components/3d/hooks";
import type { SceneViewProps } from "@/components/3d/SceneView";
import type { SceneId, SceneProps } from "@/components/3d/scene-types";
import { sceneRegistry } from "@/lib/scene-registry";
import { cn } from "@/lib/utils";

/** Chunk diferido (drei <View> + three). next/dynamic pierde el genérico, por eso se re-tipa. */
const SceneView = dynamic(() => import("@/components/3d/SceneView"), { ssr: false }) as <K extends SceneId>(
  props: SceneViewProps<K>,
) => ReactNode;

interface Scene3DSlotProps<K extends SceneId> {
  scene: K;
  sceneProps: SceneProps[K];
  /** Contenido actual (SVG/imagen). Se ve en el SSR, sin WebGL, si la escena falla y mientras carga. */
  fallback: ReactNode;
  /** Debe reservar el tamaño del hueco (aspect-ratio o alto fijo) para evitar CLS. */
  className?: string;
  /** La escena recibe eventos de puntero (hotspots, arrastre). */
  interactive?: boolean;
  /** Avisa cuando el 3D reemplaza al fallback (p. ej. para mostrar controles accesibles alternativos). */
  onShowingChange?: (showing3D: boolean) => void;
}

/**
 * Hueco de una escena 3D dentro de una sección. Monta la escena solo con la página cargada,
 * WebGL disponible y el hueco cerca de la pantalla; la pausa cuando sale. El fallback queda
 * debajo y se desvanece cuando el 3D ya dibujó su primer frame.
 */
export function Scene3DSlot<K extends SceneId>({
  scene,
  sceneProps,
  fallback,
  className,
  interactive = false,
  onShowingChange,
}: Scene3DSlotProps<K>) {
  const slotId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const { inView, entered } = useSceneInView(ref);
  const webgl = useWebGLSupport();
  const idle = usePageIdle();
  const { status } = useCanvasStatus();
  const [rendered, setRendered] = useState(false);
  const [failed, setFailed] = useState(false);

  const tier = useDeviceTier();
  // Gama baja / ahorro de datos / red lenta / reducir animaciones: solo el fallback (sin three.js).
  const capable = tier !== null && tier !== "low";
  const mounted = capable && webgl === true && idle && entered && !failed && status !== "failed";
  const showing3D = mounted && status === "ready" && rendered;

  useEffect(() => {
    if (mounted) sceneRegistry.request();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    sceneRegistry.setActive(slotId, inView);
    return () => sceneRegistry.setActive(slotId, false);
  }, [slotId, mounted, inView]);

  useEffect(() => {
    onShowingChange?.(showing3D);
  }, [showing3D, onShowingChange]);

  const handleReady = useCallback(() => setRendered(true), []);
  const handleError = useCallback(() => setFailed(true), []);

  return (
    <div ref={ref} className={cn("relative", className)} data-scene={scene} data-scene-state={showing3D ? "3d" : "fallback"}>
      <div
        className={cn("size-full transition-opacity duration-700 ease-out", showing3D && "opacity-0")}
        aria-hidden={showing3D || undefined}
        inert={showing3D || undefined}
      >
        {fallback}
      </div>
      {mounted ? (
        <SceneView
          scene={scene}
          sceneProps={sceneProps}
          visible={inView}
          interactive={interactive}
          onReady={handleReady}
          onError={handleError}
          className="absolute inset-0"
        />
      ) : null}
    </div>
  );
}
