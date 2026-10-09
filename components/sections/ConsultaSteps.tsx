import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, FileText, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { homeImages } from "@/data/home";
import { BOOKING_HREF } from "@/data/navigation";

interface Step {
  icon: LucideIcon;
  title: string;
  text: string;
  image: string;
  alt: string;
}

/** Los 3 pasos de la teleconsulta, con el texto real del material de la clínica. */
const STEPS: readonly Step[] = [
  {
    icon: CalendarCheck,
    title: "Reservas en línea",
    text: "Responde unas preguntas breves, elige tu horario y envía tus exámenes previos (foto o PDF) por WhatsApp.",
    image: homeImages.stepBook,
    alt: homeImages.stepBookAlt,
  },
  {
    icon: Video,
    title: "Te conectas por videollamada",
    text: "Conversa con el Dr. Daniel Ccolcca por WhatsApp, Zoom o Google Meet, el que prefieras.",
    image: homeImages.stepLink,
    alt: homeImages.stepLinkAlt,
  },
  {
    icon: FileText,
    title: "Plan de tratamiento y seguimiento",
    text: "Revisamos tus exámenes y recibes tu plan en formato digital; si el doctor lo indica, también la receta y las órdenes de exámenes.",
    image: homeImages.stepReview,
    alt: homeImages.stepReviewAlt,
  },
];

export function ConsultaSteps() {
  return (
    <section aria-labelledby="consulta-pasos-title" className="section-y">
      <div className="container-page">
        <SectionHeading
          id="consulta-pasos-title"
          eyebrow="Así es tu consulta virtual"
          title="De tu casa a tu plan de tratamiento, en 3 pasos"
          description="Sin traslados ni salas de espera. Ideal si te cuesta movilizarte o si vives fuera de Lima."
        />
        <RevealGroup as="ol" className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text, image, alt }, index) => (
            <RevealItem as="li" key={title} className="group overflow-hidden rounded-[1.75rem] border border-line bg-card-solid shadow-soft">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={image}
                  alt={alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 92vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
                />
                <span className="absolute left-4 top-4 grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-coral to-teal font-display text-lg font-bold text-white shadow-lift">
                  {index + 1}
                </span>
              </div>
              <div className="p-6">
                <h3 className="flex items-center gap-2 text-h3">
                  <Icon aria-hidden className="size-6 shrink-0 text-primary" /> {title}
                </h3>
                <p className="mt-2 text-muted">{text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href={BOOKING_HREF} className={buttonVariants({ size: "lg" })}>
            Reservar mi teleconsulta <ArrowRight aria-hidden />
          </Link>
          <Link href="/teleconsulta" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Cómo funciona en detalle
          </Link>
        </div>
      </div>
    </section>
  );
}
