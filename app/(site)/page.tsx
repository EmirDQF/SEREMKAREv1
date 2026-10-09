import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { TelemedicineBand } from "@/components/sections/TelemedicineBand";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { PainPoints } from "@/components/sections/PainPoints";
import { SymptomTriageLazy } from "@/components/sections/SymptomTriageLazy";
import { SymptomTriageTeaser } from "@/components/sections/SymptomTriageTeaser";
import { ConsultaSteps } from "@/components/sections/ConsultaSteps";
import { DoctorsSection } from "@/components/sections/DoctorsSection";
import { BoneDensitySection } from "@/components/sections/BoneDensitySection";
import { WhyUs } from "@/components/sections/WhyUs";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { PricingPreview } from "@/components/sections/PricingPreview";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { LocationCTA } from "@/components/sections/LocationCTA";
import { ContactoDoctor } from "@/components/shared/ContactoDoctor";
import { JsonLd } from "@/components/shared/JsonLd";
import { REAL_DOCTOR_SLUG, getDoctor } from "@/data/doctors";
import { site } from "@/data/site";
import { visibility } from "@/data/visibility";
import { physicianSchema, teleconsultServiceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/** Aseguradoras: solo se descargan con convenios firmados (visibility.insurers). */
const InsurersIsland = dynamic(() => import("@/components/shared/OptionalIslands").then((mod) => mod.InsurersIsland));

const HOME_TITLE = `Reumatólogo online: teleconsulta por videollamada en todo el Perú | ${site.name}`;
const HOME_DESCRIPTION =
  "Consulta con un reumatólogo sin salir de casa: evaluación rápida, reserva en línea y videollamada por WhatsApp, Zoom o Google Meet. Densitometría ósea en Lima Norte y Callao.";

export const metadata: Metadata = {
  ...buildMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" }),
  title: { absolute: HOME_TITLE },
};

/**
 * Home transaccional del consultorio virtual. Secciones sin datos reales (aseguradoras,
 * testimonios, video de muestra, tratamientos, comparador de infiltraciones) siguen en el código
 * y se reactivan desde data/visibility.ts.
 */
export default function Home() {
  const doctor = getDoctor(REAL_DOCTOR_SLUG);
  return (
    <>
      <JsonLd data={teleconsultServiceSchema("/teleconsulta")} />
      <JsonLd data={physicianSchema({ name: doctor.name, path: `/staff/${doctor.slug}`, specialty: doctor.specialty, image: doctor.photo, knowsAbout: doctor.focus })} />
      {/* Orden móvil: hero → banda de telemedicina → teleconsulta (3 pasos) → el doctor → servicios → sedes → preguntas → contacto.
          .cv-auto (content-visibility: auto): el navegador no pinta las secciones largas hasta acercarse. */}
      <Hero />
      <TelemedicineBand />
      <ConsultaSteps />
      <div className="cv-auto"><DoctorsSection /></div>
      <TrustStrip />
      {visibility.insurers ? <InsurersIsland /> : null}
      <div className="cv-auto"><ServicesGrid /></div>
      <div className="cv-auto"><BoneDensitySection /></div>
      <div className="cv-auto"><PricingPreview /></div>
      <div className="cv-auto"><PainPoints /></div>
      <SymptomTriageLazy fallback={<SymptomTriageTeaser />} />
      <div className="cv-auto"><WhyUs /></div>
      <Testimonials />
      <div className="cv-auto"><LocationCTA /></div>
      <div className="cv-auto"><FAQ /></div>
      <ContactoDoctor id="contacto-title" className="section-y" />
    </>
  );
}
