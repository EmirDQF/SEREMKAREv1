# SERMEKARE — sermekare.com

Sitio web del Centro de Excelencia en Reumatología SERMEKARE (Next.js 16, App Router).

## Requisitos

- Node.js 22 (mínimo el indicado en `package.json` → `engines.node`).
- Variables de entorno: copia `.env.example`. Solo `NEXT_PUBLIC_SITE_URL` es obligatoria.

## Comandos

| Paso | Comando |
|---|---|
| Instalar | `npm ci` |
| Compilar | `npm run build` (usa webpack a propósito: `next build --webpack`) |
| Iniciar | `npm run start` (lee el puerto de la variable `PORT`) |
| Desarrollo | `npm run dev` |

## Publicar en Hostinger

Guía paso a paso: `LEEME-SUBIR-A-HOSTINGER.md` (viene junto a los ZIP) o, en el repositorio,
`docs/LEEME-SUBIR-A-HOSTINGER.md` y `docs/DESPLIEGUE-HOSTINGER.md`.
