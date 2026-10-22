# Despliegue en Hostinger (aplicación Node.js)

SERMEKARE es una app **Next.js 16 con servidor Node** (no es un sitio estático): las rutas `/api/*`,
`/consulta-virtual`, `/cita-confirmada/[uid]`, el webhook de Cal.com y las imágenes generadas
(`/opengraph-image`, `/apple-icon`) necesitan `npm run start`. **No** uses `output: "export"`.

## 0. Antes de publicar (lista de control)

Marca cada punto antes de fusionar a `main`:

- [ ] Revisaste la rama `mejora-visual-2026` en tu celular (ver «Revisar en el celular» abajo).
- [ ] En tu PC, todo en verde: `npm ci && npm run lint && npm run typecheck && npm test && npm run build`.
- [ ] Con el build servido (`npm run start`): `npm run check:links` sin enlaces rotos.
- [ ] `docs/PENDIENTES.md` revisado: nada marcado «Por confirmar» que el cliente ya haya confirmado.
- [ ] Horario y denominación «Centro de Excelencia en Reumatología» confirmados por el cliente
      (hoy se publican marcados para confirmar: `data/site.ts`).
- [ ] Ningún archivo `.env*` con valores reales en el repositorio (`git ls-files | grep env` solo muestra `.env.example`).
- [ ] Variables de entorno cargadas en Hostinger (sección 4).
- [ ] Copia de seguridad: anota el último commit de `main` desplegado (para revertir, sección 8).

## 1. Revisar en el celular (antes de la fusión)

1. En tu PC: `npm run build && npm run start` (puerto 3000).
2. Conecta el celular a la misma red Wi-Fi y abre `http://IP-DE-TU-PC:3000` (la IP sale con `ipconfig`).
3. Recorre: Home, «Agendar cita», densitometría, suplementos, seguimiento, sedes, contacto, una
   página de servicio, el menú y el modo oscuro. Prueba los botones de WhatsApp (abren la app).

## 2. Pull request y fusión a `main`

1. En GitHub: **Pull requests → New** · base `main` ← compare `mejora-visual-2026`.
2. Título sugerido: «Mejora 2026: rendimiento, sistema visual y preparación para Hostinger».
3. Revisa la pestaña *Files changed* y fusiona con **Merge pull request** (no *Squash*: conserva un
   commit por fase, útil para revertir por partes).

## 3. Crear la aplicación en Hostinger

Panel de Hostinger → **Sitios web → Agregar sitio web → Aplicación Node.js** (o en un sitio
existente: **Avanzado → Node.js**).

| Campo | Valor |
|---|---|
| Origen | **Importar repositorio de Git** (GitHub) |
| Repositorio | el de SERMEKARE |
| Rama | `main` |
| Versión de Node.js | **22.x** (mínimo 20.9; lo exige `engines.node` en `package.json`) |
| Directorio raíz | `/` (la raíz del repositorio) |
| Comando de instalación | `npm ci` (usa `package-lock.json`, versionado) |
| Comando de compilación | `npm run build` (usa **webpack** a propósito: `next build --webpack`; no lo cambies) |
| Comando de inicio | `npm run start` |
| Puerto | el que asigne Hostinger: lo entrega en la variable `PORT` y `next start` la lee sola |

## 4. Variables de entorno

Panel de la aplicación → **Variables de entorno**. Copia los nombres de `.env.example`.
**Nunca** subas `.env.local` al repositorio.

| Variable | Obligatoria | Valor |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Sí** | `https://sermekare.com` (sin barra final). Canonical, sitemap, Open Graph y JSON-LD |
| `NODE_ENV` | La pone Hostinger | `production` (activa la CSP) |
| `BOOKING_PROVIDER` | No | `demo` (por defecto) o `calcom` |
| `CALCOM_API_KEY` | Con `calcom` | API key de Cal.com (`cal_live_…`) |
| `CALCOM_API_URL`, `CALCOM_WEB_URL` | No | Por defecto `https://api.cal.com/v2` y `https://cal.com` |
| `CALCOM_WEBHOOK_SECRET` | Con `calcom` | Secreto del webhook |
| `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_PHONE_ID` | No | Confirmación automática por WhatsApp Cloud API |
| `WHATSAPP_TEMPLATE_NAME`, `WHATSAPP_TEMPLATE_LANG`, `WHATSAPP_GRAPH_VERSION` | No | Plantilla aprobada por Meta |

