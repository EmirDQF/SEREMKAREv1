# Cómo subir la web de SERMEKARE a Hostinger

Guía paso a paso para publicar sermekare.com sin tocar código ni usar GitHub. Solo vas a subir **un
archivo ZIP** al panel de Hostinger (hPanel), escribir unas variables y reiniciar la aplicación.

> Los nombres exactos de botones y menús de Hostinger cambian con el tiempo. Donde dice
> **(verifica en tu hPanel)**, el paso es correcto pero el nombre del botón puede ser distinto.

---

## Lista de control (marca las 10 antes de subir)

- [ ] 1. Tengo esta carpeta completa: los dos ZIP, esta guía y `VERSION.txt`.
- [ ] 2. Descargué el respaldo de la versión actual desde hPanel (Paso 0) y anoté el código `7446756`.
- [ ] 3. Anoté las variables de entorno que ya existen en la aplicación (sobre todo Cal.com y WhatsApp).
- [ ] 4. Sé en qué carpeta vive la aplicación Node.js de sermekare.com en hPanel.
- [ ] 5. Voy a usar la **Opción A** (`sermekare-fuente.zip`); la B solo si la A falla.
- [ ] 6. La versión de Node.js elegida en el panel es **22**.
- [ ] 7. Tengo a mano el valor `https://sermekare.com` para `NEXT_PUBLIC_SITE_URL`.
- [ ] 8. No voy a subir ningún archivo `.env` con claves (las claves van solo en el panel).
- [ ] 9. Tengo 30 minutos sin apuro y el celular cargado para revisar al final.
- [ ] 10. Sé cómo volver atrás (sección «Si algo sale mal», al final).

---

## Qué hay en esta carpeta

| Archivo | Para qué sirve |
|---|---|
| `sermekare-fuente.zip` | **Opción A (recomendada).** El sitio sin compilar. Hostinger lo instala y lo compila. |
| `sermekare-listo.zip` | **Opción B (plan de respaldo).** El sitio ya compilado. Se inicia con `server.js`, sin compilar nada. |
| `sermekare-listo/` | La misma Opción B, descomprimida (por si prefieres subir la carpeta). |
| `LEEME-SUBIR-A-HOSTINGER.md` / `.txt` | Esta guía (el mismo texto en dos formatos). |
| `VERSION.txt` | Fecha, versión y «huella» (SHA-256) de cada ZIP: sirve para saber exactamente qué se subió. |

**¿Cuál elijo?** Empieza por la **Opción A**: es la forma normal de publicar una aplicación Node.js en
Hostinger y deja todo listo para futuras actualizaciones. Si la compilación falla o tarda demasiado
(más de 15 minutos), usa la **Opción B**: no necesita compilar.

---

## Paso 0. Antes de empezar (5 minutos)

1. **Respaldo de la versión actual.** En hPanel → **Sitios web** → sermekare.com → **Administrador de
   archivos** → selecciona la carpeta de la aplicación → **Descargar** (o «Comprimir» y luego
   descargar). Guarda ese archivo en tu computadora. **(verifica en tu hPanel)**
   - Además, anota este código: **`7446756`**. Es la versión publicada hoy en la rama `main`; sirve
     para volver atrás si fuera necesario.
2. **Anota las variables de entorno que ya existen.** En la aplicación Node.js → **Variables de
   entorno**, copia en un papel o documento los nombres y valores que veas (sobre todo las de
   Cal.com y WhatsApp, si existen). **No las borres.**
3. Ten a mano el celular para revisar el sitio al final.

---

## Opción A (recomendada): subir el sitio sin compilar

1. Entra a **hPanel** → **Sitios web** → **sermekare.com** → **Aplicación Node.js** (o **Node.js
   Apps**). **(verifica en tu hPanel)**
   - *Qué debes ver:* la ficha de la aplicación con su estado (en ejecución o detenida) y sus ajustes.
2. Elige subir archivos: **Subir archivo ZIP** / **Upload** y selecciona `sermekare-fuente.zip`.
   **(verifica en tu hPanel)**
   - Si tu panel no tiene esa opción: abre el **Administrador de archivos**, entra a la carpeta de la
     aplicación, sube `sermekare-fuente.zip` y usa **Extraer**. Si pregunta, acepta **reemplazar** los
     archivos existentes.
   - *Qué debes ver:* en la carpeta de la aplicación, carpetas como `app`, `components`, `public` y el
     archivo `package.json` (no una carpeta extra que los contenga).
