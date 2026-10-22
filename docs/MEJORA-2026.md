# Mejora visual 2026 — SERMEKARE

Rama `mejora-visual-2026`. Primera etapa (fases 1–7, más abajo en «Historial»): el sitio pasó de
«teleconsulta primero» a **Centro de Excelencia en Reumatología**. Segunda etapa (fases A–F, esta
sección): rendimiento estructural, sistema visual «clínica de precisión», rediseño de las secciones
clave, móvil/accesibilidad, SEO y preparación para Hostinger. Es la **página web** de sermekare.com:
no se agregaron endpoints ni servicios; el consultorio virtual y la confirmación de cita siguen igual.

## Medición final (fases A–F)

### Método

- `npm run build` (webpack) + `next start -p 3100`, misma máquina Windows para antes y después.
- `node scripts/lighthouse-median.mjs --runs=5`: Lighthouse 13.5 móvil, **mediana de 5 corridas**
  por página, con limitación **simulada** (la de PageSpeed Insights) y con limitación **real**
  (`--throttling=devtools`: 562 ms de RTT y CPU ×4). Los JSON quedan en `.lighthouse/` (no versionado).
- JS inicial y HTML: `node scripts/measure-js.mjs` (gzip de los `<script src>` y del documento).
- «Antes» = commit `8f04834` (cierre de la primera etapa), medido de nuevo con el mismo método.

### Lighthouse móvil, limitación simulada (PageSpeed Insights) — mediana de 5

| Página | Rendimiento | A11y | BP | SEO | LCP | CLS | TBT | Peso |
|---|---|---|---|---|---|---|---|---|
| `/` | 79 → **87** | 100 → 100 | 100 | 100 | 2,92 → 3,34 s | 0 | 651 → **266 ms** | 352 → **328 KB** |
| `/servicios` | 80 → **92** | 98 → **100** | 100 | 100 | 2,74 → 2,98 s | 0 | 398 → **187 ms** | 379 → **298 KB** |
| `/densitometria-osea` | 77 → **92** | 100 | 100 | 100 | 3,28 → **2,77 s** | 0 | 603 → **206 ms** | 404 → **315 KB** |
| `/consulta-virtual` | 79 → **90** | 100 | 100 | 66* | 3,17 → 3,36 s | 0 | 525 → **202 ms** | 329 → **304 KB** |

Corridas (después): `/` 88/87/86/85/90 · `/servicios` 92/92/91/94/84 · `/densitometria-osea`
93/88/93/89/92 · `/consulta-virtual` 93/90/83/92/78. A11y de `/` y `/servicios` = 100 tras corregir el
contraste del número de los pilares y el orden de encabezados (verificado con una corrida posterior).
\* `/consulta-virtual` lleva `noindex` a propósito (herramienta de citas, no página de contenido).

### Lighthouse móvil, limitación real (devtools) — mediana de 5

| Página | Rendimiento | LCP | TBT |
|---|---|---|---|
| `/` | 94 → 88 | 1,64 → 2,90 s | 285 → **137 ms** |
| `/servicios` | 78 → 74 | 1,86 → 2,71 s | 961 → 901 ms |
| `/densitometria-osea` | 85 → **87** | 1,38 → 2,59 s | 570 → **203 ms** |
| `/consulta-virtual` | 97 → 94 | 1,32 → 2,06 s | 183 → 209 ms |

### JS inicial y HTML (gzip)

| Página | JS inicial | JS propio | HTML |
|---|---|---|---|
| `/` | 142 → **136 KB** ✔ (≤ 150) | 12 → **7 KB** | 84 → **57 KB** |
| `/servicios` | 142 → **136 KB** ✔ | 12 → **7 KB** | 64 → **34 KB** |
| `/densitometria-osea` | 194 → **138 KB** | 64 → **9 KB** ✔ (≤ 25) | 72 → **42 KB** |
| `/consulta-virtual` | 178 → **173 KB** | 47 → 44 KB | 51 → **17 KB** |

El runtime de React/Next (129–130 KB) es fijo en el App Router.

### Verificación

`lint` ✔ · `typecheck` ✔ · `test` 321/321 ✔ · `build` ✔ · `check:links` 0 rotos (93 URLs) ·
`check:seo` 36 URLs con título y descripción únicos, canonical a `https://sermekare.com`, un solo `<h1>`
y JSON-LD válido (7 títulos de artículos/especialidades pasan de 70 caracteres: Google los trunca, no
penaliza) · `qa:browser` sin scroll horizontal en 320/360/390/412/430/768/1366 px, claro y oscuro, sin
imágenes rotas, sin `wa.me`/`tel:` vacíos y sin errores de consola · `npm audit --omit=dev` 0
vulnerabilidades.

