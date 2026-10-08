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

const TITLE = `Staff médico: reumatólogos en Lima Norte y Callao | ${site.name}`;
const DESCRIPTION =
  "Conoce a nuestros reumatólogos y especialistas en salud articular: formación, enfoque clínico, horarios y cómo agendar con cada uno.";
const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Staff médico", href: "/staff" },
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
        eyebrow="Staff médico"
        title="Especialistas que te escuchan y te explican"
        accent="te escuchan"
        lead="Médicos con colegiatura (CMP) y registro de especialidad (RNE) vigentes, dedicados a la salud articular."
      />
      <section aria-label="Médicos" className="pb-16">
        <div className="container-page">
          <RevealGroup as="ul" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