3. **Versión de Node.js:** elige **22** (22.x).
4. **Comando de instalación y compilación:** `npm ci && npm run build`
   - Si el panel tiene dos campos separados: instalación `npm ci` y compilación `npm run build`.
   - Si `npm ci` diera error, usa `npm install` en su lugar.
   - Funciona aunque el panel instale en «modo producción»: todo lo que necesita la compilación está
     en las dependencias principales.
5. **Comando de inicio:** `npm run start`
   - Si el panel pide un «archivo de inicio» en vez de un comando, usa la **Opción B**.
6. **Variables de entorno:** agrega o confirma las de la sección **«Variables de entorno»** de esta
   guía. La primera y obligatoria es `NEXT_PUBLIC_SITE_URL` = `https://sermekare.com`.
7. Pulsa **Desplegar** / **Guardar y reiniciar** / **Reiniciar aplicación**. **(verifica en tu hPanel)**
   - *Qué debes ver:* un registro (log) que instala paquetes, luego `Creating an optimized production
     build`, luego una lista de rutas y finalmente que la app está **en ejecución**. Puede tardar
     entre 3 y 10 minutos.
8. Sigue con **«Verificación en vivo»**.

---

## Opción B (respaldo): subir el sitio ya compilado

1. En **hPanel** → **Sitios web** → **sermekare.com** → **Aplicación Node.js**. **(verifica en tu hPanel)**
2. Abre el **Administrador de archivos**, entra a la carpeta de la aplicación, sube
   `sermekare-listo.zip` y usa **Extraer** (acepta **reemplazar** si pregunta).
   - *Qué debes ver:* en la carpeta de la aplicación, el archivo `server.js`, las carpetas `.next`,
     `public` y `node_modules`, y `package.json`. (La carpeta `.next` empieza con punto: si no la ves,
     activa «mostrar archivos ocultos».)
3. **Versión de Node.js:** **22**.
4. **Archivo de inicio:** `server.js` (o comando de inicio: `node server.js`).
5. **Comando de compilación:** **ninguno** (déjalo vacío). Si el panel obliga a poner uno, usa
   `echo listo`. **No pongas** `npm ci` ni `npm run build` en esta opción.
6. **Variables de entorno:** las mismas de la sección siguiente.
7. **Reiniciar aplicación.**
   - *Qué debes ver:* en el registro, `Ready` o `Listening on`. Arranca en segundos.
8. Sigue con **«Verificación en vivo»**.

> En la Opción B la dirección del sitio (`NEXT_PUBLIC_SITE_URL`) quedó fijada como
> `https://sermekare.com` al compilar. Si algún día cambia el dominio, hay que volver a generar el
> paquete (o usar la Opción A).

---

## Variables de entorno

Cárgalas en el panel de la aplicación → **Variables de entorno**. Si ya existen, **no las borres**:
solo agrega las que falten.

| Variable | ¿Obligatoria? | Valor |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Sí** | `https://sermekare.com` (sin barra al final) |
| `BOOKING_PROVIDER` | No | `demo` (por defecto). `calcom` solo si ya tienes Cal.com configurado |
| `CALCOM_API_KEY` | Solo con `calcom` | La clave de Cal.com (empieza con `cal_live_`) |
| `CALCOM_WEBHOOK_SECRET` | Solo con `calcom` | El secreto del webhook de Cal.com |
| `CALCOM_API_URL` | No | `https://api.cal.com/v2` |
| `CALCOM_WEB_URL` | No | `https://cal.com` |
| `WHATSAPP_CLOUD_TOKEN` | No | Token de WhatsApp Cloud API (confirmación automática) |
| `WHATSAPP_PHONE_ID` | No | ID del número en WhatsApp Cloud API |
| `WHATSAPP_TEMPLATE_NAME` | No | `confirmacion_cita` |
| `WHATSAPP_TEMPLATE_LANG` | No | `es` |
| `WHATSAPP_GRAPH_VERSION` | No | `v21.0` |
| `PORT` | No la toques | La pone Hostinger |

**Sin las variables de Cal.com y WhatsApp el sitio funciona completo:** las citas se coordinan en modo
demostración y por WhatsApp, como hasta ahora.

---

## Dominio, SSL y «www»

1. **Dominio:** en la aplicación → **Dominios**, confirma que `sermekare.com` está conectado a esta
   aplicación. **(verifica en tu hPanel)**
2. **SSL (candado):** hPanel → **Seguridad** → **SSL** → que esté **activo** para `sermekare.com` y
   para `www.sermekare.com`. Si no, instala el SSL gratuito. Activa **Forzar HTTPS**. **(verifica en tu hPanel)**
