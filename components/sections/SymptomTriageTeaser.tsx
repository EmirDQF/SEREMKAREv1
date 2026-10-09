import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { TRIAGE_HREF } from "@/data/navigation";
import { TRIAGE_SECTION_ID } from "@/lib/triage-events";

/**
 * Versión estática de «¿Dónde te duele?» (servidor): reserva el espacio del triage interactivo mientras
 * su JS carga y, sin JavaScript, lleva a la evaluación del consultorio virtual.
 */
export function SymptomTriageTeaser() {
  return (
    <section
      id={TRIAGE_SECTION_ID}
      aria-labelledby="triage-title"
      className="section-y relative isolate min-h-[60rem] overflow-hidden rounded-[2.5rem] bg-navy text-slate-200 lg:min-h-[52rem] lg:rounded-[4rem] dark:bg-[#071222]"
    >
      <div aria-hidden className="immersive-glow -z-10" />
      <div aria-hidden className="immersive-grid -z-10" />
      <div className="container-page">
        <SectionHeading
          tone="inverted"
          id="triage-title"
          eyebrow="Orientación en 1 minuto"
          title="¿Dónde te duele?"
          accent="duele?"
          description="Toca la zona de tu cuerpo o elige una condición. Te orientamos sobre qué puede ser y con quién atenderte."
        />
        <p className="mt-10 text-center">
          <Link href={TRIAGE_HREF} className={buttonVariants({ variant: "light", size: "lg" })}>
            Evaluar mis síntomas <ArrowRight aria-hidden />
          </Link>
        </p>
      </div>
    </section>
  );
}