## Fase A — Rendimiento estructural (qué se hizo y por qué)

| Cambio | Efecto medido |
|---|---|
| Cabecera, menú móvil, diálogos, tema e interruptor de animaciones como HTML de servidor + un solo efecto cliente con escuchas delegadas (`components/layout/SiteEffects.tsx`) | JS propio de la Home 12 → 7 KB; sin árboles cliente que hidratar en la cabecera y el pie |
| `CanvasHostLoader` (lienzo 3D) fuera del layout raíz: solo en páginas con escenas | El 3D ya no se evalúa en la Home ni en páginas sin escenas |
| Densitometría sin `motion`: barrido DXA en CSS, checklist con radios nativos y diferido al acercarse | JS propio 64 → 9 KB |
| `inlineCss` desactivado | Next copiaba los 92 KB de CSS también en la carga RSC: HTML 92 → 57 KB y TBT 600–870 → ~260 ms |
| 23 módulos sin uso eliminados (secciones retiradas en la etapa anterior; siguen en el historial de git) | Menos CSS de Tailwind y menos código |
| Probado y **descartado**: envolver secciones en `<Suspense>` para partir la hidratación | React saca del flujo los límites grandes y los revela después con un script: el hero quedaba en blanco +640 ms |
| Imágenes: el retrato es `<picture>` de servidor con AVIF/WebP pregenerados (16 KB), `fetchpriority="high"` solo en el hero y dimensiones reservadas (CLS 0) | Se mantiene sin `next/image` (su componente cliente sumaría ~5 KB a la Home) |
| Fuentes: sistema para el texto (el LCP es un párrafo) + Plus Jakarta Sans solo en títulos con `display: optional` | `swap` causó CLS 0,19 en la etapa anterior; `optional` lo evita |

## Lo que no llegó a la meta (elemento y causa)

| Meta | Resultado | Elemento | Causa |
|---|---|---|---|
| Rendimiento simulado ≥ 90 en las 4 páginas | 87 en `/` (92, 92 y 90 en las otras) | — | El LCP simulado (fila siguiente) |
| LCP simulado ≤ 2,5 s | 2,77–3,36 s | `/`: párrafo del hero (`section > .container-page > div.min-w-0 > p.mt-5`); `/servicios`: entrada del `PageHero`; `/densitometria-osea`: `p.mt-6` del hero; `/consulta-virtual`: `h1#pregunta-titulo` | Todos son **texto de servidor** que se pinta en el primer cuadro. En los trazos de este equipo, Chrome sin GPU presenta ese cuadro 0,6–1,2 s después de DOMContentLoaded (medido: `/terminos`, de 476 nodos, dio 375 ms en una corrida y 1308 ms en la siguiente). Lantern (el simulador) suma entonces al LCP toda la CPU anterior a ese cuadro: la evaluación del runtime de React/Next (129 KB gzip, fijo) y la hidratación. Es un piso del entorno local que hay que confirmar con PageSpeed Insights sobre la URL real |
| LCP con limitación real ≤ 2,0 s | 2,06–2,90 s (antes 1,32–1,86 s) | Los mismos | Con el CSS externo hay una petición más antes del primer pintado; con la limitación de Lighthouse (562 ms de RTT) cuesta ~0,6 s. Es el precio de bajar el TBT a un tercio y el HTML 30–70 %: con `inlineCss` el LCP real de la Home era 1,89 s pero el TBT 867 ms. En redes reales con HTTP/2 (RTT de 50–150 ms) la diferencia es mucho menor |
| TBT ≤ 300 ms | ✔ en simulado (187–266 ms); con limitación real ✔ en 3 de 4, `/servicios` 901 ms | Hidratación de la página | Varianza alta de esta máquina (corridas de 72 a 90 puntos) |

### Comparación final: CSS en línea frente a CSS en archivo (Home, una sola vuelta)

Build de producción, 5 corridas y mediana por variante, misma máquina (con el entorno de escritorio
abierto: no fue posible cerrar todos los programas). Regla fijada antes de medir: quedarse con la
variante de mejor LCP con limitación real **siempre que el TBT simulado no pase de 400 ms**.

| Variante | LCP limitación real | TBT limitación real | LCP simulado | TBT simulado | Rend. simulado | Peso |
|---|---|---|---|---|---|---|
| CSS en archivo (`inlineCss: false`) | 2,80 s | 187 ms | 2,81 s | **261 ms** | **91** | 328 KB |
| CSS en línea (`inlineCss: true`) | **2,12 s** | 408 ms | 3,38 s | 566 ms ✗ | 80 | 360 KB |

