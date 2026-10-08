import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Award, CalendarClock, GraduationCap, ShieldCheck } from "lucide-react";
import { CtaBand } from "@/components/pages/CtaBand";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { DoctorAvailabilityDialog } from "@/components/shared/DoctorAvailabilityDialog";
import { DoctorPortrait } from "@/components/shared/DoctorPortrait";
import { JsonLd } from "@/components/shared/JsonLd";
import { KineticText } from "@/components/shared/KineticText";
import { Reveal } from "@/components/shared/Reveal";
import { TiltCard } from "@/components/shared/TiltCard";
import { doctors } from "@/data/doctors";
import { blogPosts } from "@/data/home";
import { site } from "@/data/site";
import { specialties } from "@/data/specialties";
import { describeBlock } from "@/lib/booking";
import { findDoctor } from "@/lib/catalog";
import { credentialsLabel, experienceLabel, hasVerifiableCmp } from "@/lib/doctor";
import { breadcrumbSchema, physicianSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { messageForDoctor } from "@/lib/whatsapp";

const CMP_LOOKUP_URL = "https://www.cmp.org.pe/conoce-a-tu-medico/";

export const dynamicParams = false;

export function generateStaticParams() {
  return doctors.map((doctor) => ({ slug: doctor.slug }));
}

export async function generateMetadata({ params }: PageProps<"/staff/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const doctor = findDoctor(slug);
  if (!doctor) return {};
  const title = `${doctor.name}, ${doctor.title.toLowerCase()} en Lima | ${site.name}`;
  return {
    ...buildMetadata({ title, description: `${doctor.specialty}. Enfoque: ${doctor.focus.join(", ")}.`, path: `/staff/${slug}` }),
    title: { absolute: title },
  };
}

export default async function DoctorPage({ params }: PageProps<"/staff/[slug]">) {
  const { slug } = await params;
  const doctor = findDoctor(slug);
  if (!doctor) notFound();
  const path = `/staff/${slug}`;
  const crumbs = [
    { label: "Inicio", href: "/" },
    { label: "Staff médico", href: "/staff" },
    { label: doctor.name, href: path },
  ];
  const conditions = specialties.filter((specialty) => specialty.doctorSlug === slug);
  const articles = blogPosts.filter((post) => post.authorSlug === slug);
  const experience = experienceLabel(doctor);

  return (
    <>
      <JsonLd
        data={physicianSchema({ name: doctor.name, path, specialty: doctor.specialty, image: doctor.photo, knowsAbout: doctor.focus })}
      />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <section aria-labelledby="medico-title" className="relative overflow-hidden pb-16 pt-36 sm:pt-40">
        <div aria-hidden className="mesh-bg -z-10" />
        <div className="container-page grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <TiltCard className="mx-auto max-w-md rounded-[2rem]">
              <div className="relative aspect-[4/4.6] overflow-hidden rounded-[2rem] shadow-lift">
                <DoctorPortrait
                  doctor={doctor}
                  fill
                  priority
                  sizes="(min-width: 1024px) 420px, 90vw"
                  className="scale-[1.06] [translate:calc(var(--tilt-x,0)*-10px)_calc(var(--tilt-y,0)*-10px)]"
                />
                {experience ? (
                  <span className="glass absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-heading">
                    <Award aria-hidden strokeWidth={1.75} className="size-4 text-primary" /> {experience}
                  </span>
                ) : null}
              </div>
            </TiltCard>
          </Reveal>
          <div>
            <Breadcrumbs items={crumbs} />
            <p className="mt-6 font-semibold text-primary">{doctor.title}</p>
            <h1 id="medico-title" className="text-display mt-2 text-heading">
              <KineticText text={doctor.name} priority />
            </h1>
            <p className="mt-4 text-lg text-muted">{doctor.specialty}</p>
            {hasVerifiableCmp(doctor) ? (
              <a
                href={CMP_LOOKUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-bg-alt px-4 font-medium text-muted shadow-[inset_0_1px_0_rgb(255_255_255/0.9),inset_0_-1px_2px_rgb(15_23_42/0.08)] hover:text-primary"
              >
                <ShieldCheck aria-hidden strokeWidth={1.75} className="size-5 text-primary" />
                {credentialsLabel(doctor)}
                <span className="text-sm">(verificar en el CMP; se abre en otra pestaña)</span>
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
            ) : (
              <p className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-bg-alt px-4 font-medium text-muted">
                <ShieldCheck aria-hidden strokeWidth={1.75} className="size-5 text-primary" />
                {credentialsLabel(doctor)}
              </p>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-line bg-card-solid p-5 shadow-soft">
                <h2 className="flex items-center gap-2 font-display font-semibold text-heading">
                  <GraduationCap aria-hidden strokeWidth={1.75} className="size-5 text-primary" /> Formación
                </h2>
                {doctor.education.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-[0.95rem] text-fg">
                    {doctor.education.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal" /> {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-[0.95rem] text-muted">Formación por confirmar.</p>
                )}
              </div>
              <div className="rounded-[1.5rem] border border-line bg-card-solid p-5 shadow-soft">
                <h2 className="flex items-center gap-2 font-display font-semibold text-heading">
                  <CalendarClock aria-hidden strokeWidth={1.75} className="size-5 text-primary" /> Horarios
                </h2>
                <ul className="mt-3 space-y-2 text-[0.95rem] text-fg">
                  {doctor.schedule.map(describeBlock).map((block) => (
                    <li key={block.key}>
                      <span className="font-semibold text-heading">{block.days}</span>
                      <br />
                      {block.hours} · {block.modalities}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <h2 className="mt-8 font-display font-semibold text-heading">Enfoque clínico</h2>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Enfoque clínico">
              {doctor.focus.map((item) => (
                <li key={item} className="rounded-full bg-teal-tint px-3.5 py-1.5 text-sm font-semibold text-primary">
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 max-w-sm">
              <DoctorAvailabilityDialog doctor={doctor} triggerClassName="w-full" />
            </div>
          </div>
        </div>
      </section>

      {conditions.length > 0 || articles.length > 0 ? (
        <section aria-label="Más sobre el especialista" className="pb-16">
          <div className="container-page grid gap-6 md:grid-cols-2">
            {conditions.length > 0 ? (
              <div className="rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft">
                <h2 className="text-h3">Condiciones que atiende</h2>
                <ul className="mt-3 space-y-1">
                  {conditions.map((specialty) => (
                    <li key={specialty.slug}>
                      <Link
                        href={`/especialidades/${specialty.slug}`}
                        className="flex min-h-12 items-center justify-between gap-3 font-display font-semibold text-primary hover:underline"
                      >
                        {specialty.name} <ArrowRight aria-hidden className="size-5 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {articles.length > 0 ? (
              <div className="rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft">
                <h2 className="text-h3">Artículos de {doctor.name.split(" ").slice(0, 2).join(" ")}</h2>
                <ul className="mt-3 space-y-1">
                  {articles.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex min-h-12 items-center justify-between gap-3 font-display font-semibold text-primary hover:underline"
                      >
                        {post.title} <ArrowRight aria-hidden className="size-5 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <CtaBand
        title={`Agenda con ${doctor.name}`}
        text="Elige videollamada o llamada y el turno que te acomode, de lunes a viernes desde las 7:00 p.m."
        message={messageForDoctor(doctor.name)}
      />
    </>
  );
}
