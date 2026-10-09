import { REAL_DOCTOR_SLUG } from "@/data/doctors";
import { VISIBLE_SPECIALTIES } from "@/data/visibility";
import type { Specialty, SpecialtySlug } from "@/types/medical";

/** Todas las especialidades (incluidas las ocultas por visibility). */
export const allSpecialties: readonly Specialty[] = [
  {
    slug: "artrosis",
    name: "Artrosis y desgaste cartilaginoso",
    shortName: "Artrosis",
    summary: "Desgaste del cartílago que causa dolor y rigidez, sobre todo en rodillas, caderas y manos.",
    symptoms: ["Dolor al subir escaleras o al caminar", "Rigidez de pocos minutos al levantarte", "Crujidos al mover la articulación"],
    alertSigns: ["Dolor que no cede con reposo", "Rodilla que se traba o falla", "Hinchazón que aparece de un día para otro"],
    approach: "Te orientamos en una teleconsulta reumatológica: revisamos tus exámenes y recibes tu plan de tratamiento.",
    doctorSlug: REAL_DOCTOR_SLUG,
    inTriage: true,
    provisional: true,
  },
  {
    slug: "artritis-reumatoide",
    name: "Artritis reumatoide",
    shortName: "Artritis reumatoide",
    summary: "Enfermedad autoinmune que inflama las articulaciones; suele empezar entre los 30 y 50 años.",
    symptoms: ["Manos rígidas más de 30 minutos al despertar", "Dolor e hinchazón en ambos lados del cuerpo", "Cansancio persistente"],
    alertSigns: ["Varias articulaciones inflamadas a la vez", "Dificultad para cerrar el puño", "Fiebre o baja de peso sin causa"],
    approach: "Te orientamos en una teleconsulta reumatológica: revisamos tus exámenes y recibes tu plan de tratamiento.",
    doctorSlug: REAL_DOCTOR_SLUG,
    inTriage: true,
    provisional: true,
  },
  {
    slug: "gota",
    name: "Gota y ácido úrico",
    shortName: "Gota",
    summary: "Depósito de cristales de ácido úrico que provoca crisis de dolor intenso, a menudo en el dedo gordo del pie.",
    symptoms: ["Dolor súbito e intenso, muchas veces de noche", "Articulación roja, caliente e hinchada", "Crisis que se repiten"],
    alertSigns: ["Fiebre con articulación caliente", "Bultos (tofos) en dedos u orejas", "Crisis cada vez más frecuentes"],
    approach: "Confirmación diagnóstica, manejo de la crisis y plan para bajar el ácido úrico con seguimiento y orientación nutricional.",
    doctorSlug: REAL_DOCTOR_SLUG,
    inTriage: true,
    provisional: true,
  },
  {
    slug: "lupus",
    name: "Lupus y enfermedades autoinmunes",
    shortName: "Lupus",
    summary: "Enfermedad autoinmune que puede afectar articulaciones, piel, riñones y otros órganos; es más frecuente en mujeres jóvenes.",
    symptoms: ["Dolor articular que cambia de lugar", "Manchas en la piel que empeoran con el sol", "Cansancio y caída de cabello"],
    alertSigns: ["Hinchazón de piernas u orina espumosa", "Fiebre persistente", "Dolor en el pecho al respirar"],
    approach: "Te orientamos en una teleconsulta reumatológica: revisamos tus exámenes y recibes tu plan de tratamiento.",
    doctorSlug: REAL_DOCTOR_SLUG,
    inTriage: true,
    provisional: true,
  },
  {
    slug: "fibromialgia",
    name: "Fibromialgia y dolor crónico",
    shortName: "Fibromialgia",
    summary: "Dolor generalizado con cansancio y sueño poco reparador; tiene tratamiento y se puede controlar.",
    symptoms: ["Dolor en muchas zonas del cuerpo", "Cansancio aunque duermas", "Dificultad para concentrarte"],
    alertSigns: ["Dolor que te impide trabajar", "Ánimo bajo persistente", "Insomnio de varias semanas"],
    approach: "Abordaje multidisciplinario: reumatología, terapia física, psicología y nutrición, con metas claras de calidad de vida.",
    doctorSlug: REAL_DOCTOR_SLUG,
    inTriage: true,
    provisional: true,
  },
  {
    slug: "osteoporosis",
    name: "Osteoporosis",
    shortName: "Osteoporosis",
    summary: "Pérdida de densidad ósea que aumenta el riesgo de fracturas; no duele hasta que ocurre una fractura.",
    symptoms: ["Pérdida de estatura", "Espalda encorvada", "Fracturas con caídas leves"],
    alertSigns: ["Dolor de espalda súbito tras un esfuerzo leve", "Caídas frecuentes", "Menopausia temprana o uso prolongado de corticoides"],
    approach: "Densitometría ósea de columna y caderas con cita previa, y orientación en una teleconsulta reumatológica.",
    doctorSlug: REAL_DOCTOR_SLUG,
    inTriage: true,
    provisional: true,
  },
  {
    slug: "espondiloartritis",
    name: "Espondiloartritis",
    shortName: "Espondiloartritis",
    summary: "Inflamación de la columna y articulaciones que suele empezar antes de los 40 con dolor lumbar que mejora con el movimiento.",
    symptoms: ["Dolor lumbar que despierta de madrugada", "Rigidez que mejora al moverte", "Dolor en talones o glúteos"],
    alertSigns: ["Ojo rojo y doloroso", "Dolor lumbar de más de 3 meses en menores de 45", "Psoriasis o colitis asociada"],
    approach: "Diagnóstico con ecografía y laboratorio, ejercicio terapéutico y terapia biológica cuando está indicada.",
    doctorSlug: REAL_DOCTOR_SLUG,
    inTriage: false,
    provisional: true,
  },
];

/** Especialidades publicadas (D11). */
export const specialties: readonly Specialty[] = allSpecialties.filter((specialty) => VISIBLE_SPECIALTIES.has(specialty.slug));

export function isSpecialtyVisible(slug: SpecialtySlug): boolean {
  return VISIBLE_SPECIALTIES.has(slug);
}

/** Busca entre todas (también las ocultas): sirve para nombres y textos, no para enlazar. */
export function getSpecialty(slug: SpecialtySlug): Specialty {
  const specialty = allSpecialties.find((s) => s.slug === slug);
  if (!specialty) throw new Error(`Specialty not found: ${slug}`);
  return specialty;
}
