import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { InsuranceMarquee } from "@/components/sections/InsuranceMarquee";
import { PainPoints } from "@/components/sections/PainPoints";
import { SymptomTriage } from "@/components/sections/SymptomTriage";
import { ConsultaSteps } from "@/components/sections/ConsultaSteps";
import { DoctorsSection } from "@/components/sections/DoctorsSection";
import { BoneDensitySection } from "@/components/sections/BoneDensitySection";
import { WhyUs } from "@/components/sections/WhyUs";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { PricingPreview } from "@/components/sections/PricingPreview";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { LocationCTA } from "@/components/sections/LocationCTA";
import { JsonLd } from "@/components/shared/JsonLd";
import { REAL_DOCTOR_SLUG, getDoctor } from "@/data/doctors";
import { site } from "@/data/site";
import { visibility } from "@/data/visibility";
import { physicianSchema, teleconsultServiceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

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
      {/* Orden móvil: hero → teleconsulta (3 pasos) → el doctor → servicios → sedes → preguntas → contacto. */}
      <Hero />
      <ConsultaSteps />
      <DoctorsSection />
      <TrustStrip />
      {visibility.insurers ? <InsuranceMarquee /> : null}
      <ServicesGrid />
      <BoneDensitySection />
      <PricingPreview />
      <PainPoints />
      <SymptomTriage />
      <WhyUs />
      <Testimonials />
      <LocationCTA />
      <FAQ />
    </>
  );
}