Sin variables de citas, la web funciona completa en **modo demo** (las reservas se rotulan como
demostración). Guía de Cal.com: `docs/CONFIGURAR-CITAS.md`. Si cambias una variable, vuelve a
compilar (las `NEXT_PUBLIC_*` se fijan en el build).

## 5. Dominio, SSL y `www`

1. **Dominio:** panel de la aplicación → **Dominios** → conecta `sermekare.com`. Si el dominio está en
   otro registrador, apunta sus DNS a Hostinger (registros que muestra el panel).
2. **SSL:** **Seguridad → SSL** → instala el certificado gratuito (Let's Encrypt) para `sermekare.com`
   **y** `www.sermekare.com`. Activa **Forzar HTTPS**.
3. **`www` → dominio principal:** el sitio usa `https://sermekare.com` como canonical. En Hostinger:
   **Dominios → Redirecciones** → `www.sermekare.com` → `https://sermekare.com` (301, permanente,
   conservando la ruta). Comprueba: `curl -I https://www.sermekare.com/sedes` debe responder `301`
   con `location: https://sermekare.com/sedes`.
4. La cabecera `Strict-Transport-Security` (HSTS, 2 años, con `preload`) se envía desde
   `next.config.ts`: actívala solo cuando el SSL ya funcione en ambos nombres.

## 6. Verificación después de desplegar (prueba de humo)

Con el dominio real (sustituye si aún usas el temporal de Hostinger):

| Ruta | Esperado |
|---|---|
| `/` | 200 · hero «Centro de Excelencia en Reumatología», 3 caminos (cita, densitometría, WhatsApp) |
| `/servicios` y `/servicios/apoyo-diagnostico` | 200 · pilares y «Agendar» |
| `/densitometria-osea` | 200 · escala T-score y checklist (cargan al acercarse) |
| `/suplementos` | 200 · «Catálogo en preparación» y aviso «no son medicamentos» |
| `/seguimiento` | 200 · «Solicitar mi control» abre WhatsApp |
| `/consulta-virtual?servicio=elegir` | 200 · selector de tipo de cita (noindex) |
| `/una-ruta-que-no-existe` | 404 con la página propia |
| `/sitemap.xml`, `/robots.txt` | 200 · dominio real; robots bloquea `/api/` y `/cita-confirmada/` |
| `/opengraph-image`, `/apple-icon`, `/manifest.webmanifest` | 200 |

Comprobaciones rápidas:

```bash
curl -sI https://sermekare.com/ | grep -i -E "content-security-policy|strict-transport|x-frame"
curl -s https://sermekare.com/robots.txt
```

Luego:

1. **PageSpeed Insights** (https://pagespeed.web.dev) con `https://sermekare.com/`, `/servicios`,
   `/densitometria-osea` y `/consulta-virtual`, pestaña **Móvil**. Compara con la tabla de
   `docs/MEJORA-2026.md` (los números de PSI salen de servidores de Google y difieren de los locales).
2. **Search Console:** agrega la propiedad `sermekare.com`, envía `https://sermekare.com/sitemap.xml`.
3. **Prueba de resultados enriquecidos** (https://search.google.com/test/rich-results) con la Home y
   `/preguntas-frecuentes` (MedicalClinic, Physician, FAQPage).
4. En el celular, con datos móviles: «Agendar cita», WhatsApp y llamar.

## 7. Actualizaciones

Cada `git push` a `main` vuelve a desplegar si activaste el despliegue automático; si no, en el panel:
**Desplegar** (instala, compila y reinicia).

## 8. Cómo revertir

- **Rápido (panel):** Hostinger → la aplicación → **Historial de despliegues** → vuelve a desplegar el
  anterior.
- **Por Git:** en tu PC, `git revert -m 1 <commit-de-la-fusión>` sobre `main`, `git push`, y vuelve a
  desplegar. Para revertir una sola fase, revierte su commit (`git log --oneline` muestra uno por fase).
- Si el problema es una variable de entorno, corrígela en el panel y vuelve a compilar.
