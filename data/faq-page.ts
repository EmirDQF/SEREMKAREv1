import type { FAQGroup } from "@/types/medical";
import { densitometry } from "@/data/densitometry";
import { homeFaq } from "@/data/faq";
import { specialties } from "@/data/specialties";
import { specialtyDetails } from "@/data/specialty-details";

/** /preguntas-frecuentes: reúne las preguntas de la Home, de densitometría y de cada condición. */
export const allFaqGroups: readonly FAQGroup[] = [
  { id: "general", title: "Teleconsulta y citas", items: homeFaq },
  { id: "densitometria", title: "Densitometría ósea", items: densitometry.faq.map((item) => ({ ...item, id: `dxa-${item.id}` })) },
  {
    id: "condiciones",
    title: "Sobre las condiciones que tratamos",
    items: specialties.flatMap((specialty) => specialtyDetails[specialty.slug]?.faq ?? []),
  },
];
