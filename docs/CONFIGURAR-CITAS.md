# Configurar las citas (Cal.com + Google Meet)

Mientras no hagas nada de esto, la web funciona completa en **modo demo**: muestra horarios
simulados (rotulados «demo») y no crea citas reales. Cuando completes estos pasos, las citas
se crean en tu agenda real y Cal.com genera el enlace de **Google Meet** automáticamente.

> Tiempo estimado: 30–45 minutos. Necesitas la cuenta de Google (Gmail o Workspace) del médico.

---

## 1. Crear la cuenta de Cal.com

1. Entra a <https://cal.com> y crea una cuenta con el correo del **Dr. Daniel Ccolcca**.
2. Elige el usuario (por ejemplo `dr-ccolcca`) y la zona horaria **America/Lima**.

## 2. Conectar Google Calendar y Google Meet

1. En Cal.com: **Settings → Calendars → Add calendar → Google Calendar**. Acepta los permisos.
   Así Cal.com solo ofrece horarios en los que el médico está libre.
2. En **Apps**, busca **Google Meet** e instálalo (necesita Google Calendar conectado).

## 3. Definir la disponibilidad

**Availability** → crea el horario real de teleconsulta (días y horas en hora de Lima).
Este es el dato que hoy figura como «Horario por confirmar» en la web.

## 4. Crear los tipos de evento

Crea uno por modalidad en **Event Types → New**:

| Tipo de evento | Duración | Ubicación (Location) |
|---|---|---|
| Teleconsulta reumatológica | la que defina el médico (p. ej. 30 min) | **Google Meet** |
| Densitometría ósea (presencial) | la que defina la sede | **In person** + dirección de la sede |

En cada tipo de evento:

- **Booking questions**: deja activas *Name*, *Email* y *Additional notes* (ahí llegan el motivo,
  el documento y la orientación del triage). Activa *Phone number* si quieres verlo en Cal.com.
- Copia el **ID** del tipo de evento: es el número que aparece en la URL al editarlo
  (`…/event-types/123456` → `123456`).

## 5. Poner los IDs en la web

En `data/doctors.ts`, dentro del Dr. Daniel Ccolcca:

```ts
booking: { calEventTypeIds: { meet: 123456, presencial: 654321 } },
```

Si un ID queda en `null`, esa modalidad sigue en modo demo (no se rompe nada).

## 6. Crear la API key

**Settings → Developer → API keys → New**. Copia la clave (empieza con `cal_live_`).
Guárdala solo en las variables de entorno: **nunca** en el código.

## 7. Recordatorios por correo

Cal.com envía la confirmación por correo al paciente. Para el recordatorio de **1 hora antes**,
usa **Workflows → New** (si tu plan lo incluye): disparador «Before event starts», 1 hora,
acción «Send email to attendee», con un texto como:

> Tu teleconsulta con SERMEKARE empieza en 1 hora. Ten a mano tus exámenes previos y la lista de
> medicamentos, busca un lugar tranquilo con buena luz y revisa tu conexión a internet.

## 8. Webhook (confirmación por WhatsApp, opcional)

1. **Settings → Developer → Webhooks → New**.
2. URL: `https://TU-DOMINIO/api/webhooks/calcom`
3. Evento: **Booking Created**.
4. **Secret**: inventa una frase larga y cópiala (la usarás en `CALCOM_WEBHOOK_SECRET`).

La web verifica la firma (`x-cal-signature-256`, HMAC-SHA256) y rechaza todo lo que no venga de
Cal.com. Si además configuras WhatsApp Cloud API (paso 10), envía la confirmación por WhatsApp.

## 9. Variables de entorno

Copia `.env.example` a `.env.local` (para tu computadora) y completa:

```bash
BOOKING_PROVIDER=calcom
CALCOM_API_KEY=cal_live_xxxxxxxx
CALCOM_WEBHOOK_SECRET=la-frase-del-paso-8
NEXT_PUBLIC_SITE_URL=https://tu-dominio.pe
```

En **Vercel**: *Project → Settings → Environment Variables* → agrega las mismas variables para
*Production* (y *Preview* si quieres probar), y vuelve a desplegar.

## 10. WhatsApp Cloud API (opcional)

1. En Meta for Developers crea una app de tipo *Business* y agrega **WhatsApp**.
2. Registra el número oficial y copia el **Phone number ID** y un **token permanente**.
3. Crea y envía a aprobación la plantilla `confirmacion_cita` (idioma *Spanish*), por ejemplo:

   > Hola {{1}}, tu teleconsulta con SERMEKARE quedó reservada para el {{2}} (hora de Lima).
   > Te llegará el enlace de Google Meet por correo.

4. Variables: `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_PHONE_ID` (y `WHATSAPP_TEMPLATE_NAME` si usaste
   otro nombre). Sin ellas, el webhook no envía nada.

El mensaje **nunca** incluye síntomas ni el motivo de consulta: solo el nombre y la fecha.

## 11. Probar

1. `npm run build && npm run start` y abre `/consulta-virtual`.
2. Ya no debe verse la etiqueta «demo» en el calendario.
3. Reserva un horario de prueba: debe aparecer en Google Calendar con su enlace de Meet, y
   `/cita-confirmada/…` debe mostrar el botón «Entrar a mi consulta».
4. Cancélala desde el enlace «Cancelar» para liberar el horario.

---

### Notas técnicas

- API usada: Cal.com **v2** (`GET /v2/slots`, `POST /v2/bookings`, `GET /v2/bookings/{uid}`),
  verificada contra la documentación oficial. Las versiones de cabecera están en
  `lib/booking-provider/calcom.ts`.
- Reprogramar/cancelar usa las páginas públicas de Cal.com (`/reschedule/{uid}` y
  `/booking/{uid}?cancel=true`). Si usas un dominio propio de Cal.com, define `CALCOM_WEB_URL`.
- El límite de solicitudes (rate limit) es en memoria por instancia. Para tráfico alto, cámbialo
  por Upstash/Redis en `lib/api/rate-limit.ts`.
- No hay base de datos propia: la cita y la orientación viven en Cal.com (Ley N.° 29733).
