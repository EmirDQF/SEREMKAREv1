import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/pages/LegalDocument";
import { legal } from "@/data/legal";
import { MEDICAL_DISCLAIMER, site } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

const CRUMBS = [
  { label: "Inicio", href: "/" },
  { label: "Términos y condiciones", href: "/terminos" },
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Términos y condiciones",
  description: `Condiciones de uso de la web y de los servicios de ${site.name}.`,
  path: "/terminos",
});

// PROVISIONAL: texto base; revisar con asesoría legal antes de publicar.
const SECTIONS: readonly LegalSection[] = [
  {
    heading: "Sobre esta web",
    paragraphs: [
      `Esta web pertenece a ${legal.businessName} (RUC ${legal.ruc}). Al usarla aceptas estos términos. Si no estás de acuerdo, te pedimos no utilizarla.`,
    ],
  },
  {
    heading: "Información médica",
    paragraphs: [
      MEDICAL_DISCLAIMER,
      "Los contenidos del blog, el orientador “¿Dónde te duele?”, la escala de densitometría y el checklist son orientativos: no constituyen un diagnóstico ni reemplazan la evaluación de un especialista.",
    ],
  },
  {
    heading: "Citas y teleconsultas",
    bullets: [
      "Las solicitudes de cita por la web o WhatsApp se confirman cuando te respondemos.",
      "Para reprogramar o cancelar, avísanos con la mayor anticipación posible.",
      "La teleconsulta requiere conexión a internet estable; si no es adecuada para tu caso, te indicaremos una cita presencial.",
    ],
  },
  {
    heading: "Precios y pagos",
    paragraphs: [
      "Los precios y coberturas de seguros o EPS se informan al agendar y pueden variar según el servicio. Emitimos el comprobante de pago correspondiente.",
    ],
  },
  {
    heading: "Propiedad intelectual",
    paragraphs: [
      `Los textos, diseños, ilustraciones y escenas 3D de esta web pertenecen a ${site.name} o se usan con autorización. No pueden reproducirse sin permiso.`,
    ],
  },
  {
    heading: "Enlaces a terceros",
    paragraphs: ["Los enlaces a otras webs se ofrecen como referencia; no somos responsables de su contenido."],
  },
  {
    heading: "Reclamos y legislación aplicable",
    paragraphs: [
      "Puedes presentar un reclamo o una queja en nuestro Libro de Reclamaciones. Estos términos se rigen por las leyes de la República del Perú, incluido el Código de Protección y Defensa del Consumidor.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      id="terminos-title"
      title="Términos y condiciones"
      crumbs={CRUMBS}
      intro="Estas condiciones regulan el uso de nuestra web y la solicitud de nuestros servicios."
      sections={SECTIONS}
    />
  );
}