3. **www → dominio principal:** hPanel → **Dominios** → **Redirecciones**: `www.sermekare.com` →
   `https://sermekare.com`, tipo **301 (permanente)**. **(verifica en tu hPanel)**
   - *Cómo comprobarlo:* abre `www.sermekare.com/sedes` en el celular: la barra de direcciones debe
     terminar en `sermekare.com/sedes` (sin «www»).

---

## Qué pasa con lo que ya estaba en la aplicación

- **Reemplaza los archivos**, pero **no borres** las variables de entorno del panel: ahí están las
  claves de Cal.com y WhatsApp si ya las tenías.
- No subas ningún archivo `.env` con claves: las claves van solo en el panel.
- Si después de subir ves archivos viejos que ya no están en el ZIP, no molestan; no hace falta
  borrarlos.

---

## Verificación en vivo (10 minutos, en el celular)

Abre cada dirección con datos móviles (no Wi-Fi). Todas deben abrir sin error:

| Dirección | Qué debes ver |
|---|---|
| `sermekare.com` | «Centro de Excelencia en Reumatología», la foto del Dr. Daniel Ccolcca, los botones «Agendar cita», «Densitometría» y «WhatsApp», y abajo la barra fija con «Agendar cita» y «WhatsApp» |
| `sermekare.com/servicios` | Los 4 pilares (01 a 04) y la teleconsulta como «Servicio extra» |
| `sermekare.com/densitometria-osea` | La ilustración del estudio, la escala T-score y el botón «Agendar densitometría» |
| `sermekare.com/suplementos` | «Catálogo en preparación» y el aviso «no son medicamentos» |
| `sermekare.com/seguimiento` | La ruta del paciente y el botón para solicitar el control |
| `sermekare.com/sedes` y `/contacto` | Las 3 sedes, el horario y «Cómo llegar» |
| `sermekare.com/consulta-virtual` | El consultorio: elegir el tipo de cita |
| `sermekare.com/esta-pagina-no-existe` | La página «Esta página se nos lesionó» (es normal: es la página de error 404) |
| `sermekare.com/sitemap.xml` | Una lista de direcciones que empiezan con `https://sermekare.com/` |
| `sermekare.com/robots.txt` | Un texto corto con `Sitemap: https://sermekare.com/sitemap.xml` |

Prueba también: el botón **WhatsApp** abre la app de WhatsApp con un mensaje escrito; el menú (las
tres rayas) se abre y se cierra; el botón de la luna cambia a modo oscuro.

---

## Después de publicar

1. **Google Search Console** (https://search.google.com/search-console): agrega la propiedad
   `sermekare.com` y en **Sitemaps** envía `https://sermekare.com/sitemap.xml`.
2. **PageSpeed Insights** (https://pagespeed.web.dev), pestaña **Móvil**, con estas 4 direcciones:
   `https://sermekare.com/`, `/servicios`, `/densitometria-osea` y `/consulta-virtual`. Guarda los
   resultados: son la medición oficial (la de Google, en sus servidores).

---

## Si algo sale mal

**Volver a la versión anterior:** sube el respaldo que descargaste en el Paso 0 (Administrador de
archivos → subir → extraer, reemplazando) y reinicia la aplicación. Si Hostinger muestra un
**historial de despliegues**, también puedes volver a desplegar el anterior desde ahí. **(verifica en tu hPanel)**

### Los 3 errores más comunes

| Lo que ves | Causa probable | Solución |
|---|---|---|
| El registro dice `Unsupported engine`, `SyntaxError` o la compilación se corta al empezar | **Versión de Node.js** antigua | En los ajustes de la aplicación elige **Node 22** y vuelve a desplegar |
| El registro dice «NEXT_PUBLIC_SITE_URL tiene un valor no válido» o «Falta NEXT_PUBLIC_SITE_URL»; o la página carga con direcciones raras (el sitemap no dice `https://sermekare.com`); o las citas en línea no responden | **Variables de entorno** faltantes o mal escritas | Revisa `NEXT_PUBLIC_SITE_URL` = `https://sermekare.com` (sin barra final) y las de Cal.com si las usas. En la Opción A, después de corregirlas **vuelve a compilar** |
| «503», «Application not responding» o la app se detiene sola | **Puerto o archivo de inicio** incorrecto | Opción A: comando de inicio `npm run start`. Opción B: archivo de inicio `server.js` (está en la raíz de la carpeta de la app, no dentro de otra carpeta). No fijes `PORT` a mano: lo pone Hostinger |

Si nada de esto lo resuelve, copia las últimas líneas del registro (log) de la aplicación y envíalas a
quien te ayuda con la web.