**Decisión: se mantiene el CSS en archivo.** El CSS en línea gana 0,7 s de LCP con limitación real
(se ahorra la petición del CSS), pero Next copia el CSS también dentro de la carga RSC y el TBT
simulado sube a 566 ms, por encima del límite, con 11 puntos menos en la nota que mide PageSpeed
Insights.

## Fase B — Sistema visual «clínica de precisión del futuro»

Limpia, luminosa y tecnológica sin dejar de ser médica: superficies blanco-azuladas, navy índigo para
el peso, teal clínico para la acción y un aqua frío como acento tecnológico. Sin neón ni oscuro por
defecto. Fuente de verdad: `app/globals.css` (roles) y `app/palette.css` (escalas, generadas con
`node scripts/palette.mjs --css > app/palette.css`).

### Escalas (OKLCH con alternativa hex)

| Paso | navy (h 264) | teal (h 184) | aqua (h 222) | mist (h 250, neutro) |
|---|---|---|---|---|
| 50 | `#f2f6fe` | `#e7fcf8` | `#ecfaff` | `#f7f9fc` |
| 100 | `#e4ebfb` | `#c7f7ef` | `#d5f3fd` | `#edf2f7` |
| 200 | `#c9d6f1` | `#98eee1` | `#b0e6fa` | `#dde5ed` |
| 300 | `#a4b8df` | `#61e0d0` | `#82d5f1` | `#c9d3de` |
| 400 | `#7890c2` | `#20cbba` | `#49bee2` | `#9aa6b3` |
| 500 | `#526da6` | `#0dac9d` | `#00a2c7` | `#6d7a89` |
| 600 | `#38538d` | `#01877b` | `#0283a1` | `#4e5c6b` |
| 700 | `#263d70` | `#037066` | `#036881` | `#374554` |
| 800 | `#192c55` | `#00574f` | `#005064` | `#212f3d` |
| 900 | `#0f1d3a` | `#00403a` | `#003949` | `#131f2c` |
| 950 | `#081128` | `#002a25` | `#002530` | `#08111b` |

El `slate` de Tailwind se mapea a `mist`: un solo gris frío en todo el sitio.

### Roles y contraste (verificado en `tests/contrast.test.ts`: AA en todos los pares, AAA en el cuerpo)

| Rol | Claro | Oscuro | Uso | Contraste sobre tarjeta (claro · oscuro) |
|---|---|---|---|---|
| `--surface` (`--background`) | `#f7fafe` | `#081128` | Fondo de página | — |
| `--surface-raised` (`--card-solid`) | `#ffffff` | `#121d36` | Tarjetas, paneles | — |
| `--ink` (`--foreground`) | `#0f1d3a` | `#edf2f7` | Cuerpo | 16,7 · 14,9 : 1 (AAA) |
| `--ink-muted` (`--muted`) | `#374554` | `#c9d3de` | Texto secundario | 9,8 · 11,0 : 1 (AAA) |
| `--subtle` | `#4e5c6b` | `#9aa6b3` | Etiquetas | 6,8 · 6,8 : 1 |
| `--accent` (`--teal-strong`) | `#037066` | `#61e0d0` | Botón principal, enlaces, iconos | 6,0 · 10,4 : 1 |
| `--accent-ink` (`--on-primary`) | `#ffffff` | `#081128` | Texto sobre el botón | 6,0 · 11,7 : 1 |
| `--video` | `#036881` | `#82d5f1` | Teleconsulta (servicio extra) | 6,4 · 10,2 : 1 |
| `--line` | mist-300 al 72 % | navy-400 al 24 % | Bordes | — |
| `--focus` (`--ring`) | `#0283a1` | `#82d5f1` | Anillo de foco | ≥ 3 : 1 |
| `--success` | `#047857` | `#34d399` | Éxito / en línea | AA |
| `--danger` (`--alert`) | `#dc2626` | `#f87171` | Urgencias y errores | AA |
| `--warning` (`--pain-text`) | `#b45309` | `#fcd34d` | **Solo zonas de dolor** (ámbar reservado) | AA |
| `--navy` (bandas) | `#0f1d3a` | `#0c162c` | Pie y bandas oscuras | texto `#dde5ed`: 13,1 · 14,1 : 1 |

### Reglas de uso

- Un solo CTA principal en todo el sitio: **«Agendar cita»** (teal sólido con halo `--shadow-glow`);
  WhatsApp como secundario. Teleconsulta y densitometría tienen su CTA solo en sus bloques.
- Un solo degradado expresivo: **aurora** (`.aurora`) en el hero, `PageHero` y bandas oscuras. El
  resto, superficies planas con borde luminoso de 1 px (`.gradient-border`, `--edge-glow`).
