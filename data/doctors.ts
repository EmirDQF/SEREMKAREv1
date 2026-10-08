import { visibility } from "@/data/visibility";
import type { Doctor } from "@/types/medical";

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=75`;
const HOUR = 60;

const NO_CALCOM_EVENTS: Doctor["booking"] = { calEventTypeIds: { meet: null, presencial: null } };

export const REAL_DOCTOR_SLUG = "daniel-ccolcca";

/**
 * Todos los médicos. El único real es el Dr. Daniel Ccolcca (index.html de SEREMKAREWEB).
 * Los demás son de muestra (`sample: true`) y se ocultan con visibility.sampleDoctors.
 */
export const allDoctors: readonly Doctor[] = [
  {
    slug: REAL_DOCTOR_SLUG,
    initials: "DC",
    name: "Dr. Daniel Ccolcca",
    title: "Médico reumatólogo",
    specialty: "Reumatología · Teleconsulta",
    cmp: null, // CONFIRMAR: CMP (index.html: [CMP])
    rne: null, // CONFIRMAR: RNE (index.html: [RNE])
    yearsOfExperience: null, // CONFIRMAR
    education: [], // CONFIRMAR: formación
    // Motivos que nombra el index.html real de la teleconsulta.
    focus: ["Dolor de rodilla", "Artritis", "Artrosis", "Lupus", "Osteoporosis"],
    photo: null, // CONFIRMAR: foto real (la recibida muestra otro nombre bordado en la bata)
    photoAlt: "Dr. Daniel Ccolcca, médico reumatólogo de SERMEKARE",
    complaints: ["articulaciones", "espalda", "rodilla", "huesos", "generalizado", "general"],
    // PROVISIONAL: franja de la agenda demo; la disponibilidad real la dará Cal.com.
    schedule: [{ days: [1, 2, 3, 4, 5], from: 9 * HOUR, to: 22 * HOUR, modalities: ["videollamada"] }],
    provisional: true,
    sample: false,
    // CONFIRMAR: IDs de los tipos de evento de Cal.com (ver docs/CONFIGURAR-CITAS.md).
    booking: { calEventTypeIds: { meet: null, presencial: null } },
  },
  {
    slug: "valeria-quintana",
    initials: "VQ",
    name: "Dra. Valeria Quintana Ríos",
    title: "Médica reumatóloga",
    specialty: "Reumatología · Ecografía musculoesquelética",
    cmp: "00000",
    rne: "00000",
    yearsOfExperience: 14,
    education: [
      "Médica cirujana, universidad peruana (provisional)",
      "Residencia en Reumatología, hospital nacional de Lima (provisional)",
      "Diplomado en Ecografía Musculoesquelética (provisional)",
    ],
    focus: ["Artrosis", "Infiltraciones ecoguiadas", "Dolor de rodilla y hombro"],
    photo: unsplash("1594824476967-48c8b964273f"),
    photoAlt: "Dra. Valeria Quintana, reumatóloga, con uniforme clínico y brazos cruzados",
    complaints: ["articulaciones", "rodilla", "general"],
    // PROVISIONAL: lunes, miércoles y viernes de 7:00 a 10:00 p.m.
    schedule: [{ days: [1, 3, 5], from: 19 * HOUR, to: 22 * HOUR, modalities: ["videollamada", "llamada"] }],
    provisional: true,
    sample: true,
    booking: NO_CALCOM_EVENTS,
  },
  {
    slug: "martin-salazar",
    initials: "MS",
    name: "Dr. Martín Salazar Vega",
    title: "Médico reumatólogo",
    specialty: "Reumatología · Terapias biológicas",
    cmp: "00000",
    rne: "00000",
    yearsOfExperience: 12,
    education: [
      "Médico cirujano, universidad peruana (provisional)",
      "Residencia en Reumatología (provisional)",
      "Fellow en Enfermedades Autoinmunes (provisional)",
    ],
    focus: ["Artritis reumatoide", "Espondiloartritis", "Terapia biológica e inhibidores JAK"],
    photo: unsplash("1612349317150-e413f6a5b16d"),
    photoAlt: "Dr. Martín Salazar, reumatólogo, con bata blanca y estetoscopio",
    complaints: ["articulaciones", "espalda", "general"],
    // PROVISIONAL: martes y jueves de 7:00 a 10:00 p.m., solo videollamada
    schedule: [{ days: [2, 4], from: 19 * HOUR, to: 22 * HOUR, modalities: ["videollamada"] }],
    provisional: true,
    sample: true,
    booking: NO_CALCOM_EVENTS,
  },
  {
    slug: "carmen-ugarte",
    initials: "CU",
    name: "Dra. Carmen Ugarte Llosa",
    title: "Médica reumatóloga",
    specialty: "Reumatología · Osteoporosis y lupus",
    cmp: "00000",
    rne: "00000",
    yearsOfExperience: 18,
    education: [
      "Médica cirujana, universidad peruana (provisional)",
      "Residencia en Reumatología (provisional)",
      "Especialización en Densitometría Clínica (provisional)",
    ],
    focus: ["Osteoporosis", "Lupus", "Gota", "Salud ósea del adulto mayor"],
    photo: unsplash("1559839734-2b71ea197ec2"),
    photoAlt: "Dra. Carmen Ugarte, reumatóloga, sonriendo con bata blanca al aire libre",
    complaints: ["huesos", "articulaciones", "general"],
    // PROVISIONAL: lunes a viernes de 7:00 a 9:00 p.m.
    schedule: [{ days: [1, 2, 3, 4, 5], from: 19 * HOUR, to: 21 * HOUR, modalities: ["videollamada", "llamada"] }],
    provisional: true,
    sample: true,
    booking: NO_CALCOM_EVENTS,
  },
  {
    slug: "diego-paredes",
    initials: "DP",
    name: "Dr. Diego Paredes Huamán",
    title: "Médico especialista en Medicina Física y Rehabilitación",
    specialty: "Rehabilitación · Dolor crónico y lesiones deportivas",
    cmp: "00000",
    rne: "00000",
    yearsOfExperience: 10,
    education: [
      "Médico cirujano, universidad peruana (provisional)",
      "Residencia en Medicina Física y Rehabilitación (provisional)",
      "Curso en Medicina del Deporte (provisional)",
    ],
    focus: ["Fibromialgia", "Dolor lumbar y cervical", "Lesiones en corredores"],
    photo: unsplash("1622253692010-333f2da6031d"),
    photoAlt: "Dr. Diego Paredes, especialista en rehabilitación, sonriendo con uniforme azul",
    complaints: ["espalda", "rodilla", "generalizado", "general"],
    // PROVISIONAL: lunes a viernes de 8:00 a 10:00 p.m.
    schedule: [{ days: [1, 2, 3, 4, 5], from: 20 * HOUR, to: 22 * HOUR, modalities: ["videollamada", "llamada"] }],
    provisional: true,
    sample: true,
    booking: NO_CALCOM_EVENTS,
  },
];

/** Médicos publicados. */
export const doctors: readonly Doctor[] = allDoctors.filter((doctor) => visibility.sampleDoctors || !doctor.sample);

export function getDoctor(slug: string): Doctor {
  const doctor = doctors.find((d) => d.slug === slug);
  if (!doctor) throw new Error(`Doctor not found: ${slug}`);
  return doctor;
}
