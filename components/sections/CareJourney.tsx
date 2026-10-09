"use client";

import { MotionScope } from "@/components/layout/MotionScope";

import { useRef } from "react";
import Image from "next/image";
import { useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { CalendarCheck, ClipboardList, HeartHandshake, ScanSearch } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { homeImages } from "@/data/home";

interface JourneyStep {
  icon: LucideIcon;
  title: string;
  text: string;
  time: string;
}

const STEPS: readonly JourneyStep[] = [
  {
    icon: CalendarCheck,
    title: "Agenda",
    text: "Por WhatsApp, formulario o llamada. Eliges presencial o teleconsulta y el horario que te acomode.",
    time: "Menos de 1 minuto",
  },
  {
    icon: ClipboardList,
    title: "Evaluación",
    text: "Tu especialista revisa tu historia con calma, examina tus articulaciones y resuelve tus dudas.",
    time: "30–45 minutos",
  },
  {
    icon: ScanSearch,
    title: "Diagnóstico de precisión",
    text: "Si hace falta, ecografía en el mismo consultorio y laboratorio en la sede.",
    time: "El mismo día o en 24–72 h",
  },
  {
    icon: HeartHandshake,
    title: "Tratamiento y seguimiento",
    text: "Un plan claro, con metas realistas y seguimiento por WhatsApp entre consultas.",
    time: "Acompañamiento continuo",
  },
];

const WHAT_TO_BRING = [
  "DNI (y el de tu familiar, si vienes por él o ella)",
  "Lista de medicamentos que tomas",
  "Análisis, radiografías o ecografías recientes",
  "Tus preguntas anotadas",
  "Ropa cómoda que permita examinar la zona",
] as const;

interface StepNodeProps {
  icon: LucideIcon;
  index: number;
  progress: MotionValue<number>;
}

/** Nodo del timeline: se enciende (teal con brillo) cuando la línea de luz lo alcanza. */
function StepNode({ icon: StepIcon, index, progress }: StepNodeProps) {
  const threshold = (index / (STEPS.length - 1)) * 0.92;
  const lit = useTransform(progress, [threshold - 0.04, threshold + 0.04], [0, 1]);
  return (
    <span className="absolute -left-16 top-0 grid size-12 place-items-center rounded-2xl border border-line bg-card-solid text-primary shadow-soft">
      <m.span
        aria-hidden
        style={{ opacity: lit }}
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal to-[#0284c7] shadow-[0_0_28px_rgb(0_168_150/0.55)]"
      />
      <StepIcon aria-hidden strokeWidth={1.75} className="relative size-6" />
      <m.span aria-hidden style={{ opacity: lit }} className="absolute inset-0 grid place-items-center text-white">
        <StepIcon strokeWidth={1.75} className="size-6" />
      </m.span>
    </span>
  );
}

/** Check que se dibuja al entrar en pantalla. */
function DrawnCheck({ delay }: { delay: number }) {
  return (
    <span aria-hidden className="mt-1 grid size-5 shrink-0 place-items-center rounded-md border-2 border-teal">
      <svg viewBox="0 0 16 16" className="size-3.5 text-primary">
        <m.path
          d="M3 8.5 6.5 12 13 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </span>
  );
}

/** "Así es tu atención": timeline que se dibuja con el scroll + qué llevar a la primera consulta. */
function CareJourneyContent() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: imageProgress } = useScroll({ target: imageRef, offset: ["start end", "end start"] });
  const imageScale = useTransform(imageProgress, [0, 1], [1.14, 1]);

  return (
    <section aria-labelledby="atencion-title" className="section-y">
      <div className="container-page grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeading
            id="atencion-title"
            align="left"
            eyebrow="Así es tu atención"
            title="Cuatro pasos, sin vueltas ni sorpresas"
            description="Sabemos que tu tiempo vale. Por eso te explicamos el proceso completo desde el inicio."
          />
          <ol ref={ref} className="relative mt-10 space-y-8 pl-16">
            <span aria-hidden className="absolute bottom-6 left-6 top-6 w-0.5 -translate-x-1/2 rounded-full bg-line-strong" />
            <m.span
              aria-hidden
              style={{ scaleY: progress }}
              className="absolute bottom-6 left-6 top-6 w-0.5 origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-teal to-[#0284c7]"
            />
            {STEPS.map(({ icon, title, text, time }, index) => (
              <li key={title} className="relative">
                <StepNode icon={icon} index={index} progress={progress} />
                <p className="text-sm font-semibold text-primary">
                  Paso {index + 1} · {time}
                </p>
                <h3 className="text-h3 mt-1">{title}</h3>
                <p className="mt-1.5 text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>

        <Reveal className="lg:sticky lg:top-28 lg:self-start lg:pt-16">
          <div className="overflow-hidden rounded-[2rem] border border-line bg-card-solid shadow-lift">
            <div ref={imageRef} className="relative aspect-[16/10] overflow-hidden">
              <m.div style={{ scale: imageScale }} className="absolute inset-0">
                <Image
                  src={homeImages.careJourney}
                  alt={homeImages.careJourneyAlt}
                  fill
                  sizes="(min-width: 1024px) 480px, 92vw"
                  className="object-cover"
                />
              </m.div>
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="text-h3">Tu primera consulta: qué llevar</h3>
              <ul className="mt-4 space-y-3">
                {WHAT_TO_BRING.map((item, index) => (
                  <li key={item} className="flex gap-3 text-fg">
                    <DrawnCheck delay={0.15 + index * 0.12} />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-2xl bg-bg-alt p-4 text-[0.95rem] text-muted">
                ¿No tienes estudios previos? No te preocupes: tu especialista te indicará solo lo necesario.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Con su propio MotionScope: motion solo se carga donde se usa (no en el layout raíz). */
export function CareJourney() {
  return (
    <MotionScope>
      <CareJourneyContent />
    </MotionScope>
  );
}
