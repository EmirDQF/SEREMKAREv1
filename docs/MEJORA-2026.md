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

_(se completa por fase)_

## Archivos modificados

_(se completa al final)_
