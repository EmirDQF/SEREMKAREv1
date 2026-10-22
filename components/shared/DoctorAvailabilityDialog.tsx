import Link from "next/link";
import { CalendarClock } from "lucide-react";
import type { Doctor } from "@/types/medical";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
}

/** "Dra. Valeria Quintana Ríos" → "Dra. Valeria" */
function shortName(name: string): string {
  return name.split(" ").slice(0, 2).join(" ");
}

/** Componente de servidor: el contenido (horario, enlaces) se arma aquí; el diálogo nativo es la única pieza cliente. */
export function DoctorAvailabilityDialog({ doctor, triggerClassName, triggerVariant = "primary" }: DoctorAvailabilityDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className={cn(buttonVariants({ variant: triggerVariant }), triggerClassName)}>
        <CalendarClock aria-hidden strokeWidth={1.75} />
        Ver disponibilidad
        <span className="sr-only">de {doctor.name}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{doctor.name}</DialogTitle>
        <DialogDescription>
          {doctor.title} · {credentialsLabel(doctor)}
        </DialogDescription>

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
      </DialogContent>
    </Dialog>
  );
}
