"use client";

import { MotionScope } from "@/components/layout/MotionScope";

import { useRef, type PointerEvent } from "react";
import Image from "next/image";
import { useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { homeImages } from "@/data/home";
import { site } from "@/data/site";

const VIDEO_TITLE = "¿Dolor de rodilla? ¿Artrosis? Te explicamos tus opciones";
const MAGNET_PX = 14;
const MAGNET_SPRING = { stiffness: 180, damping: 16 };

/** Miniatura propia + modal de YouTube que solo se carga al abrirlo (youtube-nocookie). */
function VideoSectionContent() {
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const captionY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const magnetX = useSpring(useMotionValue(0), MAGNET_SPRING);
  const magnetY = useSpring(useMotionValue(0), MAGNET_SPRING);

  /** Botón de play magnético: se acerca un poco al cursor (solo mouse). */
  function handleMove(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    magnetX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2 * MAGNET_PX);
    magnetY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2 * MAGNET_PX);
  }

  function handleLeave() {
    magnetX.set(0);
    magnetY.set(0);
  }

  return (
    <section aria-labelledby="video-title" className="section-y bg-bg-alt">
      <div className="container-page">
        <SectionHeading
          id="video-title"
          eyebrow="En 3 minutos"
          title="¿Dolor de rodilla? ¿Artrosis?"
          description="Nuestra especialista te explica qué está pasando en tu articulación y qué tratamientos existen hoy."
        />
        <Reveal className="mx-auto mt-12 max-w-5xl">
          <div ref={frameRef}>
            <Dialog>
              <DialogTrigger
                onPointerMove={handleMove}
                onPointerLeave={handleLeave}
                className="group relative block aspect-video w-full overflow-hidden rounded-[2rem] shadow-lift"
              >
                <m.div style={{ y: imageY }} className="absolute -inset-y-[7%] inset-x-0">
                  <Image
                    src={homeImages.video}
                    alt={homeImages.videoAlt}
                    fill
                    sizes="(min-width: 1024px) 1024px, 92vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </m.div>
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent"
                />
                <span className="absolute inset-0 grid place-items-center">
                  <m.span
                    style={{ x: magnetX, y: magnetY }}
                    className="relative grid size-20 place-items-center rounded-full bg-white text-navy shadow-lift transition-transform duration-300 group-hover:scale-110 sm:size-24"
                  >
                    <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full bg-white/60" />
                    <span
                      aria-hidden
                      className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-teal-200 [animation-delay:0.8s]"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 animate-pulse-ring rounded-full border border-white/70 [animation-delay:1.6s]"
                    />
                    <Play aria-hidden className="relative ml-1 size-8 fill-current" />
                  </m.span>
                </span>
                <m.span style={{ y: captionY }} className="absolute inset-x-0 bottom-0 p-5 text-left sm:p-8">
                  <span className="block font-display text-lg font-bold text-white sm:text-2xl">{VIDEO_TITLE}</span>
                  <span className="mt-1 block text-sm text-slate-200">Reproducir video · 3 min</span>
                </m.span>
              </DialogTrigger>
              <DialogContent bare wide>
                <DialogTitle className="sr-only">{VIDEO_TITLE}</DialogTitle>
                <DialogDescription className="sr-only">Video informativo de {site.name}.</DialogDescription>
                <div className="aspect-video w-full overflow-hidden rounded-[1.75rem] bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${site.youtubeVideoId}?autoplay=1&rel=0`}
                    title={VIDEO_TITLE}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="size-full"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Con su propio MotionScope: motion solo se carga donde se usa (no en el layout raíz). */
export function VideoSection() {
  return (
    <MotionScope>
      <VideoSectionContent />
    </MotionScope>
  );
}
