import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { DoctorPortrait } from "@/components/shared/DoctorPortrait";
import { buttonVariants } from "@/components/ui/button";
import { REAL_DOCTOR_SLUG, getDoctor } from "@/data/doctors";
import { type DoctorContact, doctorContact } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface DoctorContactButtonsProps {
  contact: DoctorContact;
  className?: string;
}

/** WhatsApp (pestaña nueva) y llamada (`tel:`, sin target) con el doctor. */
export function DoctorContactButtons({ contact, className }: DoctorContactButtonsProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
      <a
        href={contact.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "whatsapp", size: "lg" })}
      >
        <WhatsAppIcon /> Escribir por WhatsApp
        <span className="sr-only"> (se abre en otra pestaña)</span>
      </a>
      <a href={contact.telHref} className={buttonVariants({ variant: "outline", size: "lg" })}>
        <Phone aria-hidden strokeWidth={1.75} /> Llamar al {contact.display}
      </a>
    </div>
  );
}

interface ContactoDoctorProps {
  /** id del título (único por página). */
  id?: string;
  /** Espaciado exterior de la sección. */
  className?: string;
}

/**
 * «¿Necesitas más información? Escríbele al doctor»: contacto directo por WhatsApp o llamada.
 * El número sale de data/site.ts (`doctorLine`); sin número válido no se muestra nada.
 */
export function ContactoDoctor({ id = "contacto-doctor-title", className }: ContactoDoctorProps) {
  const contact = doctorContact();
  if (!contact) return null;
  const doctor = getDoctor(REAL_DOCTOR_SLUG);
  return (
    <section aria-labelledby={id} className={cn("py-12", className)}>
      <div className="container-page">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-line bg-card-solid p-6 shadow-soft lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div className="flex items-center gap-4">
            <DoctorPortrait doctor={doctor} size={72} alt="" className="size-18 shrink-0 rounded-2xl" />
            <div className="min-w-0">
              <h2 id={id} className="text-h3">
                ¿Necesitas más información? Escríbele al doctor
              </h2>
              <p className="mt-1 text-muted">
                {doctor.name}, {doctor.title.toLowerCase()}. Escríbele por WhatsApp o llámalo.
              </p>
            </div>
          </div>
          <DoctorContactButtons contact={contact} className="shrink-0" />
        </div>
      </div>
    </section>
  );
}
