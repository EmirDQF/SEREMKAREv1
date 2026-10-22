# Mejora visual 2026 — SERMEKARE

Rama `mejora-visual-2026` (desde `publicacion-movil`). Objetivo: **mejorar, no rehacer**. El sitio
pasa de «teleconsulta primero» a **Centro de Excelencia en Reumatología** con toda la oferta del
centro al mismo nivel, conservando la identidad (navy, teal clínico, blanco) y el presupuesto de
rendimiento de `docs/OPTIMIZACION.md`.

> Transcripción de los audios del cliente (1.ogg y 2.ogg): **llegó vacía** en el prompt. Se trabajó
> solo con lo explícito en las decisiones del cliente (sección 2 del prompt).

## Fase 0 — Línea base (antes de tocar código)

### Cómo se midió

- `npm run build` (webpack) + `next start -p 3100` en local (Windows, misma máquina para antes y después).
- Lighthouse 13.5 CLI, preset móvil (Moto G Power, Slow 4G simulado, CPU 4x), **mediana de 3**.
- JS inicial con `node scripts/measure-js.mjs` (gzip de los `<script src>`).
- Capturas: pantalla final de Lighthouse (móvil 412 px) y Chrome headless 1366 px (escritorio).
  Se guardan fuera del repositorio (pesan); el resumen va en las tablas.

### Lighthouse móvil — antes

| Página | Rend. (3 corridas) | A11y | BP | SEO | LCP | CLS | TBT | Peso |
|---|---|---|---|---|---|---|---|---|
| `/` | **76** (76/87/69) | 100 | 100 | 100 | 3,86 s | 0,002 | 339 ms | 445 KB |
| `/densitometria-osea` | **77** (80/77/63) | 100 | 100 | 100 | 3,95 s | 0,001 | 414 ms | 445 KB |
| `/servicios` | **77** (88/77/71) | 98 | 100 | 100 | 3,60 s | 0,000 | 293 ms | 433 KB |
| `/consulta-virtual` | **79** (70/79/88) | 100 | 100 | 66* | 3,92 s | 0,000 | 329 ms | 361 KB |

\* `/consulta-virtual` lleva `noindex` a propósito (es una herramienta, no una página de contenido).

JS inicial (gzip): Home **157 KB** (React/Next 136 KB + propio 21 KB) · `/consulta-virtual` 193 KB.
La varianza entre corridas en esta máquina es alta (±10 puntos); por eso se compara la mediana.

### Problemas encontrados

**Claridad (mensaje de los 5 segundos)**

1. El hero dice «Teleconsulta con un reumatólogo sin salir de casa»: el paciente entiende
   «servicio online», no «centro de reumatología con sedes, densitometría y tratamiento».
2. La cabecera muestra la insignia «Telemedicina» junto al logo y el CTA principal es
   «Agendar teleconsulta» en cabecera, menú móvil, hero y barra inferior.
3. No hay un horario visible: solo «Atención con cita previa».
4. Las tarjetas flotantes del hero («Todo el Perú», «Ley 30421») hablan de la normativa, no del paciente.
5. Términos técnicos (DXA, T-score, VFA, JAK) sin explicación en las tarjetas de servicios.

**Sobrerrepresentación**

| Dónde | Qué pasa |
|---|---|
| Cabecera, TopBar, barra móvil | Teleconsulta en 3 de 3 accesos fijos («Teleconsulta por videollamada · todo el Perú»). |
| Home | Hero + `TelemedicineBand` + `ConsultaSteps` (3 bloques seguidos de teleconsulta antes de ver otro servicio). |
| `/servicios` | Solo 2 pilares visibles (diagnóstico y telemedicina): apoyo terapéutico, procedimientos y consulta externa ocultos. |
| `/servicios`, menú | Insignia «Nuevo» en Densitometría sin respaldo. |
| Metadatos | Título de la Home: «Reumatólogo online: teleconsulta por videollamada…». |

**Diseño**

- Ritmo visual correcto pero sin una sección que muestre «toda la oferta» de un vistazo.
- La banda de telemedicina usa blur grandes (`blur-3xl`) y una tarjeta con inclinación (`TiltCard`).
- Vidrio de la cabecera con `blur(24px)` en escritorio (pesado al repintar).
- Barra móvil con 3 botones de igual peso (ninguna acción principal clara).

**Rendimiento**

