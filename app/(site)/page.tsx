import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { TelemedicineBand } from "@/components/sections/TelemedicineBand";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { DoctorsSection } from "@/components/sections/DoctorsSection";
import { BoneDensitySection } from "@/components/sections/BoneDensitySection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { SupplementsStrip } from "@/components/sections/SupplementsStrip";
import { PatientRoute } from "@/components/sections/PatientRoute";
import { HoursSection } from "@/components/sections/HoursSection";
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
 * Home del Centro de Excelencia en Reumatología. Las secciones que ya no van en la Home
 * (PainPoints, SymptomTriage, WhyUs, PricingPreview, ConsultaSteps) siguen en el código; las que no
 * tienen datos reales (aseguradoras, testimonios) se reactivan desde data/visibility.ts.
 */
export default function Home() {
  const doctor = getDoctor(REAL_DOCTOR_SLUG);
  return (
    <>
      <JsonLd data={teleconsultServiceSchema("/teleconsulta")} />
      <JsonLd data={physicianSchema({ name: doctor.name, path: `/staff/${doctor.slug}`, specialty: doctor.specialty, image: doctor.photo, knowsAbout: doctor.focus })} />
      {/* Orden móvil (decisión del cliente): hero → pilares → densitometría → servicio extra →
          suplementos → ruta del paciente + horario → doctor y equipo → sedes → preguntas → contacto.
          .cv-auto (content-visibility: auto): el navegador no pinta las secciones largas hasta acercarse. */}
      <Hero />
      <div className="cv-auto"><ServicesGrid /></div>
      <div className="cv-auto"><BoneDensitySection /></div>
      <div className="cv-auto"><TelemedicineBand /></div>
      <div className="cv-auto"><SupplementsStrip /></div>
      <div className="cv-auto">
        <PatientRoute />
        <HoursSection />
      </div>
      <div className="cv-auto"><DoctorsSection /></div>
      <TrustStrip />
      {visibility.insurers ? <InsurersIsland /> : null}
      <Testimonials />
      <div className="cv-auto"><LocationCTA /></div>
      <div className="cv-auto"><FAQ /></div>
      <ContactoDoctor id="contacto-title" className="section-y" />
    </>
  );
}