- Motivos de «escáner» siempre tenues y decorativos (`aria-hidden`): cuadrícula de puntos
  (`.scan-grid`), líneas (`.scan-lines`), barrido (`.scan-sweep`, solo escritorio) y retícula SVG
  (`components/shared/Reticle.tsx`, 5 nodos).
- Datos (horario, T-score, pasos, números de pilares) en monoespaciada del sistema (`.data-mono`,
  `.tech-label`): sin descargar fuente. Máximo 2 familias (sistema + Plus Jakarta Sans).
- Texto mínimo **16 px** en todo el sitio (`text-xs`/`text-sm` = 1 rem); áreas táctiles ≥ 48 px.
- Movimiento: solo `transform` y `opacity`; entradas ligadas al scroll en tablet/escritorio; View
  Transitions entre páginas; todo apagado con `prefers-reduced-motion` y con «Reducir animaciones».
- Vidrio (`.glass`, `.glass-panel`): sin `backdrop-filter` en móvil.
- Bento con foco que sigue al puntero **solo con mouse** y sin JS: rejilla 3×3 de zonas invisibles +
  `:has()` + `@property` (`.bento-card`); en táctil, un `:active` claro.
- No se hizo la página `/design`: sería una ruta sin valor para el paciente.

Skills aplicadas: `frontend-design-direction` (dirección y detalle memorable: el panel «sala de
imagen» con la escala T-score), `design-system` (escalas, roles y auditoría: se eliminaron los hex
antiguos de los componentes), `make-interfaces-feel-better` (radios concéntricos, `tabular-nums`,
contorno de imágenes, transiciones con propiedades explícitas, áreas táctiles), `motion-patterns` y
`motion-advanced` (sus patrones se aplicaron en CSS para no sumar `motion` al JS), `frontend-a11y`,
`react-performance`, `nextjs-turbopack`, `seo`, `deployment-patterns`, `browser-qa` y
`verification-loop`. `taste-application` está orientada a edición de video: no aplica a una web.

## Fase C — Qué cambió visualmente, página por página

| Página | Cambio |
|---|---|
| Home | Hero con aurora, cuadrícula, retícula y barrido; 3 caminos (cita, densitometría, WhatsApp); tarjeta del Dr. Ccolcca con borde luminoso y marcas de encuadre. Pilares 01–04 en bento con foco de luz. Densitometría como panel «sala de imagen» con escala T-score en SVG + preparación, duración, qué recibes, dónde y precio («Por confirmar»). Teleconsulta con borde punteado aqua y pasos numerados. Suplementos con aviso legal visible. Ruta del paciente con números grandes y línea de progreso. Horario en monoespaciada. Banda final con aurora |
| Servicios y fichas | `PageHero` con aurora; panel de densitometría y bandas oscuras unificadas; CTA principal teal |
| Densitometría | Ilustración DXA en CSS; banda «Así es el estudio» unificada; checklist sin `motion` |
| Suplementos | «Catálogo en preparación» en vidrio con borde luminoso; aviso de suplementos con ancla enlazada desde el pie |
| Teleconsulta, tarifas, especialidades, staff, blog, FAQ, sedes, contacto, seguimiento y legales | Heredan tokens, `PageHero`, `CtaBand` (mismo par de CTA), eyebrow y escala tipográfica |
| Cabecera y barra móvil | Vidrio con borde luminoso al hacer scroll (sin blur en móvil); franja superior y logo a 48 px; barra móvil con halo en «Agendar cita» |
| Pie | Cuadrícula tenue, horario en monoespaciada con domingos «por confirmar», columna de sedes más ancha, enlaces de 48 px y todos los textos legales enlazados |
| 404 y error | Misma estética (aurora, retícula) y «Agendar cita» primero |

## Fases D y E — Móvil, accesibilidad, SEO y legal

- QA automático (`npm run qa:browser`): 17 páginas × 7 anchos × 2 temas.
- Lighthouse A11y 100, BP 100 y SEO 100 en las páginas de contenido medidas.
- `robots.ts` bloquea `/api/` y `/cita-confirmada/`; `manifest.webmanifest` y `apple-icon`; imagen OG
  con la paleta 2026 y la foto del doctor; meta descripciones ≤ 158 caracteres.
- Textos legales y médicos comparados con `publicacion-movil`: **sin pérdidas** (el aviso de límites
  de la teleconsulta se movió a `data/teleconsult-content.ts` con el mismo texto). El pie enlaza
  privacidad, términos, consentimiento de teleconsulta, aviso de suplementos y links de interés, el
  Libro de Reclamaciones y muestra el aviso médico.
- `engines.node >= 20.9.0`, `package-lock.json` versionado y `PORT` leído por `next start`. Pasos de
  publicación: `docs/DESPLIEGUE-HOSTINGER.md`.

---

# Historial — primera etapa (fases 1–7)

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