- El LCP es el texto del hero; el JS de React/Next (136 KB) domina el JS inicial.
- `NextSlotChip` (isla cliente que consulta la agenda) en el hero de la Home.
- three.js ya no carga en gama baja/Save-Data/red lenta/reducir animaciones (se mantiene).

## Decisiones de diseño

**Dirección** (skill `ecc:frontend-design-direction`): clínica, sobria y de alto contraste. El
paciente llega con dolor o rigidez y quiere entender en 5 segundos quiénes somos, qué hacemos y
cómo agendar. Tono «calma clínica»: superficies blancas, navy para el peso, teal para la acción,
mucho aire. **Detalle memorable:** el bloque «Servicio extra» con borde punteado en azul de
videollamada (se distingue de los pilares sin competir con ellos) y los pilares numerados 01–04.

| Decisión | Por qué |
|---|---|
| Un solo CTA primario («Agendar cita», teal sólido con icono de calendario) en cabecera, hero, barra móvil y bandas | Un punto de entrada claro; la teleconsulta y la densitometría tienen su propio CTA solo en sus bloques |
| Selector de tipo de cita sin JS (`/consulta-virtual?servicio=elegir`) | Presencial, densitometría, teleconsulta o control en un toque, sin cargar el consultorio |
| Bento de 4 pilares sin 3D (`PillarCard`) | Antes cada tarjeta podía montar three.js; ahora icono lucide y lista con términos explicados entre paréntesis |
| Teleconsulta como «Servicio extra» (borde punteado azul, 3 pasos, cuándo no sirve) | Decisión del cliente: deja de ser el eje, pero conserva todo su contenido real |
| Horario visible en 4 lugares (Home, `/sedes`, `/contacto`, pie) | Mensaje 4 de los 5 segundos: dónde y cuándo |
| Eyebrow único (utilidad `eyebrow`, la píldora de `SectionHeading`) | Una sola jerarquía de títulos en todo el sitio |
| Tokens en `:root`: `--fs-body` (≥ 17 px), `--fs-lead`, `--space-section`, `--radius-control/panel`, `--ease-out-soft` | Escala fluida con `clamp`; cuerpo nunca < 16 px (baja visión) |
| Vidrio de la cabecera 24 px → 12 px de blur, sin blur en móvil | Menos repintado al hacer scroll |
| Sin ámbar en el aviso de suplementos | El sistema reserva el ámbar para las zonas de dolor |
| Barra móvil: «Agendar cita» (2/3 del ancho) + WhatsApp (1/3), 56 px de alto, zona segura | Una acción principal evidente al alcance del pulgar |
| TopBar y textos pequeños subidos a ≥ 14–15 px | Baja visión |

**Movimiento** (skills `ecc:motion-patterns`, `ecc:make-interfaces-feel-better`): la skill propone
`motion/react`; aquí se usan los equivalentes **en CSS** para no sumar JS a la Home:
`<ViewTransition>` de React (ya incluido en el runtime) para un fundido de 0,2 s entre páginas;
`@starting-style` en el menú «Más»; reveals ligados al scroll (`animation-timeline: view()`) solo en
tablet/escritorio; `active:scale-[0.97]` en botones; solo `transform` y `opacity`, y todo apagado con
`prefers-reduced-motion` o con el interruptor del pie.

**Skills consultadas y alcance real:** `ecc:design-system` (auditoría de tokens existentes: ya
había paleta, sombras multicapa y modo oscuro completos; se consolidó, no se rehízo),
`ecc:frontend-a11y` (foco visible, áreas ≥ 48 px, etiquetas), `ecc:taste` (está orientada a
videoclips; solo se aplicó su principio «coherencia antes que novedad»).

## Medición final (después de las fases 1–7)

Mismo método que la línea base: `npm run build` + `next start -p 3100`, Lighthouse 13.5 móvil
(simulado), mediana de 3, misma máquina (22-10-2026).

### Lighthouse móvil — antes / después

