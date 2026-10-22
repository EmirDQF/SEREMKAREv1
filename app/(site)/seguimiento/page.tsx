import type { Metadata } from "next";
import { BellRing, CalendarClock, FileCheck2, PackageCheck } from "lucide-react";
import { PageHero } from "@/components/pages/PageHero";
import { PatientRoute } from "@/components/sections/PatientRoute";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { JsonLd } from "@/components/shared/JsonLd";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { clinicWhatsApp } from "@/lib/whatsapp";

const PATH = "/seguimiento";
const TITLE = `Seguimiento continuo del paciente reumático | ${site.name}`;
const DESCRIPTION =
  "Después de tu cita no te dejamos solo: recordatorios, entrega de resultados, controles programados y reposición de suplementos por WhatsApp.";
const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Seguimiento", href: PATH },
] as const;

/** Mensaje fijo: ningún dato personal viaja en la URL. */
const CONTROL_MESSAGE = `Hola ${site.name}, quiero solicitar mi control.`;

const FOLLOW_UP = [
  { icon: BellRing, title: "Recordatorio de tu cita", body: "Te escribimos por WhatsApp antes de tu cita para que no la olvides." },
  { icon: FileCheck2, title: "Entrega de resultados", body: "Te avisamos cuando tus resultados están listos y cómo recibirlos." },
  { icon: CalendarClock, title: "Control programado", body: "Tu médico define cada cuánto debes volver y te ayudamos a agendarlo." }, // CONFIRMAR: intervalo de controles
  { icon: PackageCheck, title: "Reposición de suplementos", body: "Si tu médico te indicó suplementos, te recordamos cuándo reponerlos." },
] as const;

export const metadata: Metadata = {
  ...buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH }),
  title: { absolute: TITLE },
};

/** Página informativa: sin portal de pacientes y sin guardar datos clínicos. */
export default function FollowUpPage() {
  const controlHref = clinicWhatsApp(CONTROL_MESSAGE);
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <PageHero
        id="seguimiento-title"
        crumbs={CRUMBS}
        eyebrow="Seguimiento continuo"
        title="Después de tu cita, seguimos contigo"
        accent="seguimos contigo"
        lead="Tu tratamiento no termina en la consulta. Te acompañamos paso a paso para que sepas cómo vas."
        actions={
          <a href={controlHref} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "whatsapp", size: "lg" })}>
            <WhatsAppIcon /> Solicitar mi control
            <span className="sr-only"> por WhatsApp (se abre en otra pestaña)</span>
          </a>
        }
      />
      <section aria-labelledby="como-title" className="pb-8">
        <div className="container-page">
          <h2 id="como-title" className="text-h2 text-heading">
            Cómo te acompañamos
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FOLLOW_UP.map(({ icon: Icon, title, body }) => (
              <li key={title} className="rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft">
                <Icon aria-hidden strokeWidth={1.75} className="size-7 text-primary" />
                <h3 className="text-h3 mt-3 text-heading">{title}</h3>
                <p className="mt-1 text-muted">{body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            Por WhatsApp solo coordinamos citas y avisos. Tus datos se tratan según nuestra política de privacidad (Ley N.° 29733).
          </p>
        </div>
      </section>
      <PatientRoute id="ruta-seguimiento-title" withLink={false} />
    </>
  );
}
