import Link from "next/link";
import { ArrowRight, Info, MonitorSmartphone, Users, Video } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { DoctorPortrait } from "@/components/shared/DoctorPortrait";
import { buttonVariants } from "@/components/ui/button";
import { REAL_DOCTOR_SLUG, getDoctor } from "@/data/doctors";
import { BOOKING_HREF } from "@/data/navigation";
import { getServiceDetail } from "@/data/service-details";
import { teleconsultLimits } from "@/data/teleconsult-content";
import { doctorContact } from "@/lib/whatsapp";

/** 3 pasos simples (resumen de la guía real de /teleconsulta). */
const STEPS = [
  { title: "Agenda", body: "Elige tu horario aquí en la web o escríbenos por WhatsApp." },
  { title: "Conéctate", body: "Videollamada por WhatsApp, Zoom o Google Meet, el que prefieras." },
  { title: "Recibe tu plan", body: "Plan de tratamiento digital y, si el doctor lo indica, receta y órdenes." },
] as const;

/** Las otras dos modalidades a distancia, en una línea cada una. */
const MORE_MODES = [
  { icon: Users, title: "Teleinterconsulta", body: "Tu médico tratante y nuestro especialista revisan tu caso juntos, a distancia." },
  { icon: MonitorSmartphone, title: "Atención híbrida", body: "Consulta presencial y seguimiento virtual, según lo que necesite tu tratamiento." },
] as const;

interface TelemedicineBandProps {
  /** id del h2 (la Home y /servicios usan ids distintos). */
  id?: string;
}

/**
 * «Servicio extra: Teleconsulta». Bloque visualmente distinto de los pilares (borde punteado en
 * azul de videollamada sobre fondo claro). Componente de servidor, sin blur ni animaciones de JS.
 */
export function TelemedicineBand({ id = "tele-title" }: TelemedicineBandProps) {
  const doctor = getDoctor(REAL_DOCTOR_SLUG);
  const contact = doctorContact();
  const { forWhom } = getServiceDetail("telemedicina");
  return (
    <section aria-labelledby={id} className="section-y">
      <div className="container-page">
        <div className="relative rounded-[2rem] border-2 border-dashed border-video/40 bg-[linear-gradient(180deg,var(--video-tint),transparent_70%)] p-6 sm:p-10 lg:p-12">
          <p className="inline-flex items-center gap-2 rounded-full bg-video px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-on-video">
            <Video aria-hidden strokeWidth={2} className="size-4" /> Servicio extra
          </p>

          <div className="mt-5 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
            <div className="min-w-0">
              <h2 id={id} className="text-h2 text-heading">
                Teleconsulta: <span className="text-video">tu control desde casa</span>
              </h2>
              <p className="mt-4 text-lg text-muted">
                <strong className="font-semibold text-heading">¿Para quién es?</strong> {forWhom}
              </p>

              <ol className="mt-8 grid gap-4 sm:grid-cols-3">
                {STEPS.map((step, index) => (
                  <li key={step.title} className="rounded-2xl border border-line bg-card-solid p-4 shadow-soft">
                    <span
                      aria-hidden
                      className="grid size-9 place-items-center rounded-full bg-video-tint font-display font-bold text-video"
                    >
                      {index + 1}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-bold text-heading">{step.title}</h3>
                    <p className="mt-1 text-[0.95rem] text-muted">{step.body}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href={BOOKING_HREF} className={buttonVariants({ variant: "primary", size: "lg" })}>
                  <Video aria-hidden strokeWidth={1.75} />
                  Agendar teleconsulta
                </Link>
                {contact ? (
                  <a
                    href={contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "outline", size: "lg" })}
                  >
                    <WhatsAppIcon className="text-whatsapp-strong" />
                    Escríbele al doctor
                    <span className="sr-only"> (WhatsApp, se abre en otra pestaña)</span>
                  </a>
                ) : null}
              </div>
              <Link
                href="/teleconsulta"
                className="mt-3 inline-flex min-h-12 items-center gap-1.5 font-display font-semibold text-video hover:underline"
              >
                Cómo funciona la teleconsulta <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
              </Link>
            </div>

            <div className="min-w-0 space-y-4">
              <div className="flex items-center gap-4 rounded-2xl border border-line bg-card-solid p-4 shadow-soft">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-bg-alt">
                  <DoctorPortrait doctor={doctor} fill sizes="64px" alt="" />
                </span>
                <span>
                  <span className="block font-display font-bold text-heading">{doctor.name}</span>
                  <span className="block text-sm text-muted">{doctor.title} · por videollamada</span>
                </span>
              </div>
              <ul className="space-y-3">
                {MORE_MODES.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="flex gap-3 rounded-2xl border border-line bg-card-solid p-4">
                    <Icon aria-hidden strokeWidth={1.75} className="mt-0.5 size-6 shrink-0 text-video" />
                    <span>
                      <span className="block font-display font-bold text-heading">{title}</span>
                      <span className="block text-[0.95rem] text-muted">{body}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3 rounded-2xl border border-line bg-bg-alt p-4 text-[0.95rem] text-muted">
                <Info aria-hidden strokeWidth={1.75} className="mt-0.5 size-5 shrink-0 text-heading" />
                <p>
                  <strong className="font-semibold text-heading">¿Cuándo no sirve?</strong> {teleconsultLimits.physicalExam}{" "}
                  {teleconsultLimits.emergency}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
