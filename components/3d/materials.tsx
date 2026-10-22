"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { ThreeElements } from "@react-three/fiber";
import { useSceneEnv } from "@/components/3d/scene-context";
import { PALETTE, themeColors } from "@/components/3d/palette";

/* ==========================================================================
   Materiales compartidos de las escenas 3D.
   Son componentes declarativos: R3F los libera (dispose) al desmontar la escena.
   ========================================================================== */

type PhysicalProps = ThreeElements["meshPhysicalMaterial"];

type ClinicalGlassProps = PhysicalProps & {
  /**
   * Transmisión real (refracción). Solo sirve cuando detrás del cristal hay más 3D: el lienzo es
   * transparente y la transmisión no "ve" el DOM, así que sobre la web se vería gris.
   */
  transmissive?: boolean;
};

/**
 * "Cristal clínico": vidrio claro con clearcoat, reflejos del entorno de estudio y un leve
 * tornasol en calidad alta. Por defecto es simulado (transparencia), sin el pase extra de transmisión.
 */
export function ClinicalGlassMaterial({ transmissive = false, ...props }: ClinicalGlassProps) {
  const { tier, theme } = useSceneEnv();
  const colors = themeColors(theme);
  if (transmissive && tier !== "mobile") {
    return (
      <meshPhysicalMaterial
        color={colors.glassTint}
        transmission={1}
        thickness={0.45}
        roughness={0.1}
        ior={1.32}
        clearcoat={1}
        clearcoatRoughness={0.06}
        attenuationColor={PALETTE.teal}
        attenuationDistance={3}
        envMapIntensity={1.2}
        {...props}
      />
    );
  }
  return (
    <meshPhysicalMaterial
      color={colors.glassTint}
      transparent
      opacity={theme === "dark" ? 0.12 : 0.16}
      roughness={0.06}
      metalness={0}
      clearcoat={1}
      clearcoatRoughness={0.04}
      iridescence={tier === "high" ? 0.45 : 0}
      iridescenceIOR={1.3}
      envMapIntensity={1.8}
      depthWrite={false}
      {...props}
    />
  );
}

/** Hueso estilizado: marfil frío con un leve brillo teal en los bordes (sheen). */
export function BoneMaterial(props: PhysicalProps) {
  const { theme } = useSceneEnv();
  const colors = themeColors(theme);
  return (
    <meshPhysicalMaterial
      color={colors.bone}
      roughness={0.5}
      metalness={0}
      clearcoat={0.25}
      clearcoatRoughness={0.35}
      sheen={0.6}
      sheenColor={colors.boneSheen}
      sheenRoughness={0.5}
      {...props}
    />
  );
}

/* ---------- Bio-luminiscente: coral (inflamación) ↔ teal (salud) ---------- */

const tmpInflamed = new THREE.Color();
const tmpHealthy = new THREE.Color();

/** Intensidad emisiva: alta y pulsante inflamado, serena cuando está sano. */
const INFLAMED_GLOW = { base: 1.5, pulse: 1.1 };
const HEALTHY_GLOW = { base: 0.85, pulse: 0.2 };

/**
 * Lleva un material bio-luminiscente al estado `healing` (0 = inflamado, 1 = sano).
 * `pulse` (0..1) es el latido actual. Se llama en cada frame desde useFrame.
 */
export function applyHealing(
  material: THREE.MeshStandardMaterial,
  healing: number,
  pulse: number,
  colors: { inflammation: string; health: string },
): void {
  tmpInflamed.set(colors.inflammation);
  tmpHealthy.set(colors.health);
  material.color.copy(tmpInflamed).lerp(tmpHealthy, healing);
  material.emissive.copy(material.color);
  const inflamed = INFLAMED_GLOW.base + INFLAMED_GLOW.pulse * pulse;
  const healthy = HEALTHY_GLOW.base + HEALTHY_GLOW.pulse * pulse;
  material.emissiveIntensity = THREE.MathUtils.lerp(inflamed, healthy, healing);
}

export function BioluminescentMaterial(props: ThreeElements["meshStandardMaterial"]) {
  return <meshStandardMaterial roughness={0.35} metalness={0} toneMapped={false} transparent opacity={0.92} {...props} />;
}

/* ---------- Holograma: fresnel + líneas de escaneo + parpadeo sutil ---------- */

