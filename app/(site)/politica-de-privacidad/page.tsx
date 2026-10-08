import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/pages/LegalDocument";
import { legal } from "@/data/legal";
import { site } from "@/data/site";
import { primaryWhatsAppLine } from "@/lib/locations";
import { buildMetadata } from "@/lib/seo";

const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Política de privacidad", href: "/politica-de-privacidad" },
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Política de privacidad",
  description: `Cómo ${site.name} protege tus datos personales y de salud conforme a la Ley N.° 29733.`,
  path: "/politica-de-privacidad",
});

// PROVISIONAL: texto base; revisar con asesoría legal antes de publicar.
const SECTIONS: readonly LegalSection[] = [
  {
    heading: "Responsable del tratamiento",
    paragraphs: [
      `${legal.businessName}, con RUC ${legal.ruc} y domicilio en ${legal.fiscalAddress}, es responsable del tratamiento de los datos personales que nos proporcionas a través de esta web, WhatsApp, teléfono o correo (${site.email}).`,
    ],
  },
  {
    heading: "Qué datos recopilamos",
    bullets: [
      "Datos de identificación y contacto: nombre, documento, teléfono y correo.",
      "Datos de tu solicitud: especialidad, motivo de consulta y fecha preferida.",
      "Datos de salud, solo cuando nos los compartes para tu atención (son datos sensibles).",
      "Datos técnicos de navegación mínimos, necesarios para el funcionamiento de la web.",
    ],
  },
  {
    heading: "Para qué usamos tus datos",
    bullets: [
      "Gestionar tus citas, teleconsultas y comunicaciones sobre tu atención.",
      "Responder tus consultas, reclamos y quejas.",
      "Enviarte la Guía de salud articular, solo si te suscribes (puedes darte de baja cuando quieras).",
      "Cumplir obligaciones legales y sanitarias.",
    ],
  },
  {
    heading: "Base legal y consentimiento",
    paragraphs: [
      "Tratamos tus datos con tu consentimiento libre, previo, expreso e informado, conforme a la Ley N.° 29733, Ley de Protección de Datos Personales, y su reglamento. Los datos de salud se tratan con especial reserva y solo para fines de tu atención.",
    ],
  },
  {
    heading: "Con quién compartimos tus datos",
    paragraphs: [
      "No vendemos tus datos. Solo los compartimos con proveedores que nos ayudan a prestar el servicio (por ejemplo, mensajería o laboratorio), bajo obligaciones de confidencialidad, o cuando la ley lo exige.",
    ],
  },
  {
    heading: "Cuánto tiempo los conservamos",
    paragraphs: [
      "Conservamos tus datos el tiempo necesario para tu atención y el que exigen las normas sanitarias sobre historia clínica; luego los eliminamos o anonimizamos.",
    ],
  },
  {
    heading: "Tus derechos",
    paragraphs: [
      `Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición (ARCO) escribiendo ${site.email ? `a ${site.email}` : `por WhatsApp a la línea principal (+${primaryWhatsAppLine().number})`}. Si no estás conforme con la respuesta, puedes acudir a la Autoridad Nacional de Protección de Datos Personales.`,
    ],
  },
  {
    heading: "Seguridad",
    paragraphs: [
      "Aplicamos medidas técnicas y organizativas para proteger tus datos frente a accesos no autorizados, pérdida o alteración.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      id="privacidad-title"
      title="Política de privacidad"
      crumbs={CRUMBS}
      intro={`En ${site.name} cuidamos tu información como cuidamos tu salud. Aquí te explicamos qué datos recopilamos, para qué los usamos y cómo ejercer tus derechos.`}
      sections={SECTIONS}
    />
  );
}
