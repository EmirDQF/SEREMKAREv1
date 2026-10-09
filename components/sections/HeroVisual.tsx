"use client";

import { useMemo, useRef, type ReactNode } from "react";
import Image from "next/image";
import { useScroll, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { MapPin, ShieldCheck, Video } from "lucide-react";
import { DoctorPortrait } from "@/components/shared/DoctorPortrait";
import { JointMotif } from "@/components/shared/JointMotif";
import { Scene3DSlot } from "@/components/3d/Scene3DSlot";
import { REAL_DOCTOR_SLUG, getDoctor } from "@/data/doctors";
import { homeImages } from "@/data/home";
import { cn } from "@/lib/utils";

interface FloatingCardProps {
  children: ReactNode;
  className: string;
  y: MotionValue<number>;
  delay: number;
}

function FloatingCard({ children, className, y, delay }: FloatingCardProps) {
  return (
    <m.div
      style={{ y }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn("glass absolute z-[45] flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lift", className)}
    >
      {children}
    </m.div>
  );
}

function CardIcon({ children }: { children: ReactNode }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-tint text-primary [&_svg]:size-5">
      {children}
    </span>
  );
}

/**
 * Foto del médico en forma orgánica + rodilla 3D (JointViewer3D; el JointMotif 2D queda como fallback)
 * + tarjetas glass con parallax suave.
 */
const doctor = getDoctor(REAL_DOCTOR_SLUG);

export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const yFast = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const yJoint = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const jointProps = useMemo(() => ({ progress: scrollYProgress }), [scrollYProgress]);

  return (
    <div ref={ref} className="relative mx-auto aspect-[4/4.6] w-full max-w-[34rem]">
      <div aria-hidden className="absolute inset-[6%] rounded-[46%_54%_52%_48%/50%_44%_56%_50%] bg-gradient-to-br from-teal/25 via-video-strong/10 to-navy-2/20" />
      <div className="absolute inset-[9%] overflow-hidden rounded-[44%_56%_50%_50%/52%_46%_54%_48%] shadow-lift">
        <Image
          src={homeImages.hero}
          alt={homeImages.heroAlt}
          fill
          loading="eager"
          // Sin preload de prioridad alta: el LCP es el texto del hero; la foto no compite con fuentes y CSS.
          sizes="(min-width: 1024px) 470px, 80vw"
          className="object-cover object-top"
        />
      </div>

      <m.div style={{ y: yJoint }} className="absolute -bottom-[6%] -left-[3%] aspect-[5/6] w-[56%] sm:-left-[12%]">
        <div aria-hidden className="absolute inset-[18%] rounded-full bg-teal/20 blur-3xl dark:bg-teal/15" />
        <Scene3DSlot
          scene="joint"
          sceneProps={jointProps}
          className="size-full"
          fallback={
            <div className="flex size-full items-end pb-[4%] pl-[8%]">
              <JointMotif className="h-auto w-[62%] drop-shadow-xl" label="Articulación que pasa de inflamada a aliviada" />
            </div>
          }
        />
      </m.div>

      <FloatingCard y={ySlow} delay={0.5} className="left-0 top-[10%] sm:-left-6">
        <CardIcon>
          <MapPin aria-hidden strokeWidth={1.75} />
        </CardIcon>
        <span>
          <span className="block font-display text-lg font-extrabold leading-tight text-heading">Todo el Perú</span>
          <span className="block text-sm text-muted">consulta virtual</span>
        </span>
      </FloatingCard>

      <FloatingCard y={yFast} delay={0.65} className="right-0 top-[4%] sm:-right-4">
        <CardIcon>
          <ShieldCheck aria-hidden strokeWidth={1.75} />
        </CardIcon>
        <span>
          <span className="block font-display text-lg font-extrabold leading-tight text-heading">Ley 30421</span>
          <span className="block text-sm text-muted">Marco de Telesalud</span>
        </span>
      </FloatingCard>

      <FloatingCard y={ySlow} delay={0.8} className="-right-1 top-[52%] sm:-right-8">
        <CardIcon>
          <Video aria-hidden strokeWidth={1.75} />
        </CardIcon>
        <span className="max-w-[9.5rem] text-sm font-semibold leading-snug text-heading">
          Videollamada por WhatsApp, Zoom o Meet
        </span>
      </FloatingCard>

      <FloatingCard y={yFast} delay={0.95} className="bottom-[4%] right-0 sm:right-[12%]">
        <DoctorPortrait doctor={doctor} size={44} alt="" className="size-11 rounded-xl" />
        <span>
          <span className="block text-sm font-bold text-heading">{doctor.name}</span>
          <span className="block text-xs text-muted">{doctor.title}</span>
        </span>
      </FloatingCard>
    </div>
  );
}
