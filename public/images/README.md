# Fotos de SERMEKARE: qué hay y cómo reemplazarlas

Todas las imágenes se sirven desde el propio dominio (sin `images.unsplash.com` ni otros orígenes
remotos) y `next/image` las entrega en AVIF/WebP al tamaño de cada pantalla. Ninguna pesa más de 150 KB.

| Lugar en la web | Archivo con la ruta | Imagen actual | Cómo se genera |
| --- | --- | --- | --- |
| Dr. Daniel Ccolcca (hero, perfil, tarjetas, consultorio, Open Graph, JSON-LD) | `data/doctors.ts` → `photo` y `REAL_DOCTOR_SHARE_PHOTO` | **Foto real**, recorte a cabeza y hombros: `doctor/daniel-ccolcca-{400,552}.{avif,webp}` y `daniel-ccolcca-552.jpg` | `node scripts/optimize-doctor-photo.mjs` desde `assets/originals/danielccolcca.png` (fuera de git). El recorte deja fuera el bordado de la bata, que lleva otro nombre; el cliente confirmó que es el Dr. Ccolcca. |
| «Así es tu consulta virtual» (3 pasos, Home) | `data/home.ts` → `stepBook`, `stepLink`, `stepReview` | `stock/paso-*.webp` (ilustrativas) | `node scripts/fetch-stock-images.mjs` |
| Portadas del blog | `data/home.ts` → `blogPosts[].cover` | `stock/blog-*.webp` (ilustrativas) | ídem |
| Secciones ocultas o sin usar (telemedicina, «así es tu atención», comparador, video) | `data/home.ts` → `telemedicine`, `careJourney`, `guided`, `video`, `hero` | `stock/*.webp` (ilustrativas) | ídem |
| Médicos de muestra (ocultos) | `data/doctors.ts` → `photo` | Sin foto (`null`): los retratos de stock llevaban nombres de otras personas | No reactivar sin fotos reales. |

Las fotos de `stock/` son ilustrativas (Unsplash, licencia Unsplash) y **no muestran al personal de
SERMEKARE**. Reemplázalas por fotos propias cuando existan (con autorización por escrito de las personas
que aparecen): guarda el archivo en `public/images/`, cambia la ruta en el archivo indicado y actualiza
su texto alternativo (`*Alt`), que está junto a la ruta.

Notas:

- No uses fotos de pacientes reales sin consentimiento informado por escrito.
- Exporta en WebP o JPG de buena calidad (≤ 150 KB, ancho ≤ 1200 px): `next/image` genera las versiones
  AVIF/WebP por tamaño de pantalla.