| Página | Rend. antes → después (3 corridas) | A11y | BP | SEO | LCP antes → después | CLS | TBT antes → después | Peso antes → después |
|---|---|---|---|---|---|---|---|---|
| `/` | 76 → **76** (83/76/75) | 100 | 100 | 100 | 3,86 → **2,96 s** | 0,000 | 339 → 728 ms | 445 → **354 KB** |
| `/densitometria-osea` | 77 → **73** (73/70/74) | 100 | 100 | 100 | 3,95 → **3,23 s** | 0,000 | 414 → 879 ms | 445 → **403 KB** |
| `/servicios` | 77 → **71** (70/71/84) | 98 | 100 | 100 | 3,60 → 4,14 s | 0,000 | 293 → 532 ms | 433 → **379 KB** |
| `/consulta-virtual` | 79 → **87** (85/87/88) | 100 | 100 | 66* | 3,92 → **3,48 s** | 0,000 | 329 → 219 ms | 361 → **329 KB** |

JS inicial (gzip, `scripts/measure-js.mjs`):

| Página | Antes | Después |
|---|---|---|
| `/` | 157 KB (React/Next 136 + propio 21) | **142 KB** (130 + 12) — meta ≤ 150 KB ✔ |
| `/servicios` | — | 142 KB (130 + 12) |
| `/consulta-virtual` | 193 KB | **178 KB** (130 + 47) |
| `/densitometria-osea` | — | 194 KB (130 + 64) |

La puntuación de rendimiento oscila ±10 puntos entre corridas por el TBT (CPU de esta máquina),
no por el contenido: peso, JS y LCP bajan en las cuatro páginas salvo el LCP de `/servicios`.

### Por qué el LCP simulado sigue sobre 2,0 s

- **Elemento LCP** — Home: el párrafo del hero (`section > .container-page > div.min-w-0 > p.mt-5`,
  «Somos un centro especializado…»); `/servicios`: el párrafo introductorio (`div.mt-6`);
  `/densitometria-osea`: `p.mt-6` del hero; `/consulta-virtual`: `h1#pregunta-titulo`. Todos son
  **texto de servidor**: sin imagen, sin fuente web (pila del sistema) y sin animación de entrada.
- **Fases (Home)**: TTFB 62 ms · *element render delay* 728 ms. No hay tiempo de carga de recurso.
- **En el trazo real el LCP = FCP** en las 12 corridas (Home 0,71–0,84 s observado): el texto se
  pinta en el primer cuadro. El simulador (Lantern) añade al camino del LCP la evaluación del chunk
  del runtime de React/Next (`3794-*.js`, 65 KB gzip, ~950 ms de CPU con el freno ×4), y de ahí
  salen los ~3 s.
- **Con limitación real** (`--throttling-method=devtools`, Home, 3 corridas): LCP **2,09 / 1,89 /
  1,85 s → mediana 1,89 s** ✔. En las corridas con TBT alto (958 y 1273 ms) el párrafo se pinta
  justo después de la tarea larga de hidratación: esa tarea es la causa del retraso.
- **Siguiente palanca** (no aplicada: implica rehacer, no mejorar): el HTML de la Home pesa 84 KB
  gzip (CSS en línea + carga RSC) y el runtime de React/Next (130 KB) es fijo en el App Router.
  Bajar el LCP simulado exige partir la hidratación (menos islas cliente en la Home) o reducir la
  carga RSC; queda en `docs/PENDIENTES.md`.
- `/densitometria-osea` lleva 64 KB de JS propio (explorador DXA, acordeón de Radix, medidor
  T-score) que ya existían; fuera del alcance de esta rama.

## Archivos modificados

68 archivos (18 nuevos, 50 modificados) desde `publicacion-movil` (`7446756`). Por zona:
`app/(site)/` (páginas), `components/sections` y `components/shared` (hero, pilares, horario, ruta
del paciente, suplementos), `components/layout` (cabecera, barra móvil, pie), `data/` (navegación,
servicios, suplementos), `app/globals.css` y `app/layout.tsx` (tokens y fuentes), `docs/`.

Nuevos: `app/(site)/seguimiento/page.tsx`, `app/(site)/suplementos/page.tsx`,
`components/consulta/AppointmentTypePicker.tsx`, `components/sections/{HoursSection,PatientRoute,SupplementsStrip}.tsx`,
`components/shared/{HoursBlock,PillarCard,SupplementCard}.tsx`, `data/supplements.ts`,
`data/supplements.example.ts`, `types/supplements.ts`, `tests/{navigation,services,supplements}.test.ts`,
`docs/{MEJORA-2026,PLANTILLAS-SEGUIMIENTO,DESPLIEGUE-HOSTINGER}.md`.

Verificación final: build ✔ · lint ✔ · typecheck ✔ · 316/316 tests ✔ · 0 enlaces rotos (91 URLs).
