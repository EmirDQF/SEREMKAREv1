"use client";

import { useState } from "react";
import { Handshake, Pause, Play, ShieldCheck } from "lucide-react";
import { insurers } from "@/data/home";
import type { Insurer } from "@/types/medical";

function InsurerLogo({ insurer }: { insurer: Insurer }) {
  const ItemIcon = insurer.kind === "alianza" ? Handshake : ShieldCheck;
  return (
    <li className="shimmer flex shrink-0 items-center gap-2.5 rounded-2xl border border-line bg-card-solid px-5 py-3 text-subtle grayscale transition-[color,filter,transform,box-shadow] duration-300 hover:-translate-y-1 hover:text-heading hover:shadow-soft hover:grayscale-0 hover:[transform:rotateX(10deg)_translateY(-4px)]">
      <ItemIcon aria-hidden strokeWidth={1.75} className="size-6 text-teal" />
      <span className="whitespace-nowrap font-display font-bold tracking-tight">{insurer.label}</span>
    </li>
  );
}

/** Marquee infinito (pausable) de aseguradoras, EPS y alianzas. Logos genéricos PROVISIONALES. */
export function InsuranceMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section aria-labelledby="aseguradoras-title" className="border-y border-line bg-bg-alt/60 py-8">
      <div className="container-page flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex shrink-0 items-center justify-between gap-4 md:w-56 md:flex-col md:items-start">
          <h2 id="aseguradoras-title" className="font-display text-base font-semibold text-heading">
            Trabajamos con seguros, EPS y aliados
          </h2>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="inline-flex min-h-12 items-center gap-2 rounded-full px-3 text-sm font-semibold text-muted hover:bg-teal-tint hover:text-heading"
          >
            {paused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
            {paused ? "Reanudar" : "Pausar"}
            <span className="sr-only">el carrusel de aseguradoras</span>
          </button>
        </div>
        <div
          className="marquee relative min-w-0 flex-1 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] [perspective:900px]"
          data-paused={paused}
        >
          <div className="marquee-track flex w-max gap-4 [transform-style:preserve-3d]">
            <ul className="flex gap-4">
              {insurers.map((insurer) => (
                <InsurerLogo key={insurer.id} insurer={insurer} />
              ))}
            </ul>
            <ul className="flex gap-4" aria-hidden>
              {insurers.map((insurer) => (
                <InsurerLogo key={`dup-${insurer.id}`} insurer={insurer} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
