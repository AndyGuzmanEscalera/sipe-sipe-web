# Portal web GAM Sipe Sipe (Astro)

Sitio institucional público del Gobierno Autónomo Municipal de Sipe Sipe.

## Desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:4321`.

### API de Gestión en local

```powershell
$env:PUBLIC_GESTION_API_URL = "https://api.sipesipe.gob.bo"
# o backend local:
# $env:PUBLIC_GESTION_API_URL = "http://localhost:8001"
npm run dev
```

## Build y despliegue

El **build solo empaqueta la aplicación** (HTML, JS, CSS). El contenido editorial administrable **no** se congela en el build si la sección usa componentes *live* (ver tabla abajo).

```powershell
$env:PUBLIC_GESTION_API_URL = "https://api.sipesipe.gob.bo"
npm run build
npm run preview
```

**Cloudflare Pages:** variable de entorno `PUBLIC_GESTION_API_URL=https://api.sipesipe.gob.bo` en producción.

## Contenido runtime vs estático

| Sección | Mecanismo | ¿Requiere nuevo build tras editar en Gestión? |
|--------|-----------|-----------------------------------------------|
| Alcalde | Cliente: `LiveMayor.astro` → `/api/public/mayor` | **No** |
| Institucional (misión, visión, valores) | Cliente: `LiveInstitutional.astro` | **No** |
| Gabinete / autoridades | Cliente: `LiveAuthorities.astro` | **No** |
| Gaceta | Cliente: `LiveGaceta.astro` | **No** |
| Configuración (título/meta parcial) | Build-time: `BaseLayout` + `/api/public/site-settings` | Sí (solo metadatos) |
| Contacto (datos de contacto) | Build-time parcial + `site.ts` fallback | Sí |
| Noticias, eventos, trámites, turismo, avisos, galería, concejo | `src/data/*.ts` | Sí |

Los componentes *live* usan `fetch(..., { cache: 'no-store' })` y **no** muestran fixtures como datos vigentes si la API falla.

## Seguridad

El sitio público solo consume **`/api/public/*`**. No hay llamadas a `/api/admin/*` ni credenciales en el cliente.

## Estructura

| Ruta | Uso |
|------|-----|
| `src/components/Live*.astro` | Contenido administrable en runtime |
| `src/data/*.ts` | Contenido estático pendiente de backend |
| `src/lib/gestionPublic.ts` | Helper residual (meta/contacto en migración) |
| `src/pages/` | Rutas del sitio |

Documentación ampliada: `AUDITORIA_SITIO_WEB_SIPE_SIPE.md`.
