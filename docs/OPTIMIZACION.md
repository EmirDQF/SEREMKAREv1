# Optimización para publicar (móvil primero)

Registro de mediciones y decisiones de la rama `publicacion-movil`.

## Cómo se mide

- `npm run build` y `next start` (producción) en local.
- **Lighthouse 13.5 (CLI)**, preset móvil por defecto: Moto G Power, red Slow 4G simulada (150 ms RTT,
  1,6 Mbps) y CPU 4x. Tres ejecuciones por página; se reporta la **mediana**.
- **JS inicial** con `node scripts/measure-js.mjs <url>`: gzip nivel 9 de todos los `<script src>` de la
  página (sin polyfills `noModule`).
- **INP**: Lighthouse en modo navegación no mide INP; se usa el **TBT** como indicador de laboratorio
  (TBT bajo ⇒ poco trabajo del hilo principal ⇒ buen INP).

## Antes / después

| Página | Métrica | Antes | Después |
|---|---|---|---|
| Home `/` | Rendimiento | 55 (55/56/50) | |
| | Accesibilidad / Buenas prácticas / SEO | 100 / 100 / 100 | |
| | LCP | 4,98 s | |
| | CLS | 0,013 | |
| | TBT (≈ INP) | 1 888 ms | |
| | JS inicial (gzip) | 266 KB | |
| | Peso total | 541 KB | |
| `/teleconsulta` | Rendimiento | 57 (45/57/60) | |
| | Accesibilidad / Buenas prácticas / SEO | 100 / 100 / 100 | |
| | LCP | 4,65 s | |
| | CLS | 0,292 | |
| | TBT | 1 003 ms | |
| | JS inicial (gzip) | 236 KB | |
| `/consulta-virtual` | Rendimiento | 78 (78/78/75) | |
| | Accesibilidad / Buenas prácticas / SEO | 100 / 100 / 66 | |
| | LCP | 4,21 s | |
| | CLS | 0,000 | |
| | TBT | 357 ms | |
| | JS inicial (gzip) | 253 KB | |
| `/tarifas` | Rendimiento | 77 (77/77/76) | |
| | Accesibilidad / Buenas prácticas / SEO | 100 / 100 / 100 | |
| | LCP | 4,44 s | |
| | CLS | 0,000 | |
| | TBT | 321 ms | |
| | JS inicial (gzip) | 229 KB | |

Imágenes «antes»: ninguna imagen local; todas las fotos venían de `images.unsplash.com` (optimizadas por
`next/image`). El médico real se mostraba con un retrato de iniciales «DC».

### Diagnóstico de la línea base

- **LCP**: el elemento LCP es el párrafo de entrada del hero (texto), no una imagen. Su «render delay»
  (1,5–2,3 s) depende del JS crítico: con 266 KB de JS y 1,9 s de TBT, el hilo principal tarda en pintar.
- **JS**: el runtime de React + Next ocupa ~117 KB gzip; el resto (~112 KB en la Home) es código propio:
  `motion` (LazyMotion, Reveal, KineticText, TiltCard, parallax del hero), `radix-ui` (menú, diálogo,
  acordeón, pestañas) e islas cliente (triage, densitometría, cabecera).
- **CLS 0,292 en /teleconsulta**: lo provoca la capa decorativa `.mesh-bg` del hero cuando la sección
  cambia de alto durante la carga.
- **SEO 66 en /consulta-virtual**: `is-crawlable` (la página lleva `noindex`).

## Inventario previo (fase 0)

| Qué | Dónde estaba |
|---|---|
| Retrato «DC» (iniciales) | `data/doctors.ts` (`initials: "DC"`, `photo: null`) → `DoctorPortrait`, usado en `HeroVisual`, `TelemedicineBand`, `/teleconsulta`, `/staff/[slug]`, `/especialidades/[slug]`, `DoctorCard` (`DoctorsSection`, `/staff`), `SymptomTriage` y el consultorio (`TriageResult`, `BookingCalendar`, `BookingForm`, `Confirmation`). JSON-LD `Physician` sin `image`; Open Graph sin foto. |
| three.js / R3F / drei | `components/3d/*`, montado por `CanvasHost` (layout raíz, chunk diferido) y `Scene3DSlot` en `HeroVisual` (rodilla), `SymptomTriage` (holograma), `BoneDensityExplorer` (hueso), `GuidedVsBlind`, `ConditionShowcase`, `TriageWizard` y `MicroIcon` (tarjetas de servicios, especialidades y tratamientos). Ya no se descargaba en gama baja / ahorro de datos / red lenta / reducir animaciones, pero sí en móviles de gama media. |
| Imágenes remotas (Unsplash) | `data/home.ts`: hero, 3 pasos de la teleconsulta, `telemedicine`, `careJourney`, `guided`, `video` y 6 portadas del blog. `data/doctors.ts`: 4 médicos de muestra (ocultos). |
| Scripts de terceros | Ninguno en el navegador (sin analítica ni chat). Cal.com solo se llama desde el servidor (`lib/booking-provider`). Mapa de Google con fachada «clic para cargar» (`MapFacade`); YouTube solo en `VideoSection` (oculta). |
| Fuentes | `next/font`: Inter (variable) y Plus Jakarta Sans 600/700/800, `display: swap`. |
| Barras flotantes | `MobileActionBar` (móvil: Evaluar · Agendar · WhatsApp) y `WhatsAppFloat` (solo tablet/escritorio). |

## Decisiones

1. **Foto del Dr. Ccolcca recortada a cabeza y hombros.** La bata de la foto original tiene bordado
   «Dr. Daniel Cachay — Médico Neurocirujano». El cliente confirmó que la persona es el Dr. Daniel Ccolcca;
   se recorta por encima del bordado para no confundir a los pacientes. El original no se versiona.
2. **Contacto directo centralizado**: `data/site.ts` → `DOCTOR_LINE` (hoy la línea principal, marcada
   `CONFIRMAR`) y `lib/whatsapp.ts` → `doctorContact()`. Si el número falta o no es válido, los botones
   de WhatsApp y llamada no se muestran (nunca enlaces vacíos).
3. **Barra móvil única** (Teleconsulta · WhatsApp · Llamar), componente de servidor sin JS. El pie reserva
   su alto más `env(safe-area-inset-bottom)`, así no tapa contenido ni provoca saltos.
