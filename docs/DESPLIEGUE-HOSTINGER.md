# Despliegue en Hostinger (Business Web Hosting · Node.js)

SERMEKARE es una app **Next.js 16 con servidor Node** (no es un sitio estático): las rutas
`/api/*`, `/consulta-virtual`, `/cita-confirmada/[uid]` y el webhook de Cal.com necesitan
`npm run start`. No uses `output: "export"`.

## 1. Requisitos

- Node.js **20 o superior** (recomendado 22 LTS) en el panel de Hostinger → Node.js.
- La rama a publicar fusionada en `main` (esta mejora vive en `mejora-visual-2026`).

## 2. Comandos

| Paso | Comando | Nota |
|---|---|---|
| Instalar | `npm ci` | Usa `package-lock.json` |
| Compilar | `npm run build` | Usa **webpack** a propósito (`next build --webpack`): no lo cambies |
| Arrancar | `npm run start` | Hostinger define `PORT`; Next lo respeta |

Antes de subir, en tu PC: `npm run lint && npm run typecheck && npm test && npm run build`.

## 3. Variables de entorno

Copia `.env.example` en el panel (Variables de entorno). **Nunca** subas `.env.local` al repositorio.

| Variable | Obligatoria | Valor |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sí | `https://sermekare.com` (sin barra final). Se usa en canonical, sitemap, Open Graph y JSON-LD |
| `BOOKING_PROVIDER` | No | `demo` (por defecto) o `calcom` |
| `CALCOM_API_KEY` | Con `calcom` | API key de Cal.com |
| `CALCOM_WEBHOOK_SECRET` | Con `calcom` | Secreto del webhook |
| `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_PHONE_ID` | No | Confirmación automática por WhatsApp Cloud API |

Sin ninguna variable de citas, la web funciona completa en **modo demo** (las reservas se rotulan como demostración).
Guía de Cal.com: `docs/CONFIGURAR-CITAS.md`.

## 4. Páginas nuevas de la mejora 2026 (verificar tras desplegar)

| Ruta | Qué revisar |
|---|---|
| `/` | Hero «Centro de Excelencia en Reumatología», 4 pilares, servicio extra, suplementos, ruta del paciente, horario |
| `/servicios` y `/servicios/{apoyo-diagnostico, apoyo-terapeutico, consulta-externa, procedimientos, telemedicina}` | Para quién, preparación, precio, «Agendar» |
| `/suplementos` | «Catálogo en preparación» y aviso «no son medicamentos» |
| `/seguimiento` | «Solicitar mi control» abre WhatsApp |
| `/consulta-virtual?servicio=elegir` | Selector de tipo de cita |
| `/sitemap.xml`, `/robots.txt` | Incluyen `/suplementos` y `/seguimiento` con el dominio real |

No se agregaron variables de entorno nuevas en esta mejora.

## 5. Después de desplegar

1. Abre el sitio en el celular (datos móviles, no Wi-Fi) y prueba «Agendar cita» y WhatsApp.
2. Revisa `https://sermekare.com/sitemap.xml` y envíalo en Google Search Console.
3. Comprueba los encabezados de seguridad (CSP solo en producción) con las herramientas del navegador.
4. Carga los datos pendientes de `docs/PENDIENTES.md` y vuelve a desplegar.
