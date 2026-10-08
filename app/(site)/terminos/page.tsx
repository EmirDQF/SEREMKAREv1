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
    heading: "Consentimiento informado para la teleconsulta",
    anchor: "consentimiento-teleconsulta",
    paragraphs: [
      "La teleconsulta es una atención médica a distancia por videollamada (WhatsApp, Zoom o Google Meet), prestada conforme a la Ley N.° 30421, Ley Marco de Telesalud, y sus normas complementarias.",
      "Al marcar el consentimiento al reservar declaras que entiendes y aceptas lo siguiente:",
    ],
    bullets: [
      "La teleconsulta no permite un examen físico completo. Si el médico lo considera necesario, te indicará una evaluación presencial o exámenes complementarios.",
      "No es un servicio para emergencias. Ante una emergencia acude al servicio de emergencias más cercano o llama al SAMU 106.",
      "Al terminar recibes en formato digital tu plan de tratamiento y, si el doctor lo indica, la receta y las órdenes de exámenes, además de las indicaciones para tu seguimiento.",
      "Necesitas un celular, tablet o computadora con cámara, micrófono e internet estable.",
      "Tus datos personales y de salud se tratan según nuestra política de privacidad (Ley N.° 29733). Puedes retirar este consentimiento y pedir atención presencial en cualquier momento.",
    ],
  },
  {
    heading: "Precios y pagos",
    paragraphs: [
      "Al agendar por WhatsApp te confirmamos el monto, el momento del pago y los datos para pagar. Los precios y medios de pago que aún no están publicados figuran como «por confirmar».",
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
