import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { doctorContact } from "@/lib/whatsapp";

/**
 * Botón flotante de WhatsApp con el doctor, solo en tablet y escritorio (en móvil lo reemplaza la
 * barra inferior: una sola barra). Componente de servidor, sin JS; el texto de ayuda aparece al hover
 * o con el foco del teclado.
 */
export function WhatsAppFloat() {
  const contact = doctorContact();
  if (!contact) return null;
  return (
    <a
      href={contact.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50 hidden items-center gap-3 rounded-full md:flex"
    >
      <span className="glass pointer-events-none translate-x-2 rounded-2xl px-4 py-2.5 text-base opacity-0 shadow-soft transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
        <span className="block font-display font-semibold text-heading">¿Tienes dudas? Escríbele al doctor</span>
        <span className="block text-sm text-muted">Por WhatsApp</span>
      </span>
      <span className="grid size-16 place-items-center rounded-full bg-whatsapp text-on-whatsapp-brand shadow-lift transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
        <WhatsAppIcon className="size-8" />
      </span>
      <span className="sr-only"> (se abre en otra pestaña)</span>
    </a>
  );
}
