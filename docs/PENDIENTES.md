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
| Horario por sede | `data/site.ts` → `OPENING_SCHEDULE` y `PROVISIONAL_HOURS` (`confirmed: true` publica «Abierto ahora» y el JSON-LD) | Horario general del cliente: Lun–Vie 08:00–20:00 · Sáb 08:00–13:00 · Domingos y feriados «Por confirmar» |
| Correo y redes sociales reales | `data/site.ts` → `SAMPLE_EMAIL`, `SAMPLE_SOCIALS` + `data/visibility.ts` (`email`, `socials`) | Ocultos |
| RUC (Libro de Reclamaciones) | `data/site.ts` → `taxId`, `data/legal.ts` | Pendiente |
| Dominio | Variable `NEXT_PUBLIC_SITE_URL` | `https://sermekare.com` |
| Direcciones a confirmar («Alfredo», «Sarmiento», «Lanfranco», puerta en Puente Piedra) | `data/site.ts` → `LOCATIONS` | Sin número de puerta |
| Transcripción y audio del Dr. Ccolcca (opcional) | Nuevo | No se publica |

## Posicionamiento y marca (mejora 2026)

| Dato | Archivo | Hoy se muestra |
|---|---|---|
| Uso de la denominación «Centro de Excelencia en Reumatología» (posibles conflictos de marca; no implica acreditación) | `data/site.ts` → `CENTER_TAGLINE`, `CENTER_MISSION` | Publicado como aspiración, sin certificaciones ni rankings |
| Nombre comercial («SERMEKARE» o «KARE SAC») | `data/site.ts` → `name` | SERMEKARE |

## Servicios reactivados: confirmar con el cliente

Se publican porque el cliente los listó (decisión D12 en `data/visibility.ts`). Para ocultar uno,
añadir su nombre exacto a `HIDDEN_SERVICES`.

| Servicio | Archivo | Confirmar |
|---|---|---|
| Apoyo terapéutico: administración EV/SC, pulsos, biotecnológicos, monitoreo de adherencia, gestión del riesgo e inmunizaciones | `data/services.ts`, `data/service-details.ts` | Que se ofrecen hoy y en qué sede |
| Protocolos de administración (nuevo) | `data/services.ts` | Descripción y alcance |
| Consulta externa: medicina general, psicología, nutrición, terapia ocupacional, terapia física | `data/services.ts` | Profesionales y sedes |
| Procedimientos: infiltraciones ecoguiadas (reumatólogo y radiólogo), videocapilaroscopía | `data/services.ts` | Que se realizan y quién |
| Laboratorio especializado dentro de procedimientos (nuevo) | `data/services.ts` | Alcance (¿propio o convenio?) |
| Apoyo diagnóstico: VFA, composición corporal, caderas con prótesis, ecografía, laboratorio, evaluaciones estandarizadas | `data/services.ts` | Equipos disponibles por sede |
| Teleinterconsulta y atención híbrida | `data/services.ts` | Que se ofrecen |
| Reserva en línea de consulta presencial y control (hoy se coordinan por WhatsApp) | `components/consulta/AppointmentTypePicker.tsx`, `docs/CONFIGURAR-CITAS.md` | Tipo de evento presencial en Cal.com |

## Precios

| Dato | Archivo | Hoy se muestra |
|---|---|---|
| Consulta externa, procedimientos y terapia | `app/(site)/servicios/[slug]/page.tsx` → `priceFor` (y `data/pricing.ts` si se crea su ficha) | «Precio por confirmar» |
| Paquete densitometría + teleconsulta | `data/pricing.ts` | «Precio por confirmar» |

## Suplementos

| Dato | Archivo | Hoy se muestra |
|---|---|---|
| Productos, marcas, presentaciones | `data/supplements.ts` → `CONFIRMED_SUPPLEMENTS` | «Catálogo en preparación» |
| Precio y stock de cada producto | `data/supplements.ts` (`price`, `status`) | — |
| Registro sanitario (DIGEMID) de cada producto — revisar con asesoría legal | `data/supplements.ts` (`sanitaryRegistry`; sin registro el producto no se publica) | — |
| Activar el catálogo | `data/visibility.ts` → `supplementsCatalog: true` | Desactivado |
| Entrega a domicilio o recojo en sede | `data/supplements.ts` → `SUPPLEMENTS_DELIVERY_NOTE` | «Te confirmamos por WhatsApp…» |
| Ejemplo de diseño (no publicado) | `data/supplements.example.ts` | — |

## Seguimiento

| Dato | Archivo | Hoy se muestra |
|---|---|---|
| Intervalo de controles por tipo de paciente | `app/(site)/seguimiento/page.tsx`, `docs/PLANTILLAS-SEGUIMIENTO.md` | «Tu médico define cada cuánto» |
| Plantillas de WhatsApp para el equipo | `docs/PLANTILLAS-SEGUIMIENTO.md` | Uso interno (envío manual) |

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
| Páginas de tratamientos (`/tratamientos/*`) | Confirmar que la clínica los ofrece (`VISIBLE_TREATMENTS`) |
| Llamada telefónica como modalidad | Confirmarla |
| Especialidades gota, fibromialgia y espondiloartritis | Confirmarlas |

## Legal

- Revisar con asesoría legal la política de privacidad, los términos y el consentimiento de
  teleconsulta (`app/(site)/terminos/page.tsx`, sección «Consentimiento informado para la
  teleconsulta»).
