import { site } from "@/data/site";
import { primaryWhatsAppLine } from "@/lib/locations";
import type { ClinicLocation, WhatsAppLine } from "@/types/medical";

/** Número internacional sin «+» ni ceros iniciales (E.164: 8 a 15 dígitos). */
const INTERNATIONAL_NUMBER = /^[1-9]\d{7,14}$/;

/** Mensaje prellenado de «Hablar con el doctor». Solo texto fijo: ningún dato del visitante viaja en la URL. */
export const DOCTOR_INFO_MESSAGE = "Hola Doctor, deseo más información para una teleconsulta médica";

export function buildWhatsAppLink(number: string, message: string): string {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export interface DoctorContact {
  whatsappHref: string;
  telHref: string;
  /** "+51 994 931 540" */
  display: string;
}

/** Enlaces de WhatsApp y llamada para una línea; null si falta o no es válida (nunca enlaces rotos). */
export function buildDoctorContact(line: WhatsAppLine | null, message: string = DOCTOR_INFO_MESSAGE): DoctorContact | null {
  const digits = line?.number.replace(/\D/g, "") ?? "";
  if (!line || !INTERNATIONAL_NUMBER.test(digits)) return null;
  return { whatsappHref: buildWhatsAppLink(digits, message), telHref: `tel:+${digits}`, display: line.display };
}

/** Contacto directo con el doctor desde la línea centralizada en data/site.ts (`doctorLine`). */
export function doctorContact(message: string = DOCTOR_INFO_MESSAGE): DoctorContact | null {
  return buildDoctorContact(site.doctorLine, message);
}

/** Enlace a la línea principal de WhatsApp con un mensaje (por defecto, el saludo base). */
export function clinicWhatsApp(message: string = site.defaultWhatsAppMessage): string {
  return buildWhatsAppLink(primaryWhatsAppLine().number, message);
}

/** Enlace al WhatsApp de una sede concreta. */
export function locationWhatsApp(location: ClinicLocation, message: string = site.defaultWhatsAppMessage): string {
  return buildWhatsAppLink(location.whatsapp.number, message);
}

/** "…una densitometría ósea." → "…una densitometría ósea en la sede de Los Olivos." */
export function withLocation(message: string, location: ClinicLocation): string {
  return `${message.replace(/\.\s*$/, "")} en la sede de ${location.name}.`;
}

/** "Hola SERMEKARE, quiero agendar una teleconsulta por gota." */
export function messageAbout(topic: string, doctorName?: string): string {
  const withDoctor = doctorName ? ` con ${doctorName}` : "";
  return `Hola ${site.name}, quiero agendar una teleconsulta${withDoctor} por ${topic.toLowerCase()}.`;
}

/** "Hola SERMEKARE, quiero agendar una teleconsulta con el Dr. Daniel Ccolcca." */
export function messageForDoctor(doctorName: string): string {
  return `Hola ${site.name}, quiero agendar una teleconsulta con ${doctorName}.`;
}

/** Pedido de un suplemento (solo el producto, nunca datos del visitante). Sin producto: consulta general. */
export function supplementOrderMessage(product?: { name: string; presentation: string }): string {
  if (!product) return `Hola ${site.name}, quisiera información sobre los suplementos que ofrecen.`;
  return `Hola ${site.name}, quiero pedir: ${product.name} (${product.presentation}). ¿Está disponible?`;
}

export function buildMailtoLink(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
