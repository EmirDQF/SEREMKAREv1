import Link from "next/link";
import { Award, GraduationCap, ShieldCheck } from "lucide-react";
import type { Doctor } from "@/types/medical";
import { DoctorAvailabilityDialog } from "@/components/shared/DoctorAvailabilityDialog";
import { DoctorPortrait } from "@/components/shared/DoctorPortrait";
import { credentialsLabel, experienceLabel } from "@/lib/doctor";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const experience = experienceLabel(doctor);
  const education = doctor.education[1] ?? doctor.education[0];
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-card-solid shadow-soft transition-shadow duration-300 hover:shadow-lift">
      <div className="relative aspect-[4/4.4] overflow-hidden bg-bg-alt">
        <DoctorPortrait
          doctor={doctor}
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 92vw"
          className="scale-[1.06] transition-[scale,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [translate:calc(var(--tilt-x,0)*-10px)_calc(var(--tilt-y,0)*-10px)] group-hover:scale-[1.1]"
        />
        {experience ? (
          <span className="glass absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-heading">
            <Award aria-hidden strokeWidth={1.75} className="size-4 text-primary" />
            {experience}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-h3">
          <Link href={`/staff/${doctor.slug}`} className="hover:text-primary">
            {doctor.name}
          </Link>
        </h3>
        <p className="mt-1 font-medium text-primary">{doctor.specialty}</p>
        <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-bg-alt px-3 py-1 text-sm font-medium text-muted shadow-[inset_0_1px_0_rgb(255_255_255/0.9),inset_0_-1px_2px_rgb(15_23_42/0.08),0_1px_2px_rgb(15_23_42/0.06)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),inset_0_-1px_2px_rgb(0_0_0/0.4)]">
          <ShieldCheck aria-hidden strokeWidth={1.75} className="size-4 text-primary" />
          {credentialsLabel(doctor)}
        </p>
        {education ? (
          <p className="mt-4 flex items-start gap-2 text-[0.95rem] text-muted">
            <GraduationCap aria-hidden strokeWidth={1.75} className="mt-0.5 size-5 shrink-0 text-primary" />
            {education}
          </p>
        ) : null}
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Enfoque clínico">
          {doctor.focus.slice(0, 3).map((item) => (
            <li key={item} className="rounded-full bg-bg-alt px-3 py-1 text-sm text-fg">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <DoctorAvailabilityDialog doctor={doctor} triggerClassName="w-full" />
        </div>
      </div>
    </article>
  );
}
