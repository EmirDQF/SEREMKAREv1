import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { InsuranceMarquee } from "@/components/sections/InsuranceMarquee";
import { PainPoints } from "@/components/sections/PainPoints";
import { SymptomTriage } from "@/components/sections/SymptomTriage";
import { WhyUs } from "@/components/sections/WhyUs";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { TreatmentsGrid } from "@/components/sections/TreatmentsGrid";
import { BoneDensitySection } from "@/components/sections/BoneDensitySection";
import { CareJourney } from "@/components/sections/CareJourney";
import { DoctorsSection } from "@/components/sections/DoctorsSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { VideoSection } from "@/components/sections/VideoSection";
import { TelemedicineBand } from "@/components/sections/TelemedicineBand";
import { AppointmentForm } from "@/components/sections/AppointmentForm";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { FAQ } from "@/components/sections/FAQ";
import { LocationCTA } from "@/components/sections/LocationCTA";
import { site } from "@/data/site";
import { visibility } from "@/data/visibility";
import { DEFAULT_DESCRIPTION, buildMetadata } from "@/lib/seo";

const HOME_TITLE = `Reumatólogo en Lima Norte y Callao | ${site.name}`;

export const metadata: Metadata = {
  ...buildMetadata({ title: HOME_TITLE, description: DEFAULT_DESCRIPTION, path: "/" }),
  title: { absolute: HOME_TITLE },
};

export default function Home() {
  return (
    <>
      <Hero />
      {/* D2: sin convenios confirmados no se muestran aseguradoras. */}
      {visibility.insurers ? <InsuranceMarquee /> : null}
      <PainPoints />
      <SymptomTriage />
      <WhyUs />
      <ServicesGrid />
      <TreatmentsGrid />
      {/* D3: las infiltraciones ecoguiadas no están respaldadas por el material real. */}
      <BoneDensitySection />
      <CareJourney />
      <DoctorsSection />
      <Testimonials />
      {visibility.sampleVideo ? <VideoSection /> : null}
      <TelemedicineBand />
      <AppointmentForm />
      <BlogPreview />
      <FAQ />
      <LocationCTA />
    </>
  );
}
