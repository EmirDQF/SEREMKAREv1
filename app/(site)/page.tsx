import type { Metadata } from "next";
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
import { CENTER_MISSION, CENTER_TAGLINE, site } from "@/data/site";
import { physicianSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/*
 * Aseguradoras: con convenios firmados (visibility.insurers), volver a montar
 * <InsurersIsland /> (components/shared/OptionalIslands) después de <TrustStrip />. No se importa
 * mientras esté oculta: el build con webpack empaquetaba su JS aunque no se renderizara.
 */

const HOME_TITLE = `${CENTER_TAGLINE} en Lima | ${site.name}`;
const HOME_DESCRIPTION = `${CENTER_MISSION} Densitometría ósea en Lima Norte y Callao. Agenda tu cita en línea.`;

export const metadata: Metadata = {
  ...buildMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" }),
  title: { absolute: HOME_TITLE },
};

/**
 * Home del Centro de Excelencia en Reumatología. Las secciones sin datos reales (aseguradoras,
 * testimonios) se reactivan desde data/visibility.ts.
 */
export default function Home() {
  const doctor = getDoctor(REAL_DOCTOR_SLUG);
  return (
    <>
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
        <Testimonials />
        <div className="cv-auto"><LocationCTA /></div>
        <div className="cv-auto"><FAQ /></div>
        <ContactoDoctor id="contacto-title" className="section-y" />
    </>
  );
}
