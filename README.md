# Portal web GAM Sipe Sipe (Astro)

Sitio institucional público inspirado en portales municipales similares al [GAM Viñinto](https://www.gamvinto.gob.bo/), con **contenido de demostración** y arquitectura lista para crecer.

Este proyecto vive en `website/` y **no modifica** la app Flutter `correspondencia_sipe_sipe`.

## Desarrollo

```bash
cd website
npm install
npm run dev
```

Abrir `http://localhost:4321`.

## Build

```bash
npm run build
npm run preview
```

## Estructura escalable

| Ruta | Uso |
|------|-----|
| `src/data/*.ts` | Contenido estático (noticias, eventos, trámites, etc.) |
| `src/types/content.ts` | Tipos compartidos |
| `src/components/` | UI reutilizable |
| `src/pages/` | Rutas del sitio |

Para conectar un backend (FastAPI) más adelante:

1. Sustituir imports desde `src/data` por `fetch` en el frontmatter de Astro o por endpoints en build time.
2. Opcional: migrar noticias/gaceta a **Astro Content Collections** con Markdown/MDX.

## Integración con Sipe Sipe Gestión

La Gaceta se consume **en runtime** desde la API pública de Sipe Sipe Gestión.
La página `/gaceta/` y el bloque lateral del inicio usan la **misma** fuente
(`LiveGaceta.astro`), por lo que no existen documentos de respaldo ni
enlaces `pdfUrl: '#'` en el sitio.

Configurar `PUBLIC_GESTION_API_URL` con la URL pública del backend:

- **GitHub Pages**: *Settings → Secrets and variables → Actions → Variables*
  → `PUBLIC_GESTION_API_URL` (el workflow también acepta un Secret).
- **Cloudflare Pages**: *Settings → Environment variables* → `PUBLIC_GESTION_API_URL`.
- **Local**: `PUBLIC_GESTION_API_URL=http://localhost:8001 npm run dev`.

Si la variable no está definida, la Gaceta muestra un aviso de
"Publicaciones no disponibles en este momento" en lugar de datos ficticios.

El resto del contenido (configuración, alcalde, institucional y contacto) se
consume en **build-time** con respaldo en `src/data/*.ts`; las noticias,
eventos, trámites, turismo, avisos y galería siguen siendo contenido
estático pendiente de migración.

## Secciones

- Inicio (carrusel, accesos rápidos, mensaje de autoridad, eventos, noticias, turismo)
- Institucional, Concejo, Gaceta, Noticias (+ detalle por slug), Eventos, Trámites, Turismo, Contacto

