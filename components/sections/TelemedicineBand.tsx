import Image from "next/image";
import { DoctorPortrait } from "@/components/shared/DoctorPortrait";
import { Check, Mic, PhoneOff, Video } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { Reveal } from "@/components/shared/Reveal";
import { TiltCard } from "@/components/shared/TiltCard";
import { buttonVariants } from "@/components/ui/button";
import { doctors } from "@/data/doctors";
import { homeImages } from "@/data/home";
import { site } from "@/data/site";
import { clinicWhatsApp } from "@/lib/whatsapp";

const TELE_POINTS = [
  "Controles y lectura de resultados sin moverte",
  "Receta e indicaciones en formato digital",
  "Atención híbrida: combinamos teleconsulta y presencial",
] as const;

const TELE_MESSAGE = `Hola ${site.name}, quisiera agendar una teleconsulta.`;

/** "Consulta desde tu casa u oficina", con mockup de videollamada. */
export function TelemedicineBand() {
  const [doctor] = doctors;
  return (
    <section aria-labelledby="tele-title" className="section-y">
      <div className="container-page">
        <div className="relative isolate grid items-center gap-12 overflow-hidden rounded-[2rem] bg-navy px-6 py-12 text-white sm:px-10 lg:grid-cols-2 lg:px-14 lg:py-16 dark:bg-navy-3">
          <div aria-hidden className="absolute -left-24 -top-24 -z-10 size-80 rounded-full bg-teal/25 blur-3xl" />
          <div aria-hidden className="absolute -bottom-24 right-0 -z-10 size-80 rounded-full bg-video-strong/20 blur-3xl" />
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-teal-200">
              <Video aria-hidden strokeWidth={1.75} className="size-4" /> Telemedicina
            </p>
            <h2 id="tele-title" className="text-h2 mt-4 text-white">
              Consulta desde tu casa u oficina
            </h2>
            <p className="mt-4 text-lg text-slate-200">
              Si tu agenda está llena, tu especialista se conecta contigo por videollamada en el horario que elijas.
            </p>
            <ul className="mt-6 space-y-3">
              {TELE_POINTS.map((point) => (
                <li key={point} className="flex gap-3 text-slate-100">
                  <Check aria-hidden strokeWidth={2.25} className="mt-1 size-5 shrink-0 text-teal" />
                  {point}
                </li>
              ))}
            </ul>
            <a
              href={clinicWhatsApp(TELE_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonVariants({ variant: "light", size: "lg" })} mt-8`}
            >
              <WhatsAppIcon className="text-whatsapp-strong" />
              Agendar teleconsulta
            </a>
          </div>

          <Reveal className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal/40 animate-pulse-ring"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-video-glow/30 animate-pulse-ring [animation-delay:1.2s]"
            />
            <div className="animate-float">
              <TiltCard className="mx-auto max-w-lg rounded-[1.75rem]">
                <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-3 shadow-lift backdrop-blur-xl">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem]">
                    <Image
                      src={homeImages.telemedicine}
                      alt={homeImages.telemedicineAlt}
                      fill
                      sizes="(min-width: 1024px) 500px, 90vw"
                      className="object-cover"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-navy/70 px-3 py-1 text-xs font-semibold text-white">
                      <span aria-hidden className="size-2 rounded-full bg-coral" /> En consulta · 12:48
                    </span>
                    <div className="absolute bottom-3 right-3 w-[30%] overflow-hidden rounded-xl border-2 border-white/80 shadow-lift">
                      <div className="relative aspect-[3/4]">
                        <DoctorPortrait doctor={doctor} fill sizes="150px" alt={`Vista previa de ${doctor.name}`} />
                      </div>
                    </div>
                    <div aria-hidden className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                      <span className="grid size-10 place-items-center rounded-full bg-white/90 text-navy">
                        <Mic className="size-5" />
                      </span>
                      <span className="grid size-10 place-items-center rounded-full bg-white/90 text-navy">
                        <Video className="size-5" />
                      </span>
                      <span className="grid size-10 place-items-center rounded-full bg-coral text-white">
                        <PhoneOff className="size-5" />
                      </span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