const HOLOGRAM_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const HOLOGRAM_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uRimColor;
  uniform float uOpacity;
  uniform float uFresnelPower;
  uniform float uScanDensity;
  uniform float uScanY;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    vec3 n = normalize(vNormal);
    if (!gl_FrontFacing) n = -n;
    float facing = clamp(dot(n, normalize(vViewDir)), 0.0, 1.0);
    float fresnel = pow(1.0 - facing, uFresnelPower);
    float lines = smoothstep(0.6, 1.0, sin(vWorldPos.y * uScanDensity - uTime * 2.2) * 0.5 + 0.5);
    float band = exp(-pow((vWorldPos.y - uScanY) * 5.0, 2.0));
    float flicker = 0.93 + 0.07 * hash(floor(uTime * 20.0));
    float alpha = (0.05 + fresnel * 0.85 + lines * 0.16 + band * 0.4) * uOpacity * flicker;
    vec3 color = mix(uColor, uRimColor, fresnel) + band * 0.3;
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

export interface HologramUniforms {
  [uniform: string]: THREE.IUniform;
  uTime: THREE.IUniform<number>;
  uColor: THREE.IUniform<THREE.Color>;
  uRimColor: THREE.IUniform<THREE.Color>;
  uOpacity: THREE.IUniform<number>;
  uFresnelPower: THREE.IUniform<number>;
  uScanDensity: THREE.IUniform<number>;
  uScanY: THREE.IUniform<number>;
}

interface HologramMaterialProps {
  color: string;
  rimColor: string;
  opacity?: number;
}

/**
 * Material holográfico. La escena anima `uTime` y `uScanY` en useFrame a través de
 * `mesh.material.uniforms` (mismo objeto de uniforms durante toda la vida del material).
 */
export function HologramMaterial({ color, rimColor, opacity = 1 }: HologramMaterialProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo<HologramUniforms>(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color() },
      uRimColor: { value: new THREE.Color() },
      uOpacity: { value: 1 },
      uFresnelPower: { value: 2.2 },
      uScanDensity: { value: 42 },
      uScanY: { value: 0 },
    }),
    [],
  );

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uColor.value.set(color);
    material.uniforms.uRimColor.value.set(rimColor);
    material.uniforms.uOpacity.value = opacity;
  }, [color, rimColor, opacity]);

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={HOLOGRAM_VERTEX}
      fragmentShader={HOLOGRAM_FRAGMENT}
      uniforms={uniforms}
      transparent
      depthWrite={false}
      blending={THREE.AdditiveBlending}
      side={THREE.DoubleSide}
      toneMapped={false}
    />
  );
}

/* ---------- Brillo (sustituto barato del bloom) ---------- */

let glowTexture: THREE.CanvasTexture | null = null;
let ringTexture: THREE.CanvasTexture | null = null;
const SPRITE_TEXTURE_SIZE = 128;

function radialTexture(paint: (ctx: CanvasRenderingContext2D, size: number) => void): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = SPRITE_TEXTURE_SIZE;
  canvas.height = SPRITE_TEXTURE_SIZE;
  const ctx = canvas.getContext("2d");
  if (ctx) paint(ctx, SPRITE_TEXTURE_SIZE);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Halo radial suave (compartido por todas las escenas). */
export function getGlowTexture(): THREE.CanvasTexture {
  glowTexture ??= radialTexture((ctx, size) => {
    const half = size / 2;
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.25, "rgba(255,255,255,0.55)");
    gradient.addColorStop(0.6, "rgba(255,255,255,0.12)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  });
  return glowTexture;
}

/** Anillo luminoso fino (hotspots y miras). */
export function getRingTexture(): THREE.CanvasTexture {
  ringTexture ??= radialTexture((ctx, size) => {
    const half = size / 2;
    ctx.strokeStyle = "rgba(255,255,255,1)";
    ctx.shadowColor = "rgba(255,255,255,0.9)";
    ctx.shadowBlur = size * 0.06;
    ctx.lineWidth = size * 0.045;
    ctx.beginPath();
    ctx.arc(half, half, half * 0.7, 0, Math.PI * 2);
    ctx.stroke();
  });
  return ringTexture;
}

type GlowMaterialProps = ThreeElements["spriteMaterial"] & { variant?: "glow" | "ring" };

/** Material de sprite aditivo para halos; `variant` elige halo o anillo. */
export function GlowMaterial({ variant = "glow", ...props }: GlowMaterialProps) {
  const map = variant === "ring" ? getRingTexture() : getGlowTexture();
  return (
    <spriteMaterial
      map={map}
      transparent
      depthWrite={false}
      blending={THREE.AdditiveBlending}
      toneMapped={false}
      {...props}
    />
  );
}
