# Pendientes para publicar SERMEKARE

Todo lo que no figura en el material real se muestra en la web como «Por confirmar». Completa cada
dato en el archivo indicado; la web se actualiza sola.

## Datos de la clínica (prioridad alta)

| Dato | Archivo | Hoy se muestra |
|---|---|---|
| Foto del Dr. Daniel Ccolcca | Publicada (recorte sin el bordado de la bata). Para cambiarla: `scripts/optimize-doctor-photo.mjs` | — |
| CMP y RNE del Dr. Ccolcca | `data/doctors.ts` → `cmp`, `rne` | «CMP/RNE por confirmar» |
| Años de experiencia y formación | `data/doctors.ts` → `yearsOfExperience`, `education` | Ocultos / «Formación por confirmar» |
| Horario de teleconsulta | `data/teleconsult.ts` → `TELECONSULT_HOURS` | «Horario por confirmar» (agenda demo rotulada) |
| Precio de la teleconsulta y de la densitometría | `data/pricing.ts` → `price` | «Precio por confirmar» |
| Medios de pago | `data/pricing.ts` → `PAYMENT_METHODS` | «Medios de pago por confirmar» |
| Duración de la consulta | `data/teleconsult-content.ts` → `teleconsultFacts.durationMinutes` | «Por confirmar» |
| Política de cancelación y de fallas de conexión | `data/teleconsult-content.ts` → `teleconsultFacts` | No se publica |
| Qué WhatsApp atiende la teleconsulta | `data/site.ts` → `WHATSAPP_LINES` (hoy la línea principal +51 994 931 540) | Línea principal |
| Horario de las sedes | `data/site.ts` → `PROVISIONAL_HOURS` (`confirmed: true` para mostrarlo) | «Atención con cita previa» |
| Correo y redes sociales reales | `data/site.ts` → `SAMPLE_EMAIL`, `SAMPLE_SOCIALS` + `data/visibility.ts` (`email`, `socials`) | Ocultos |
| RUC (Libro de Reclamaciones) | `data/site.ts` → `taxId`, `data/legal.ts` | Pendiente |
| Dominio | Variable `NEXT_PUBLIC_SITE_URL` | `https://sermekare.com` |
| Direcciones a confirmar («Alfredo», «Sarmiento», «Lanfranco», puerta en Puente Piedra) | `data/site.ts` → `LOCATIONS` | Sin número de puerta |
| Transcripción y audio del Dr. Ccolcca (opcional) | Nuevo | No se publica |

## Citas en línea (Cal.com + Google Meet)

| Dato | Dónde |
|---|---|
| IDs de los tipos de evento (Meet y presencial) | `data/doctors.ts` → `booking.calEventTypeIds` |
| API key de Cal.com | Variable `CALCOM_API_KEY` (y `BOOKING_PROVIDER=calcom`) |
| Secreto del webhook | Variable `CALCOM_WEBHOOK_SECRET` |
| WhatsApp Cloud API (opcional) | Variables `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_PHONE_ID` |

Guía paso a paso: `docs/CONFIGURAR-CITAS.md`.

## Contenido oculto que se puede reactivar (`data/visibility.ts`)

| Contenido | Para reactivarlo hace falta |
|---|---|
| Cifras (+15 000 consultas, 4.9, etc.) | Cifras reales verificables |
| Testimonios | Reseñas reales con consentimiento escrito |
| Aseguradoras / EPS | Convenios firmados |
| Médicos de muestra | Staff real (nombre, CMP, RNE, foto) |
| Tratamientos, infiltraciones, ecografía, terapias | Confirmar que la clínica los ofrece |
| Llamada telefónica como modalidad | Confirmarla |
| Especialidades gota, fibromialgia y espondiloartritis | Confirmarlas |

## Legal

- Revisar con asesoría legal la política de privacidad, los términos y el consentimiento de
  teleconsulta (`app/(site)/terminos/page.tsx`, sección «Consentimiento informado para la
  teleconsulta»).
