# Fotos de SERMEKARE — qué foto real va en cada lugar

Todas las imágenes actuales son **PROVISIONALES** e ilustrativas: ninguna muestra al personal real de SERMEKARE (Unsplash, servidas vía `next/image` con `remotePatterns`).
Antes de publicar, reemplázalas por fotos propias de la clínica (con autorización de las personas que aparecen).

Para usar fotos locales: guárdalas en esta carpeta (`public/images/`) y cambia la URL en el archivo indicado
por la ruta local, por ejemplo `/images/hero-medica.jpg`.

| Lugar en la web | Archivo con la URL | Foto actual (verificada: responde 200 y su contenido corresponde) | Foto real recomendada |
| --- | --- | --- | --- |
| Hero (Home) | `data/home.ts` → `homeImages.hero` | Médico en videoconsulta con laptop (Unsplash, ilustrativa) | Captura real de una teleconsulta del Dr. Ccolcca (con consentimiento) o el consultorio virtual. |
| «Así es tu consulta virtual» (3 pasos) | `data/home.ts` → `stepBook`, `stepLink`, `stepReview` | Videoconsultas desde el lado del médico (Unsplash, ilustrativas) | Fotos propias del flujo: reservar en el celular, videollamada, revisión de exámenes. |
| Banda de telemedicina | `data/home.ts` → `homeImages.telemedicine` | Médico conversando con una paciente por videollamada (ilustrativa) | Captura (simulada) de una teleconsulta real. |
| Médico real | `data/doctors.ts` → `photo` del Dr. Daniel Ccolcca | **Retrato provisional con iniciales «DC»** | Retrato profesional del Dr. Daniel Ccolcca. La foto recibida (`danielccolcca.png`) NO se publicó: la bata muestra otro nombre bordado («Dr. Daniel Cachay · Neurocirujano»). |
| «Así es tu atención» (oculta en la Home) | `data/home.ts` → `homeImages.careJourney` | Médica en videoconsulta (ilustrativa) | — |
| Comparador guiada vs a ciegas (oculto, D3) | `data/home.ts` → `homeImages.guided` | Especialistas frente a monitores con imágenes | Solo si se confirma el servicio de infiltraciones. |
| Miniatura del video (oculta) | `data/home.ts` → `homeImages.video` | Examen de rodilla en camilla | Fotograma del video institucional. |
| Médicos de muestra (ocultos) | `data/doctors.ts` → `photo` | Retratos de stock; dos tienen nombres bordados de otras personas | No reactivar sin reemplazar por fotos reales. |
| Portadas del blog | `data/home.ts` → `blogPosts[].cover` | Fotos alusivas (escaleras, estetoscopio, monitor, etc.) | Foto alusiva a cada artículo (16:10). |

Notas:

- No uses fotos de pacientes reales sin consentimiento informado por escrito.
- Exporta en JPG/WebP de buena calidad; Next.js genera AVIF/WebP optimizados automáticamente.
- El texto alternativo (`*Alt`) de cada foto está junto a su URL: actualízalo si cambias la imagen.
