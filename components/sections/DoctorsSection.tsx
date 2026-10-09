import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DoctorCard } from "@/components/shared/DoctorCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { TiltCard } from "@/components/shared/TiltCard";
import { doctors } from "@/data/doctors";

export function DoctorsSection() {
  return (
    <section aria-labelledby="staff-title" className="section-y bg-bg-alt">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="staff-title"
            align="left"
            eyebrow="Tu especialista"
            title="Un reumatólogo que te escucha y te explica"
            description="Te atiende el Dr. Daniel Ccolcca, médico reumatólogo, por videollamada desde cualquier lugar del Perú."
          />
          <Link
            href="/staff"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 font-display font-semibold text-primary hover:underline"
          >
            Ver perfil y disponibilidad <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
          </Link>
        </div>
        <RevealGroup as="ul" className={doctors.length > 1 ? "mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4" : "mx-auto mt-12 grid max-w-sm gap-5"}>
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
  );
}
