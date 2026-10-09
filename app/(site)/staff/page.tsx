import type { Metadata } from "next";
import { CtaBand } from "@/components/pages/CtaBand";
import { PageHero } from "@/components/pages/PageHero";
import { DoctorCard } from "@/components/shared/DoctorCard";
import { JsonLd } from "@/components/shared/JsonLd";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { TiltCard } from "@/components/shared/TiltCard";
import { doctors } from "@/data/doctors";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const TITLE = `Especialistas: reumatólogo por teleconsulta | ${site.name}`;
const DESCRIPTION =
  "Conoce al Dr. Daniel Ccolcca, médico reumatólogo: enfoque clínico, motivos de consulta y cómo agendar tu teleconsulta.";
const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Especialistas", href: "/staff" },
] as const;

export const metadata: Metadata = {
  ...buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/staff" }),
  title: { absolute: TITLE },
};

export default function StaffPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <PageHero
        id="staff-title"
        crumbs={CRUMBS}
        eyebrow="Especialistas"
        title="Un especialista que te escucha y te explica"
        accent="te escuchan"
        lead="Reumatología por videollamada para todo el Perú. Revisamos tus exámenes y te acompañamos en tu tratamiento."
      />
      <section aria-label="Médicos" className="pb-16">
        <div className="container-page">
          <RevealGroup as="ul" className="mx-auto grid max-w-sm gap-5">
            {doctors.map((doctor) => (
              <RevealItem as="li" key={doctor.slug}>
                <TiltCard className="h-full rounded-[1.75rem]">
                  <DoctorCard doctor={doctor} />
                </TiltCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
      <CtaBand
        title="¿No sabes con quién atenderte?"
        text="Cuéntanos qué te pasa y te orientamos con el especialista adecuado para tu caso."
        message={`Hola ${site.name}, quisiera que me orienten sobre con qué especialista atenderme.`}
      />
    </>
  );
}
