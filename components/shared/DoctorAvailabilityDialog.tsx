import Link from "next/link";
import { CalendarClock } from "lucide-react";
import type { Doctor } from "@/types/medical";
import { DialogPanel, DialogTrigger } from "@/components/ui/dialog";
import { buttonVariants, type ButtonVariant } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { DoctorHours } from "@/components/shared/DoctorHours";
import { APPOINTMENT_HREF } from "@/data/navigation";
import { clinicWhatsApp, messageForDoctor } from "@/lib/whatsapp";
import { credentialsLabel } from "@/lib/doctor";
import { cn } from "@/lib/utils";

interface DoctorAvailabilityDialogProps {
  doctor: Doctor;
  triggerClassName?: string;
  /** Variante del botón que abre el diálogo (en el agendador es secundario). */
  triggerVariant?: ButtonVariant;
  /** Si el mismo médico aparece dos veces en la página, un sufijo distinto evita ids repetidos. */
  idSuffix?: string;
}

/** "Dra. Valeria Quintana Ríos" → "Dra. Valeria" */
function shortName(name: string): string {
  return name.split(" ").slice(0, 2).join(" ");
}

/** Componente de servidor: el contenido (horario, enlaces) va en el HTML; SiteEffects abre el <dialog> nativo. */
export function DoctorAvailabilityDialog({ doctor, triggerClassName, triggerVariant = "primary", idSuffix = "" }: DoctorAvailabilityDialogProps) {
  const dialogId = `disponibilidad-${doctor.slug}${idSuffix}`;
  return (
    <>
      <DialogTrigger dialogId={dialogId} className={cn(buttonVariants({ variant: triggerVariant }), triggerClassName)}>
        <CalendarClock aria-hidden strokeWidth={1.75} />
        Ver disponibilidad
        <span className="sr-only">de {doctor.name}</span>
      </DialogTrigger>
      <DialogPanel id={dialogId} title={doctor.name} description={`${doctor.title} · ${credentialsLabel(doctor)}`}>
        <DoctorHours doctor={doctor} className="mt-6" />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={APPOINTMENT_HREF} className={cn(buttonVariants({ variant: "primary" }), "flex-1")}>
            <CalendarClock aria-hidden strokeWidth={1.75} />
            Reservar con {shortName(doctor.name)}
          </Link>
          <a
            href={clinicWhatsApp(messageForDoctor(doctor.name))}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "whatsapp" }), "flex-1")}
          >
            <WhatsAppIcon />
            WhatsApp<span className="sr-only"> (se abre en otra pestaña)</span>
          </a>
        </div>
        <Link href={`/staff/${doctor.slug}`} className="mt-3 inline-flex min-h-12 items-center font-semibold text-primary hover:underline">
          Ver perfil completo
        </Link>
      </DialogPanel>
    </>
  );
}
