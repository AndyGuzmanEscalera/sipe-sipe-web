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

## Secciones

- Inicio (carrusel, accesos rápidos, mensaje de autoridad, eventos, noticias, turismo)
- Institucional, Concejo, Gaceta, Noticias (+ detalle por slug), Eventos, Trámites, Turismo, Contacto
