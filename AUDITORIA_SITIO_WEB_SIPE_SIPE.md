# AUDITORÍA TÉCNICA Y FUNCIONAL
## Sitio web público GAM Sipe Sipe (Astro)
### Base para el sistema administrativo "Sipe Sipe Gestión"

**Fecha:** 16/10/2026
**Alcance:** auditoría de lectura. NO se modificó ningún archivo.
**Proyecto auditado:** `C:\dev\website_sipe_sipe`
**Proyecto comparado (referencia):** `C:\dev\correspondencia_sipe_sipe`

---

## 1. Resumen ejecutivo

El sitio público del GAM Sipe Sipe es un **sitio estático Astro 7 + Tailwind CSS 4** sin backend ni base de datos. Todo el contenido —incluidos textos institucionales, alcalde, noticias, eventos, gaceta, trámites, turismo— está **escrito directamente en 12 archivos TypeScript** dentro de `src/data/` y se compila en HTML estático al hacer build.

El contenido es 100% declarativo, no hay endpoints, no hay APIs, no hay Markdown dinámico, no hay JSON de contenido, no hay archivos PDF en el repositorio. Las únicas imágenes son 15 JPG/PNG en `public/images/`.

El deploy es **GitHub Pages** mediante workflow `Deploy to GitHub Pages` (`.github/workflows/deploy-pages.yml`) que detecta `GITHUB_ACTIONS=true` y aplica `base: '/sipe-sipe-web/'` desde `astro.config.mjs:7-13`.

La **única referencia al sitio de Vinto** está en `README.md:3` ("inspirado en portales municipales similares al GAM Viñinto"). No hay código, nombres, categorías ni estructura replicada explícitamente desde Vinto; el parecido es puramente de diseño visual (paleta, distribución editorial).

**Estado del contenido:** todo es **placeholder / demostración**. No existe información real del municipio detrás de los textos (`README.md:3`, `src/data/site.ts:32` "Retrato institucional de demostración", `src/data/institucional.ts:21` "perfil demo", `src/data/notices.ts:12` "demo" en hrefs).

**Hallazgos críticos:**

1. El 100% del contenido institucional y dinámico vive en archivos `.ts` declarativos — no es administrable en absoluto hoy.
2. Existen **6 componentes huérfanos** (`CoverArt`, `ValleyScene`, `Seal`, `HeroCarousel`, `QuickLinks`, `ServiceIndex`) que no se importan en ninguna página ni layout — legado de iteraciones previas de diseño.
3. El esquema de la Gaceta Municipal es **placeholder**: las URLs de PDF son literalmente `'#'` (`src/data/gaceta.ts:9,16,23`).
4. No hay archivos PDF en el proyecto. No existe definición de categorías para la gaceta — debe definirse en el panel administrativo.
5. El sitio público y el sistema de correspondencia **comparten servidor, mismo dispositivo local** pero son independientes: el `website` ni siquiera sabe que existe `correspondencia_sipe_sipe`.

---

## 2. Arquitectura actual

### Stack

| Capa | Tecnología | Archivo |
|---|---|---|
| Framework | Astro 7.3.5 | `package.json:6` |
| Estilos | Tailwind CSS 4.3.3 (plugin Vite) | `package.json:5,7`, `astro.config.mjs:5,14-16` |
| Lenguaje | TypeScript estricto | `tsconfig.json:2` |
| Node | ≥22.12 | `package.json:8` |
| Tipografías | Manrope vía Google Fonts | `BaseLayout.astro:32-34` |
| Deploy | GitHub Pages | `.github/workflows/deploy-pages.yml` |
| Build output | Estático (`dist/`) | workflow línea 41 |
| Base URL | `/sipe-sipe-web/` (GH Pages) | `astro.config.mjs:6-13` |

### Estructura de carpetas

```
website_sipe_sipe/
├── .github/workflows/deploy-pages.yml     # CI a GH Pages
├── astro.config.mjs                        # tailwind + base URL GH Pages
├── package.json                            # 0 deps runtime más allá de Astro+Tailwind
├── tsconfig.json                           # extends astro/tsconfigs/strict
├── public/
│   ├── favicon.ico, favicon.svg
│   └── images/                             # 15 archivos JPG/PNG (~5.3 MB total)
├── src/
│   ├── components/        # 22 componentes .astro (6 huérfanos)
│   ├── data/              # 12 archivos .ts con TODO el contenido
│   ├── layouts/BaseLayout.astro
│   ├── lib/               # format.ts (fechas es-BO) + withBase.ts (prefijo GH Pages)
│   ├── pages/             # 8 secciones + index
│   ├── styles/global.css  # design system completo (colores, utilidades)
│   └── types/content.ts   # tipos compartidos
└── README.md, AGENTS.md, CLAUDE.md
```

**49 archivos** `.astro`/`.ts`/`.css` en `src/`.

### Flujo de información actual

```
src/data/*.ts (TS declarativo)
       ↓
Páginas .astro (importan los data)
       ↓
Componentes .astro (reciben props o importan directo)
       ↓
Astro build → HTML estático → dist/ → GitHub Pages
```

No hay fetch, no hay SSR, no hay APIs, no hay hidratación de cliente excepto el toggle del header (`Header.astro:99-110`).

### Design system (`src/styles/global.css`)

Paleta centralizada como variables Tailwind v4 en `@theme` (líneas 3-19):

- `--color-forest: #087443`, `--color-forest-deep: #06432e` (verde institucional)
- `--color-adobe: #087eaa`, `--color-adobe-deep: #066387` (azul)
- `--color-maize: #77d8f0` (celeste acento)
- `--color-ink: #18392f`, `--color-ink-soft: #52675e`
- `--color-paper`, `--color-paper-deep`, `--color-line`, `--color-dusk`

Utilidades municipales: `.kicker`, `.display-xl/lg/md`, `.btn-primary.solid|outline`, `.surface-card`, `.container-page`, `.flag-stripe` (tricolor Bolivia), `.hero-surface`, `.quick-access`, `.mayor-section`, `.section-heading`, `.notices-board`, `.citizen-band`, `.municipal-footer`, `.municipal-header`.

---

## 3. Mapa completo de páginas

| Ruta | Página | Componentes usados | Origen de datos | Administrable |
|---|---|---|---|---|
| `/` | `src/pages/index.astro` | `HeroEditorial`, `WelcomeMayor`, `NewsFeatured`, `NoticesBoard`, `TransparencyStrip`, `PhotoGallery`, `EventCard`, `TourismCard`, `CitizenBand`, `SectionHeading` | `data/news.ts:getLatestNews`, `data/events.ts:getUpcomingEvents`, `data/tourism.ts`, `data/notices.ts` (heroShortcuts, notices, transparencyLinks), `data/gaceta.ts` (en NoticesBoard), `data/site.ts`, `data/media.ts` (homeGallery) | **Sí — todo** |
| `/institucional/` | `src/pages/institucional/index.astro` | `PageHero` | `data/institucional.ts` (mission, vision, values, executiveAuthorities, organizationalUnits), `data/site.ts:mayor` | **Sí — todo** |
| `/concejo/` | `src/pages/concejo/index.astro` | `PageHero` | `data/concejo.ts` (councilPresident, councilMembers, sessionSchedule) | **Sí — todo** |
| `/gaceta/` | `src/pages/gaceta/index.astro` | `PageHero` | `data/gaceta.ts` | **Sí — todo (CRUD)** |
| `/noticias/` | `src/pages/noticias/index.astro` | `PageHero`, `NewsCard` | `data/news.ts:newsArticles` (ordenadas desc) | **Sí — CRUD** |
| `/noticias/[slug]/` | `src/pages/noticias/[slug].astro` | (rutas dinámicas) | `data/news.ts:newsArticles` + `getNewsBySlug` | **Sí — CRUD** |
| `/eventos/` | `src/pages/eventos/index.astro` | `PageHero`, `EventCard` | `data/events.ts:events` (orden asc) | **Sí — CRUD** |
| `/tramites/` | `src/pages/tramites/index.astro` | `PageHero` | `data/tramites.ts` | **Sí — CRUD** |
| `/turismo/` | `src/pages/turismo/index.astro` | `PageHero`, `TourismCard` | `data/tourism.ts:tourismSpots` | **Sí — CRUD** |
| `/contacto/` | `src/pages/contacto/index.astro` | `PageHero` | `data/site.ts` (address, phone, supportEmail, hours) | **Sí — settings** |

**Total: 10 rutas activas**, todas renderizadas como HTML estático en build.

---

## 4. Inventario de contenido administrable

### 4.1 Identidad institucional — `src/data/site.ts`

| Campo | Archivo:línea | Tipo | Recomendación |
|---|---|---|---|
| `name` | `site.ts:2` | string | Tabla única `site_settings` (key/value) |
| `shortName` | `site.ts:3` | string | `site_settings` |
| `motto` | `site.ts:4` | string | `site_settings` |
| `locationLine` | `site.ts:5` | string | `site_settings` |
| `email` | `site.ts:6` | string | `site_settings` (usado en `Footer`, `CitizenBand`, `TopBar`) |
| `supportEmail` | `site.ts:7` | string | `site_settings` |
| `phone` | `site.ts:8` | string | `site_settings` (usado en `Footer`, `Contact`, `CitizenBand`) |
| `address` | `site.ts:9` | string | `site_settings` (usado en `Footer`, `Contact`, `CitizenBand`) |
| `hours` | `site.ts:10` | string | `site_settings` (usado en `TopBar`, `Footer`, `HeroEditorial`, `CitizenBand`, `Contact`) |
| `copyright` | `site.ts:11` | string | `site_settings` (usado en `Footer`) |
| `edition` | `site.ts:12` | string | `site_settings` (usado en `Footer`) |
| `social.facebook/instagram/youtube` | `site.ts:13-17` | string | `site_settings` (social.facebook, social.instagram, social.youtube) |
| `stats[].value, .label` | `site.ts:18-20` | array{4} | `site_settings` o tabla `home_stats` |
| `mayor.name/title/welcomeTitle/message/photo/photoNote` | `site.ts:24-32` | objeto | Tabla `mayor` (o `site_settings` con key jerárquica) — campo `photo` = archivo subido |
| `topLinks[].label, .href` | `site.ts:33-36` | array | `site_settings` |

**Repeticiones del mismo dato en el sitio:**

- `site.address` se lee en: `Footer.astro:30`, `contacto/index.astro:19`, `CitizenBand.astro:7`
- `site.phone` en: `Footer.astro:34`, `contacto/index.astro:23`, `CitizenBand.astro:9`
- `site.supportEmail` en: `Footer.astro:37`, `contacto/index.astro:27`
- `site.email` en: `CitizenBand.astro:10`
- `site.hours` en: `TopBar.astro:9`, `Footer.astro:32`, `HeroEditorial.astro:95`, `CitizenBand.astro:8`, `contacto/index.astro:31`
- `site.mayor.photo/name/title/message` en: `WelcomeMayor.astro:13,14,19,20,28`, `institucional/index.astro:50,51,56,57,58`

> El dato `site.mayor` está **duplicado funcionalmente** entre `site.ts` (configuración global) y `institucional.ts` (donde vuelve a aparecer en `institucional/index.astro:48-60` releyendo `site.mayor`). Solo hay una definición, pero el módulo "institucional" lo lee como si fuera un dato separado.

### 4.2 Alcalde — usado por `WelcomeMayor` + `institucional/index.astro`

`site.mayor` en `src/data/site.ts:24-32`:

| Campo | Uso actual |
|---|---|
| `name` | `WelcomeMayor.astro:19`, `institucional/index.astro:56` |
| `title` | `WelcomeMayor.astro:20`, `institucional/index.astro:58` |
| `welcomeTitle` | `WelcomeMayor.astro:26` |
| `message` | `WelcomeMayor.astro:28`, `institucional/index.astro:58` |
| `photo` | `WelcomeMayor.astro:13`, `institucional/index.astro:50` (path: `/images/alcaldeblanco.png`) |
| `photoNote` | `WelcomeMayor.astro:30` |

**Inconsistencia detectada:** `site.ts:25` dice que el alcalde se llama **"Fredy Patzi Barrios"** y la foto referenciada es `/images/alcaldeblanco.png`; sin embargo `institucional.ts:18-22` declara como Alcalde Municipal a **"Lic. Roberto Mamani Condori"** con foto `/images/alcaldesa.jpg`. **Hay dos alcaldes distintos declarados en el código** — debe corregirse en la migración.

### 4.3 Misión / Visión / Valores — `src/data/institucional.ts`

| Campo | Línea | Uso |
|---|---|---|
| `mission` | 3-4 | `institucional/index.astro:26` |
| `vision` | 6-7 | `institucional/index.astro:30` |
| `values` (array de 5) | 9-15 | `institucional/index.astro:39` |
| `executiveAuthorities` (4 secretarios) | 17-39 | `institucional/index.astro:67-80` (foto + nombre + cargo + bio) |
| `organizationalUnits` (9 unidades) | 41-50 | `institucional/index.astro:88-94` |

### 4.4 Concejo Municipal — `src/data/concejo.ts`

| Campo | Línea | Uso |
|---|---|---|
| `councilPresident` | 3 | `concejo/index.astro:27` |
| `councilMembers` (6 concejales) | 5-12 | `concejo/index.astro:36-46` |
| `sessionSchedule` | 14-15 | `concejo/index.astro:29` |

### 4.5 Navegación — `src/data/navigation.ts`

| Campo | Línea | Uso |
|---|---|---|
| `mainNav` | 3-13 | `Header.astro:28,75` (desktop y mobile), `Footer.astro:46` |
| `homeQuickLinks` | 16-46 | **No usado actualmente** (componente `QuickLinks.astro` huérfano, `data/navigation.ts:16-46` exporta pero nadie lo importa) |

### 4.6 Hero / Carrusel — `src/data/heroes.ts`

3 slides definidos (`heroSlides`), **NO usados**: el componente `HeroCarousel.astro` existe pero no se importa en ninguna página. La página de inicio usa `HeroEditorial.astro` que es un hero estático distinto.

---

## 5. Contenido dinámico (CRUD)

### 5.1 Noticias — `src/data/news.ts`

4 artículos placeholder. Estructura (`src/types/content.ts:17-28`):

```ts
NewsArticle { slug, title, excerpt, body, category, publishedAt, author, coverGradient, coverImage, coverAlt }
```

| Campo | Línea ejemplo | Notas |
|---|---|---|
| `slug` | 5 | usado en `/noticias/[slug]/` |
| `category` | 14 | valores hardcoded: "Salud", "Obras", "Educación", "Economía" |
| `publishedAt` | 15 | formato `YYYY-MM-DD`, ordenable con `localeCompare` |
| `author` | 16 | string libre |
| `coverImage` | 18 | path a `public/images/` |
| `coverGradient` | 17 | CSS gradient (legado, no se usa en la card final) |
| `body` | 9-13 | texto con `\n\n` separado en párrafos en `[slug].astro:40` |

Páginas consumidoras: `index.astro:27` (NewsFeatured, top 4), `noticias/index.astro:7,19,21` (lista), `noticias/[slug].astro:8,14` (detalle), `HeroEditorial.astro` (link al primer aviso).

### 5.2 Avisos y Comunicados — `src/data/notices.ts`

| Grupo | Línea | Notas |
|---|---|---|
| `heroShortcuts` | 3-10 | 6 accesos rápidos (Trámites/Gaceta/Concejo/Noticias/Agenda/Turismo) usados en `HeroEditorial.astro:101-119` — **mezclado con contenido dinámico**, debería ser config |
| `notices` | 12-37 | 4 comunicados placeholder con `date`, `tag`, `title`, `href`; ordenados desc por `HeroEditorial.astro:7` (toma `notices[0]` como último aviso destacado). Usados en `NoticesBoard.astro:23-43`. |
| `transparencyLinks` | 39-44 | 4 enlaces a "Rendición de cuentas", "POA", "Contrataciones", "Tributos" — **mezclado con contenido dinámico**, debería ser config. Usado en `TransparencyStrip.astro:19-40`. |

### 5.3 Eventos — `src/data/events.ts`

4 eventos placeholder. Estructura (`src/types/content.ts:30-38`): `MunicipalEvent { id, title, description, location, startsAt, endsAt?, image }`.

Páginas: `index.astro:42` (EventCard, top 4), `eventos/index.astro:7,19` (lista), referenciados además en `HeroEditorial.astro:7` (via notices) y `NoticesBoard.astro`.

**No hay CRUD de eventos; no hay ordenamiento; no hay paginación; no hay "eventos pasados".**

### 5.4 Gaceta Municipal — `src/data/gaceta.ts`

3 entradas placeholder. Estructura (`src/types/content.ts:58-64`): `GacetaEntry { id, number, title, publishedAt, pdfUrl }`.

```ts
gacetaEntries = [
  { id: 'g-2026-012', number: 'Gaceta N° 012/2026', title: 'Ordenanza de presupuesto municipal gestión 2026 (texto demo)', publishedAt: '2026-02-10', pdfUrl: '#' },
  { id: 'g-2026-011', number: 'Gaceta N° 011/2026', title: 'Reglamento de ferias dominicales y uso de espacio público', publishedAt: '2026-01-28', pdfUrl: '#' },
  { id: 'g-2026-010', number: 'Gaceta N° 010/2026', title: 'Convocatoria pública de consultoría — estudio de movilidad', publishedAt: '2026-01-15', pdfUrl: '#' },
]
```

Páginas consumidoras: `gaceta/index.astro:18-34` (lista + botón "Descargar" → `pdfUrl`), `NoticesBoard.astro:57-68` (3 últimos en aside lateral de inicio).

**No hay archivos PDF en el repositorio** — `pdfUrl: '#'` no lleva a ningún documento real. La "categoría" o "tipo" del documento se infiere del `title` (ordenanza / reglamento / convocatoria) pero **no está modelada como campo**.

### 5.5 Trámites — `src/data/tramites.ts`

4 trámites placeholder. Estructura (`src/types/content.ts:49-56`): `Tramite { id, name, unit, durationDays, requirements[], costBs: number | null }`.

Página consumidora única: `tramites/index.astro:16-42`.

**No hay CRUD; no hay categorías; no hay adjuntos descargables.**

### 5.6 Turismo — `src/data/tourism.ts`

4 sitios placeholder. Estructura (`src/types/content.ts:40-47`): `TourismSpot { id, name, summary, distanceKm, coverGradient, image }`.

Páginas: `index.astro:56` (4 cards en grid), `turismo/index.astro:16` (lista).

**No hay CRUD; no hay galería individual por sitio; no hay ruta `/turismo/[id]/`.**

---

## 6. Gaceta Municipal — análisis específico

### 6.1 Lo que existe hoy

- **Datos:** 3 entradas placeholder en `src/data/gaceta.ts`
- **UI pública:** página `/gaceta` (`src/pages/gaceta/index.astro`) con `PageHero` + lista de entradas (número, título, fecha, botón "Descargar")
- **UI destacada:** bloque lateral en inicio `NoticesBoard.astro:46-79` (aside verde con últimas 3 entradas + CTA "Ver toda la gaceta")
- **Tipo de dato:** `GacetaEntry { id, number, title, publishedAt, pdfUrl }`
- **PDFs:** ninguno. Las URLs son literalmente `'#'`

### 6.2 Categorías detectadas

No existe un campo `category` en el modelo actual. Por el `title` de las 3 entradas placeholder se infieren tres tipos:
- **Ordenanza** (presupuesto)
- **Reglamento** (ferias)
- **Convocatoria** (consultoría)

Esto debe confirmarse con el usuario (marcado `REQUIERE CONFIRMACIÓN`). El sitio de Vinto no define categorías explícitas en el código de este proyecto — solo se menciona como referencia de diseño en `README.md:3`.

### 6.3 Funcionalidad que el panel debe soportar

Basado en la idea funcional proporcionada por el usuario:

| Capacidad | Implementación actual | Necesario |
|---|---|---|
| Crear publicación | ❌ no existe | ✅ |
| Título / nombre | ✅ `title` | ✅ (mantener) |
| Tipo o categoría | ❌ — no modelado | ✅ agregar campo |
| Número de documento | ✅ `number` | ✅ (mantener) |
| Fecha | ✅ `publishedAt` | ✅ (mantener) |
| Descripción opcional | ❌ — no modelado | ✅ agregar campo |
| Subir archivo PDF | ❌ `pdfUrl: '#'` | ✅ upload + storage |
| Publicar / despublicar | ❌ — no modelado | ✅ agregar `is_published` |
| Editar | ❌ | ✅ |
| Eliminar | ❌ | ✅ (lógico) |
| Reemplazar PDF | ❌ | ✅ |

**Páginas de referencia a inspección externa:**
- `https://www.gamvinto.gob.bo/` — único enlace a Vinto del workspace (`README.md:3`). No hay URLs adicionales, archivos de spec ni documentación copiada.

---

## 7. Archivos multimedia

### 7.1 Inventario actual

Solo imágenes. **No hay PDFs, no hay videos, no hay documentos.**

`public/images/` — 15 archivos, total **~5.3 MB**:

| Archivo | Tamaño | Uso actual |
|---|---|---|
| `escudo-sipe-sipe.jpg` | 35 KB | `Header.astro:17`, `Footer.astro:15` |
| `bandera-sipe-sipe.jpg` | 17 KB | (no usado en componentes — huérfano) |
| `simbolos-sipe-sipe.jpg` | 49 KB | (no usado — huérfano) |
| `sipe-sipe-amanecer.jpg` | 236 KB | `HeroEditorial.astro:13`, `eventos/index.astro:15`, `contacto/index.astro:12` |
| `iglesia-san-pedro.jpg` | 268 KB | `news.ts:50` (cover noticia), `eventos/index.astro:12` (PageHero), `concejo/index.astro:19` |
| `iglesia-san-pedro-fachada.jpg` | 278 KB | `news.ts:18` (cover noticia), `institucional/index.astro:20` (PageHero) |
| `iglesia-san-pedro-plaza.jpg` | 174 KB | `news.ts:18`, `CitizenBand.astro:17` |
| `inka-raqay.jpg` | 597 KB | `tourism.ts:18`, `eventos/index.astro:15` no (usado en `turismo/index.astro:13` PageHero), `HeroEditorial.astro:64` |
| `inka-raqay-amanecer.jpg` | 172 KB | `tourism.ts:34` |
| `inka-raqay-camino.jpg` | 574 KB | `news.ts:65` (cover noticia) |
| `inka-raqay-muros.jpg` | 825 KB | `gaceta/index.astro:13` (PageHero) |
| `puente-viloma.jpg` | 614 KB | `tourism.ts:26`, `news.ts:35` (cover noticia), `tramites/index.astro:12` (PageHero), `eventos/index.astro:23` |
| `alcaldeblanco.png` | 1.22 MB | `site.ts:30` — foto alcalde declarada (`WelcomeMayor.astro:13`, `institucional/index.astro:50`) |
| `alcaldesa.jpg` | 272 KB | `institucional.ts:22` — **foto declarada para Alcalde "Lic. Roberto Mamani Condori"** (inconsistencia con `site.ts:25` "Fredy Patzi Barrios") |
| `ALCALDE.jpeg` | 98 KB | (no usado — huérfano) |

**Tipos:** 13 JPG + 2 PNG. Sin WebP, sin AVIF, sin SVG de assets.

### 7.2 Cómo se referencian los archivos

- Paths en `public/images/` → URL directa `/images/<archivo>`
- Referenciados desde `src/data/*.ts` (coverImage, photo) y desde componentes (`src/components/HeroEditorial.astro:13`, etc.)
- Paso por helper `withBase()` (`src/lib/withBase.ts:4-16`) para compatibilidad GH Pages subruta

**No hay compresión declarada, no hay srcset, no hay responsive.** Una sola versión por imagen.

### 7.3 Estrategia recomendada (no implementar aún)

Para el panel administrativo "Sipe Sipe Gestión", dado que:

- El sistema se desplegará en infraestructura propia del municipio
- Inicialmente será un único contenedor Docker
- Se necesitan PDFs (gaceta), fotos (noticias, alcalde, galería), posiblemente videos a futuro

**Recomendación:** **filesystem persistente dentro del contenedor backend**, con abstracción `StorageService` (Protocol/interface) que permita migrar después a MinIO o S3 sin reescribir la lógica de negocio.

Motivaciones:

1. Reutilizar exactamente el patrón ya validado en `correspondencia_sipe_sipe/backend/app/core/storage/` (`storage_service.py`, `local_filesystem_storage.py`) — protocol + implementación local + `validate_storage_key` con anti-path-traversal.
2. Los volúmenes Docker persistentes son suficientes para un municipio (no se requiere CDN inicialmente).
3. Migrar a MinIO/S3 después es solo escribir una segunda implementación del mismo Protocol — los call sites no cambian.
4. PDFs de gaceta pueden ser de 1-25 MB cada uno; una colección de 500 PDFs = ~5 GB, perfectamente manejable en disco.

Convención de claves sugerida (alineada con el proyecto de correspondencia):
```
gaceta/<year>/<id>/<filename>.pdf
media/<year>/<id>/<filename>.<ext>     # imágenes de noticias, alcalde, galería
```

---

## 8. Integraciones y APIs actuales

**No existen integraciones externas.** Búsqueda exhaustiva (`api|fetch|API|endpoint`):

- `README.md:33-35` menciona que se sustituirán imports por `fetch` "más adelante"
- `package-lock.json` tiene `node-fetch-native` y `ofetch` como dependencias transitivas de Astro (no se usan directamente)
- `BaseLayout.astro:29-34` carga Google Fonts (única dependencia externa real)
- `HeroEditorial.astro:16` usa `fetchpriority="high"` (atributo HTML nativo, no es API)
- `astro.config.mjs:8` lee `GITHUB_ACTIONS` env var

**No hay CMS, no hay analytics, no hay cookies de terceros, no hay service workers, no hay RSS, no hay sitemap.**

---

## 9. Auditoría del proyecto de Correspondencia

> **Solo lectura — no se modificó nada.**

El proyecto `correspondencia_sipe_sipe` es un sistema completo de gestión documental municipal en **Flutter Web + FastAPI + PostgreSQL 16 + Docker**, con RBAC, sesiones, adjuntos, generación de PDF, reportes, notificaciones. Su arquitectura y patrones están madurados y probados (ver `PROJECT_CONTEXT.md` para detalle del cierre QA).

### 9.1 Estructura del backend (`backend/app/`)

```
app/
├── main.py                       # FastAPI app + routers + middleware
├── core/
│   ├── config.py                 # Pydantic Settings (env, JWT, DB, CORS, storage)
│   ├── database.py               # SQLAlchemy engine + SessionLocal + get_db
│   ├── security.py               # JWT (PyJWT), argon2 password hashing, cookies
│   ├── cors.py                   # CORS por entorno (dev loopback, prod Apache /api)
│   ├── error_middleware.py       # SafeErrorMiddleware — respuestas seguras en 500
│   ├── storage/                  # Protocol + LocalFilesystemStorage
│   └── branding.py               # logo institucional para PDF
├── common/
│   ├── schemas.py                # PaginatedResponse genérico, ActiveToggleRequest
│   ├── normalize.py, audit.py, db_commit.py, master_data_deletion.py
└── modules/
    ├── auth/                     # login, refresh, logout, me, dependencies (require_permission)
    ├── identity/                 # User, Role, Permission, RBAC service
    ├── organization/             # OrganizationalUnit, Position, Employee + admin_router
    ├── correspondence/           # núcleo (CRUD, derivación, attachments, PDF, insights)
    ├── system/                   # system_settings (institutional config)
    └── notifications/            # notificaciones internas
```

### 9.2 Estructura de Flutter (`lib/`)

```
lib/
├── bootstrap.dart                       # init Flutter, GetIt, runApp
├── main.dart
├── core/
│   ├── router.dart, routes.dart         # go_router
│   ├── auth/                            # permission_guard, permissions constants
│   ├── theme/                           # UiColors, AppDecorations
│   ├── helpers/                         # full_widget_generics, listener_generic
│   ├── util/form/                       # controllers, validators, models
│   └── platform/, presentation/, data/
├── features/
│   ├── authentication/sign_in           # login
│   ├── administration/                  # admin completo (basic_data + configuration)
│   │   ├── basic_data/{units, positions, employees, users, document_types}
│   │   ├── common/                      # admin_active_filter, admin_upsert_bloc_listener
│   │   └── configuration/               # system settings (institutional)
│   ├── correspondence/, dashboard/, home/, inbox/, reports/, splash/, etc.
├── shared/widgets/                      # AppFormDialog, AppDataGrid, AppTextField, etc.
└── injection/                           # GetIt (DI)
```

### 9.3 Patrones clave identificados

| Patrón | Ubicación | Comentario |
|---|---|---|
| **Auth JWT access + refresh cookie HttpOnly** | `auth/router.py:49-126`, `core/security.py` | Rotación atómica con `SELECT ... FOR UPDATE` (`auth/service.py:89-134`) |
| **Permisos por código (`master_data.X.read/manage`)** | `auth/dependencies.py:62-95`, `core/auth/permissions.dart` | Verificación por SQL join, nunca por nombre de rol |
| **CRUD con `is_active` (baja lógica)** | `organization/*.py`, `administration/basic_data/*` | Listado con toggle activos/inactivos/todos |
| **Paginación genérica** | `common/schemas.py:9-31` | `PaginatedResponse[T]` |
| **DataGrid reutilizable** (desktop tabla + mobile lista) | `shared/widgets/data_grid/app_data_grid.dart` | Soporta ordenamiento, paginación, row actions, responsive |
| **`AppFormDialog` reutilizable** | `shared/widgets/app_form_dialog.dart` | Header sticky + footer fijo + scrollbar + responsive |
| **Cubit por feature** | `features/*/list_*/cubit/*`, `features/*/upsert_*/cubit/*` | Separación list/upsert, AdminUpsertBlocListener |
| **Listeners con feedback consistente** | `core/helpers/listener/listener_generic.dart`, `features/administration/common/admin_upsert_bloc_listener.dart` | `GeneralStatus.success` + reload de lista tras upsert |
| **`Form` con `ControllerFieldPro` y validators** | `core/util/form/`, `shared/widgets/form/app_text_field.dart` | `RequiredValid`, etc.; `FormSaveError` centralizado |
| **Storage con Protocol** | `core/storage/storage_service.py`, `local_filesystem_storage.py` | Anti path-traversal en `validate_storage_key` |
| **Attachments: SHA-256, sanitización filename, límite de tamaño** | `correspondence/attachment_service.py:1-225` | Patrón completo de upload/list/download/deactivate |
| **Docker Compose multi-contenedor** | `docker-compose.yml` | postgres + backend + volumenes separados, healthcheck |
| **Alembic con cadena limpia, una sola head** | `backend/alembic/versions/` | `g2b3c4d5e6f7` (no se debe resetear) |
| **Esquema SQL versionado por archivos** | `database/schema/001_extensions.sql` … `007_indexes.sql` | Catálogos, auth, employees, correspondence, audit, indexes |
| **`SetPathUrlStrategy()` para SPA** | `bootstrap.dart:18` | URLs limpias |
| **`dio` con ApiMethod por endpoint** | `packages/correspondencia_api/lib/` | Separación API ↔ repository ↔ UI |
| **`Result<T>` y `Failure` tipados** | `packages/failures/lib/`, `correspondencia_repository/lib/` | Manejo de errores sin excepciones crudas |
| **Error middleware que devuelve mensajes seguros** | `core/error_middleware.py` | Sin filtrar detalles internos en producción |
| **Build web con `dart-define=API_BASE_URL=/api`** | `scripts/build_web_demo.ps1`, `packages/correspondencia_api/test/api_config_test.dart` | Apache ProxyPass en deploy |
| **Apache config preparado (no ejecutado)** | `deploy/apache/correspondencia.conf`, `deploy/apache/README.md` | ProxyPass /api/, ProxyPassReverseCookiePath para cookie HttpOnly |

### 9.4 Seguridad y validaciones

- Validación de longitud mínima de JWT_ACCESS_SECRET al startup (`core/config.py:139-152`)
- Validación `APP_ENV ∈ {development, qa, production}` y forzado `cookie_secure=true` en prod (`config.py:85-98`)
- CORS restrictivo por entorno (dev loopback only vía regex, prod sin CORS gracias a Apache same-origin)
- Password hashing con **argon2** (`argon2-cffi==23.1.0`, `core/security.py`)
- Cookies HttpOnly + SameSite configurable
- Rate limiting / brute force: **REQUIERE CONFIRMACIÓN** (no se observó middleware explícito)

---

## 10. Elementos reutilizables de Correspondencia

### 10.1 REUTILIZABLE (código fuente a copiar / adaptar)

| Elemento | Origen | Razón |
|---|---|---|
| `backend/app/core/config.py` (Settings con Pydantic) | `correspondencia_sipe_sipe/backend/app/core/config.py` | Mismas necesidades: JWT, DB, storage, cookie, CORS |
| `backend/app/core/security.py` (JWT, password hashing, cookies) | `core/security.py` | `create_access_token`, `decode_access_token`, `hash_password` con argon2, refresh cookies — copy-paste directo |
| `backend/app/core/storage/storage_service.py` (Protocol) + `local_filesystem_storage.py` | `core/storage/` | Ya validado, anti path-traversal |
| `backend/app/core/error_middleware.py` | `core/error_middleware.py` | Patrón seguro de errores 500 |
| `backend/app/core/cors.py` | `core/cors.py` | Loopback en dev, sin CORS en prod (Apache mismo origen) |
| `backend/app/common/schemas.py` (PaginatedResponse, ActiveToggleRequest) | `common/schemas.py` | Genérico, aplica idéntico |
| `backend/app/common/db_commit.py`, `audit.py`, `normalize.py`, `master_data_deletion.py` | `common/` | Utilidades transversales |
| `backend/app/modules/auth/{router,service,dependencies,schemas,models}.py` | `modules/auth/` | Copia casi directa; ajustar tabla `users` a `cms_users` |
| Backend estructura `modules/<dominio>/{router.py,admin_router.py,schemas.py,service.py,<entidad>.py}` | `modules/organization/`, `modules/correspondence/` | Patrón consistente — replicar para `cms/news`, `cms/gaceta`, etc. |
| `backend/alembic/env.py` + estructura de migraciones | `backend/alembic/` | Misma plantilla, nueva cadena |
| `database/schema/00X_*.sql` | `database/schema/` | Estilo de organización (catalogs, auth, content, audit, indexes) |
| `docker-compose.yml` (estructura) | `docker-compose.yml` | Multi-contenedor con healthcheck, volúmenes separados |
| `Dockerfile` | `backend/Dockerfile` | uvicorn + poetry/pip alt |
| `pubspec.yaml` (dependencias Flutter) | `pubspec.yaml` | flutter_bloc, dio, go_router, get_it, intl, responsive_framework, data_table_2, file_picker — todas útiles para el panel CMS |
| `lib/bootstrap.dart` | `bootstrap.dart` | Patrón init Flutter + GetIt |
| `lib/injection/` (GetIt setup) | `injection/` | Mismo patrón: repositories, blocs, api clients |
| `lib/core/router.dart`, `routes.dart` (go_router con guards) | `core/router.dart`, `routes.dart` | Reutilizar estructura de rutas con PermissionGuard |
| `lib/core/auth/permissions.dart`, `permission_guard.dart` | `core/auth/` | Mismas ideas (permiso = string, guard verifica `session.permissions.contains(code)`) |
| `lib/core/theme/` (UiColors, AppDecorations) | `core/theme/` | Paleta institucional ya alineada con verde GAM (`#08813A` documentado en `PROJECT_CONTEXT.md:257`) |
| `lib/core/helpers/full_widget_generics.dart`, `listener_generic.dart` | `core/helpers/` | Patrón de loading/empty/error unificado |
| `lib/core/util/form/` (controllers, validators) | `core/util/form/` | `ControllerFieldPro`, `RequiredValid`, etc. — reutilizar |
| `lib/shared/widgets/app_form_dialog.dart` | `shared/widgets/app_form_dialog.dart` | Diálogo CRUD completo con header/footer/scrollbar/responsive |
| `lib/shared/widgets/data_grid/*` | `shared/widgets/data_grid/` | Tabla desktop + cards mobile con sort/pagination/row actions |
| `lib/shared/widgets/form/*` | `shared/widgets/form/` | `AppTextField`, `AppDropdown`, `AppSearchableDropdown`, `AppTextPassword` |
| `lib/shared/widgets/page_container.dart`, `section_header.dart`, `empty_state.dart`, `app_surface.dart`, `status_badge.dart` | `shared/widgets/` | Layout base del panel |
| `lib/features/authentication/sign_in/` (login) | `features/authentication/sign_in/` | Adaptar a `/auth/login` |
| `lib/features/administration/basic_data/units/` (list + upsert) | `features/administration/basic_data/units/` | **Plantilla CRUD completa** — replicar patrón para noticias, gaceta, autoridades |
| `lib/features/administration/common/` (admin_active_filter, admin_upsert_bloc_listener, admin_logical_delete_dialog) | `features/administration/common/` | Filtros activos/inactivos, soft delete, upsert listener — reutilizar |
| `lib/features/administration/configuration/` | `features/administration/configuration/` | Pantalla de configuración institucional (system settings) |
| `packages/failures/` | `packages/failures/` | `Result<T>`, `Failure`, excepciones tipadas |
| `packages/correspondencia_api/` | `packages/correspondencia_api/` | Dio + ApiMethod + endpoints |
| `packages/correspondencia_repository/` | `packages/correspondencia_repository/` | Entidades, repos, mappers |

### 10.2 ADAPTABLE (referencia conceptual, no copy-paste)

| Elemento | Origen | Adaptación |
|---|---|---|
| Patrón RBAC `master_data.<recurso>.read/manage` | `core/auth/permissions.dart` | Renombrar a `cms.<recurso>.read/manage` o `cms.news.publish` (separar `publish` de `manage`) |
| Sistema de roles ADMIN/EDITOR | `core/auth/permissions.dart` + `modules/identity/` | Crear roles nuevos: `cms.admin`, `cms.editor` con grants específicos |
| Generación de PDF (ReportLab) | `correspondence/pdf/` | Si en el futuro el CMS necesita generar PDFs desde plantillas, el patrón base sirve; no necesario para gaceta (subida directa) |
| `correspondence_attachment_service.py` (upload con SHA-256, sanitización, MIME allowlist) | `correspondence/attachment_service.py` | Replicar 1:1 para `cms_media` (fotos, PDFs de gaceta) |
| `institutional_mayor` resolution | `correspondence/institutional_mayor.py` | **NO** reutilizar — el GAM tiene su propia lógica de alcalde editorial, no debe mezclarse con la autoridad documental de correspondencia |
| `notifications/` | `modules/notifications/` | Reutilizar si el CMS necesita notificaciones (alertas de publicación, etc.) |
| Apache `ProxyPass /api/` + `ProxyPassReverseCookiePath` | `deploy/apache/correspondencia.conf` | Replicar para nuevo vhost `/cms-api/` o `/gestion-api/` |

### 10.3 NO REUTILIZAR

| Elemento | Razón |
|---|---|
| Tablas de `correspondencia` (correspondence, movement, route_sequence, document_sequence) | Dominio totalmente distinto |
| Lógica de derivación / ciclo de vida de documentos | No aplica |
| Snapshots / encadenamiento PDF | No aplica |
| `institutional_mayor` | Llega configuración de alcalde editorial desde cero |
| `workers`, `work_shifts` (Turnos, RR.HH.) | El CMS no necesita ese dominio (todavía — futuro sí, ver §11) |
| `system_settings` actuales del GAM (`intake_unit_id`, `initial_recipient_employee_ids`, `mayor_display_name`) | Son específicos del sistema de Correspondencia — `cms_site_settings` será nuevo |
| Identidad visual Mark neutro / logo temporal | El CMS debe usar la identidad oficial GAM (escudo real) ya consolidada en `correspondencia` (15/10/2026) |
| `User → Employee → Unit` linkage | El CMS no requiere ese modelo institucional por ahora (sus usuarios pueden no ser funcionarios) |

### 10.4 Base de datos

**El CMS debe tener SU PROPIA base de datos** (decisión confirmada por el usuario). Razones técnicas:

1. Dominio totalmente distinto (contenido web vs. documento institucional)
2. Evitar acoplamiento de migraciones
3. Respaldo y ciclo de vida separado
4. Permite que `correspondencia` siga su propio roadmap sin afectar al sitio público

**No compartir tablas, no compartir esquemas SQL.** Pueden compartir **contenedor Postgres** (mismo `docker-compose` o cluster) pero **bases distintas** (`gestion_sipe` vs `correspondencia_sipe`).

---

## 11. Propuesta inicial de módulos de Sipe Sipe Gestión

> Estos módulos surgen **exclusivamente** del contenido encontrado en el sitio público auditado. NO se añaden módulos especulativos.

### Módulo 1 — Identidad institucional
Configuración global del sitio (settings key/value).
- Nombre oficial, nombre corto, lema
- Datos de contacto: dirección, teléfono(s), correo(s), horario
- Ubicación, edición, copyright
- Redes sociales (Facebook, Instagram, YouTube, otros)
- Estadísticas del municipio (4 valores actuales: habitantes, altitud, comunidades, territorio)

### Módulo 2 — Alcalde / Máxima Autoridad
- Datos del Alcalde: nombre, título, mensaje, foto, descripción de foto
- Un único registro activo (histórico: baja lógica, no borrado)

### Módulo 3 — Misión, Visión, Valores
- Misión (texto)
- Visión (texto)
- Valores (lista ordenada)

### Módulo 4 — Autoridades / Gabinete
- Lista de secretarios / autoridades ejecutivas
- Campos: nombre, rol/cargo, bio, foto (opcional), orden, activo
- (Distinto del módulo 2 — son el "gabinete", no el alcalde)

### Módulo 5 — Concejo Municipal
- Presidente del Concejo (un registro)
- Concejales: nombre, bancada/bloque, comisión, orden, activo

### Módulo 6 — Noticias / Comunicados
- CRUD completo: crear, editar, eliminar (lógico), publicar/despublicar
- Campos: título, slug (auto desde título, editable), excerpt, body (textarea/markdown ligero), categoría, fecha publicación, autor, imagen de portada, alt de imagen
- Imagen requerida, recomendación ~500KB máx.

### Módulo 7 — Eventos
- CRUD: id, título, descripción, ubicación, fecha/hora inicio, fecha/hora fin (opcional), imagen
- Listado público: solo futuros (filtrar en backend)
- Imagen opcional

### Módulo 8 — Trámites
- CRUD: nombre, unidad responsable, plazo en días, requisitos (lista), costo en Bs (admite null = "A consulta")
- Sin adjuntos por ahora (REQUIERE CONFIRMACIÓN si se necesitan descargables)

### Módulo 9 — Gaceta Municipal
- CRUD: número, título, tipo/categoría, fecha publicación, descripción opcional, archivo PDF, publicado (boolean)
- **Tipo/categoría debe definirse** (REQUIERE CONFIRMACIÓN con usuario — opciones probables: Ordenanza, Reglamento, Resolución, Convocatoria, Decreto, Comunicado)
- Reemplazo de PDF: campo file opcional que al subir reemplaza el anterior
- Baja lógica

### Módulo 10 — Avisos y Comunicados (banco destacado del inicio)
- CRUD: fecha, etiqueta/tag (Convocatoria / Comunicado / Aviso / Participación), título, href destino (link interno o externo)
- Ordenamiento

### Módulo 11 — Sitios turísticos
- CRUD: nombre, resumen, distancia desde el centro (km), imagen
- Sin galería individual (REQUIERE CONFIRMACIÓN)

### Módulo 12 — Galería institucional
- CRUD: imagen (path), título, descripción opcional, orden, destacado (boolean para resaltar en inicio)
- Reemplazo de imagen

### Módulo 13 — Navegación (config)
- Menú principal: lista de items (label + href), permitir agregar/quitar/ordenar (mantener al menos Inicio + secciones existentes)
- Sub-accesos del inicio (`homeQuickLinks`): actualmente exportados en `navigation.ts:16-46` pero NO usados — decidir si se activan en `QuickLinks.astro` huérfano o se eliminan

### Módulo 14 — Hero / Accesos rápidos del inicio
- `heroShortcuts` (6 items actuales en `notices.ts:3-10`): configurable
- `transparencyLinks` (4 items en `notices.ts:39-44`): configurable

### Módulo 15 — Unidades organizacionales (estructura)
- Lista `organizationalUnits` (9 actuales en `institucional.ts:41-50`): ordenable, publicable

### Módulo 16 — Administración (sub-módulo propio)
- Usuarios del panel (NO reutilizar `correspondencia.users`)
- Roles: ADMIN, EDITOR
- Permisos: `cms.<recurso>.read`, `cms.<recurso>.manage`, `cms.settings.manage`, `cms.users.manage`, `cms.roles.assign`

### Módulos futuros (NO en este alcance, pero arquitectura debe permitirlo)

Mencionados por el usuario como visión a futuro:
- Información de funcionarios
- Asistencia, entradas/salidas
- Permisos, vacaciones
- Recursos humanos
- Documentación administrativa interna
- Otros servicios internos

> Estos NO entran en este CMS inicial. La arquitectura modular debe permitir **agregar módulos** sin reescribir el panel. Patrón: cada módulo = feature folder Flutter con su `list_*` + `upsert_*` + permisos propios, registrado en el router y en el menú solo si el usuario tiene `cms.<módulo>.read`.

---

## 12. Entidades preliminares

NO se diseñan tablas todavía. Estas son las **entidades de dominio** que el panel necesitará (muchas derivarán en tablas; algunas serán filas de `cms_settings`).

### Entidades "transversales" / configuración

- **`CmsSiteSettings`** — key/value jerárquico. Cubre: nombre, lema, contacto (address, phone, emails, hours), copyright, edition, social.*, stats[]
- **`CmsMayor`** — registro único (con histórico por `valid_from`/`valid_to` opcional). Campos: name, title, welcomeTitle, message, photo (FK a CmsMedia), photoNote, is_active
- **`CmsInstitution`** — mission, vision (probablemente parte de SiteSettings; evaluar después)
- **`CmsValue`** — para `values` (lista ordenada)

### Entidades "catálogo" (configurables)

- **`CmsAuthority`** — authorities (gabinete): name, role, bio, photo (FK a CmsMedia), sort_order, is_active
- **`CmsOrganizationalUnit`** — unidades: name, sort_order, is_active
- **`CmsCouncilMember`** — concejales: name, block (bancada), commission, sort_order, is_active
- **`CmsCouncilPresident`** — registro único: name, session_schedule (string)

### Entidades "dinámicas" (CRUD con publicación)

- **`CmsNews`** — title, slug, excerpt, body, category, published_at, author, cover_media_id (FK), is_published, published_at_real (timestamp de cuándo se publicó), created_by_user, created_at, updated_at
- **`CmsEvent`** — title, description, location, starts_at, ends_at (nullable), image_media_id (FK), is_published
- **`CmsNotice`** — date, tag, title, href, is_published
- **`CmsTransparencyLink`** — label, description, icon_name, sort_order, is_active (mezcla contenido + config; podría ser estático en panel)
- **`CmsHeroShortcut`** — label, href, icon_name, sort_order (idem)
- **`CmsTourismSpot`** — name, summary, distance_km, image_media_id (FK), sort_order, is_published
- **`CmsTramite`** — name, unit, duration_days, requirements (lista — almacenar como JSONB o tabla relacionada), cost_bs (nullable), sort_order, is_active
- **`CmsGalleryItem`** — media_id (FK), title, caption, sort_order, is_featured (boolean para el slot destacado de inicio)
- **`CmsNavigationItem`** — label, href, sort_order, is_active, location ('main'|'footer'|'quick_access')

### Entidad Gaceta (especial)

- **`CmsGacetaDocument`** — number, title, type/category (FK a CmsGacetaCategory o enum), published_at, description (nullable), pdf_media_id (FK a CmsMedia), is_published, created_at, updated_at
- **`CmsGacetaCategory`** — code, name, sort_order (REQUIERE CONFIRMACIÓN con usuario sobre valores; opciones probables: 'ordenanza','reglamento','resolucion','convocatoria','decreto','comunicado')

### Entidad de medios

- **`CmsMedia`** — id, original_filename, mime_type, size_bytes, sha256, storage_path, kind ('image'|'pdf'|'other'), uploaded_by_user_id, created_at, is_active
- Tabla única para fotos y PDFs, discriminados por `kind`

### Entidad de administración del panel

- **`CmsUser`** — username, email, password_hash (argon2), is_active, last_login_at, created_at
- **`CmsRole`** — code ('cms.admin'|'cms.editor' o similar), name, is_active
- **`CmsPermission`** — code ('cms.news.read', 'cms.gaceta.manage', …), description
- **`CmsUserRole`** — user_id, role_id (N:N)
- **`CmsRolePermission`** — role_id, permission_id (N:N)

### Observaciones

- `mayor_photo`, `authority.photo`, `news.coverImage`, `event.image`, `tourism.image`, `gallery.item`, `gaceta.pdf` → todos son referencias a `CmsMedia.id`
- `tramite.requirements` puede modelarse como JSONB en una primera versión para evitar tabla relacionada
- `CmsSiteSettings` key/value es flexible pero dificulta queries agregadas; alternativa: tabla `SiteSettings(key, value, kind)` con índices por `kind`

---

## 13. Endpoints preliminares (no implementar)

> Convención: `cms.website` para el panel y `cms.public` para lo que consume Astro.

### `/api/public/` — consumido por el sitio Astro público (sin auth)

| Método | Endpoint | Devuelve |
|---|---|---|
| GET | `/api/public/site-settings` | `SiteSettingsPublic` con datos globales |
| GET | `/api/public/mayor` | `MayorPublic` (si hay activo) |
| GET | `/api/public/institutional` | `{ mission, vision, values[] }` |
| GET | `/api/public/authorities` | `AuthorityPublic[]` |
| GET | `/api/public/council` | `{ president, members[], schedule }` |
| GET | `/api/public/organizational-units` | `OrganizationalUnitPublic[]` |
| GET | `/api/public/navigation` | `{ main: NavItem[], quick: NavItem[] }` |
| GET | `/api/public/hero-shortcuts` | `HeroShortcut[]` (6 items) |
| GET | `/api/public/transparency-links` | `TransparencyLink[]` (4 items) |
| GET | `/api/public/notices?limit=N` | `NoticePublic[]` (orden desc por date) |
| GET | `/api/public/news?limit=N&offset=M` | `NewsListPublic[]` (paginado) |
| GET | `/api/public/news/{slug}` | `NewsDetailPublic` (404 si no existe o !is_published) |
| GET | `/api/public/events?limit=N` | `EventPublic[]` (filtrar starts_at >= now en backend) |
| GET | `/api/public/events/{id}` | `EventDetailPublic` |
| GET | `/api/public/tramites` | `TramitePublic[]` |
| GET | `/api/public/tourism` | `TourismSpotPublic[]` |
| GET | `/api/public/gallery?featured=true&limit=N` | `GalleryItemPublic[]` |
| GET | `/api/public/gaceta?limit=N&offset=M&type=...` | `GacetaListPublic[]` |
| GET | `/api/public/gaceta/{id}` | `GacetaDetailPublic` |
| GET | `/api/public/gaceta/{id}/pdf` | Stream binario (Content-Type: application/pdf) |
| GET | `/api/public/media/{id}` | Stream binario (Content-Type según `CmsMedia.mime_type`) |

> Para evitar problemas de caché en Astro, cada respuesta debe llevar `Cache-Control: public, max-age=...` apropiado (e.g. 60-300 s para contenido dinámico).

### `/api/admin/` — consumido por Flutter (requiere Bearer JWT + permisos)

#### Auth

| Método | Endpoint |
|---|---|
| POST | `/api/admin/auth/login` |
| POST | `/api/admin/auth/refresh` |
| POST | `/api/admin/auth/logout` |
| GET | `/api/admin/auth/me` |

#### Site settings

| Método | Endpoint | Permiso |
|---|---|---|
| GET | `/api/admin/site-settings` | `cms.settings.read` |
| PUT | `/api/admin/site-settings` | `cms.settings.manage` |

#### Alcalde

| Método | Endpoint | Permiso |
|---|---|---|
| GET | `/api/admin/mayor` | `cms.mayor.read` |
| GET | `/api/admin/mayor/{id}` | `cms.mayor.read` |
| POST | `/api/admin/mayor` | `cms.mayor.manage` |
| PUT | `/api/admin/mayor/{id}` | `cms.mayor.manage` |
| POST | `/api/admin/mayor/{id}/deactivate` | `cms.mayor.manage` |

#### Institucional

| Método | Endpoint | Permiso |
|---|---|---|
| GET | `/api/admin/institutional` | `cms.institutional.read` |
| PUT | `/api/admin/institutional` | `cms.institutional.manage` |

#### Autoridades

| GET/POST/PUT/DELETE | `/api/admin/authorities[/{id}]` | `cms.authorities.read` / `.manage` |
| POST | `/api/admin/authorities/{id}/deactivate` | `cms.authorities.manage` |

#### Concejo (presidente + miembros)

| GET/POST/PUT | `/api/admin/council/president` | `cms.council.read` / `.manage` |
| GET/POST/PUT/DELETE | `/api/admin/council/members[/{id}]` | `cms.council.read` / `.manage` |

#### Organizational units

| GET/POST/PUT/DELETE | `/api/admin/organizational-units[/{id}]` | `cms.org.read` / `.manage` |

#### Noticias

| GET | `/api/admin/news?page=N&page_size=M&q=&category=&is_published=` | `cms.news.read` |
| GET | `/api/admin/news/{id}` | `cms.news.read` |
| POST | `/api/admin/news` | `cms.news.manage` |
| PUT | `/api/admin/news/{id}` | `cms.news.manage` |
| DELETE | `/api/admin/news/{id}` | `cms.news.manage` (baja lógica) |
| POST | `/api/admin/news/{id}/publish` | `cms.news.publish` |
| POST | `/api/admin/news/{id}/unpublish` | `cms.news.publish` |

#### Eventos

Mismo patrón: `cms.events.read/manage/publish`.

#### Trámites

`cms.tramites.read/manage`.

#### Turismo

`cms.tourism.read/manage`.

#### Avisos / Hero / Transparency / Navegación

`cms.config.read/manage` para hero shortcuts, transparency links, navigation.
`cms.notices.read/manage/publish` para avisos/comunicados.

#### Galería

| GET/POST/PUT/DELETE | `/api/admin/gallery[/{id}]` | `cms.gallery.read` / `.manage` |
| POST | `/api/admin/gallery/{id}/feature` | `cms.gallery.manage` (marcar como destacado del inicio) |

#### Gaceta — incluye upload PDF

| GET | `/api/admin/gaceta?page=N&type=&is_published=` | `cms.gaceta.read` |
| GET | `/api/admin/gaceta/{id}` | `cms.gaceta.read` |
| POST | `/api/admin/gaceta` (multipart con `pdf`) | `cms.gaceta.manage` |
| PUT | `/api/admin/gaceta/{id}` (multipart opcional con nuevo `pdf`) | `cms.gaceta.manage` |
| DELETE | `/api/admin/gaceta/{id}` | `cms.gaceta.manage` |
| POST | `/api/admin/gaceta/{id}/publish` / `/unpublish` | `cms.gaceta.publish` |
| GET | `/api/admin/gaceta/categories` | `cms.gaceta.read` |
| POST/PUT/DELETE | `/api/admin/gaceta/categories[/{id}]` | `cms.gaceta.manage` |

#### Media (uploads)

| POST | `/api/admin/media` (multipart: `file`, `kind`) | `cms.media.upload` |
| GET | `/api/admin/media?page=&kind=&q=` | `cms.media.read` |
| GET | `/api/admin/media/{id}` | `cms.media.read` |
| DELETE | `/api/admin/media/{id}` | `cms.media.manage` |

#### Administración del panel

| GET/POST/PUT/DELETE | `/api/admin/users[/{id}]` | `cms.users.read` / `.manage` |
| POST | `/api/admin/users/{id}/roles` | `cms.roles.assign` |
| GET/POST/PUT/DELETE | `/api/admin/roles[/{id}]` | `cms.roles.read` / `.manage` |
| GET/POST/PUT/DELETE | `/api/admin/permissions[/{id}]` | `cms.roles.assign` |

#### Health

| GET | `/api/admin/health` |
| GET | `/api/admin/health/database` |

---

## 14. Roles y permisos preliminares

### Roles

- **`cms.admin`** — gestión total: contenido + settings + usuarios + roles
- **`cms.editor`** — gestión de contenido (no usuarios, no settings críticos)

### Permisos base

Plantilla: `cms.<recurso>.<acción>`

| Código | Otorgado a admin | Otorgado a editor |
|---|---|---|
| `cms.settings.read` | ✅ | ✅ |
| `cms.settings.manage` | ✅ | ❌ |
| `cms.mayor.read` | ✅ | ✅ |
| `cms.mayor.manage` | ✅ | ❌ |
| `cms.institutional.read` | ✅ | ✅ |
| `cms.institutional.manage` | ✅ | ❌ |
| `cms.authorities.read` | ✅ | ✅ |
| `cms.authorities.manage` | ✅ | ❌ |
| `cms.council.read` | ✅ | ✅ |
| `cms.council.manage` | ✅ | ❌ |
| `cms.org.read` | ✅ | ✅ |
| `cms.org.manage` | ✅ | ❌ |
| `cms.news.read` | ✅ | ✅ |
| `cms.news.manage` | ✅ | ✅ |
| `cms.news.publish` | ✅ | ✅ |
| `cms.events.read` | ✅ | ✅ |
| `cms.events.manage` | ✅ | ✅ |
| `cms.events.publish` | ✅ | ✅ |
| `cms.notices.read` | ✅ | ✅ |
| `cms.notices.manage` | ✅ | ✅ |
| `cms.notices.publish` | ✅ | ✅ |
| `cms.config.read` | ✅ | ✅ |
| `cms.config.manage` | ✅ | ❌ |
| `cms.tramites.read` | ✅ | ✅ |
| `cms.tramites.manage` | ✅ | ✅ |
| `cms.tourism.read` | ✅ | ✅ |
| `cms.tourism.manage` | ✅ | ✅ |
| `cms.gallery.read` | ✅ | ✅ |
| `cms.gallery.manage` | ✅ | ✅ |
| `cms.gaceta.read` | ✅ | ✅ |
| `cms.gaceta.manage` | ✅ | ✅ |
| `cms.gaceta.publish` | ✅ | ✅ |
| `cms.media.read` | ✅ | ✅ |
| `cms.media.upload` | ✅ | ✅ |
| `cms.media.manage` (delete) | ✅ | ❌ |
| `cms.users.read` | ✅ | ❌ |
| `cms.users.manage` | ✅ | ❌ |
| `cms.roles.read` | ✅ | ❌ |
| `cms.roles.manage` | ✅ | ❌ |
| `cms.roles.assign` | ✅ | ❌ |

### Recomendaciones

- **`manage` incluye `publish`** (la separación `publish` permite futuro "revisor" que solo publica pero no edita)
- **`media.upload`** lo tiene editor (necesita subir fotos); **`media.manage` (delete)** solo admin
- **`settings`** solo admin (cambiar el teléfono del GAM afecta a toda la web)
- **`institutional`** (misión/visión) solo admin (es texto fundacional)
- **`mayor`** solo admin (representación institucional máxima)
- Permitir **roles custom** en el futuro si la municipalidad quiere crear "Editor de Noticias", "Editor de Gaceta", etc. La tabla `cms_role` debe ser abierta (no enum)

---

## 15. Riesgos técnicos encontrados

### 15.1 Contenido inconsistente / erróneo

1. **Dos alcaldes distintos declarados** — `site.ts:25` "Fredy Patzi Barrios" + foto `alcaldeblanco.png`; `institucional.ts:18-22` "Lic. Roberto Mamani Condori" + foto `alcaldesa.jpg`. El visitante ve datos contradictorios entre `WelcomeMayor` y la página `/institucional/`. **Debe corregirse antes de migrar a la BD.**
2. **Placeholders explícitos ("demo", "(texto demo)", "(perfil demo)")** dispersos en `news.ts:9,26,43`, `events.ts:7`, `institucional.ts:21`, `gaceta.ts:7`, `notices.ts:13-37`. El sitio en GH Pages ya está visible al público con esta información. **Riesgo reputacional si no se reemplaza antes del lanzamiento real.**
3. **URLs de gaceta son `'#'`** — el botón "Descargar" no descarga nada. Debe resolverse sí o sí.
4. **Imágenes con nombres inconsistentes**: `ALCALDE.jpeg` (mayúsculas), `alcaldesa.jpg`, `alcaldeblanco.png` — sin convención de nombres.

### 15.2 Código

5. **6 componentes huérfanos** sin import en ninguna página ni layout: `CoverArt.astro`, `ValleyScene.astro`, `Seal.astro`, `HeroCarousel.astro`, `QuickLinks.astro`, `ServiceIndex.astro`. Total: ~600 LOC de código muerto que dificulta el mantenimiento. **Recomendación:** decidir si se eliminan o se activan antes de integrar el panel.
6. **`homeQuickLinks` exportado pero nunca usado** (`data/navigation.ts:16-46`).
7. **`heroSlides` exportado pero nunca usado** (`data/heroes.ts:3-28`).
8. **`notices.ts` mezcla contenido dinámico (`notices[]`) con configuración de UI (`heroShortcuts`, `transparencyLinks`)** — archivo mal organizado conceptualmente.

### 15.3 Arquitectura

9. **Sitio 100% estático** — cualquier cambio requiere `git push` + build de GH Pages (~1-2 min). No hay previsualización. Esto impedirá cualquier workflow editorial ágil.
10. **Sin CSR/SSR, sin caché configurable**: al migrar a backend, hay que decidir si Astro pasa a SSR (`@astrojs/node`) o se mantiene estático con fetch en build time. Trade-off: SSR = cambios instantáneos + necesita deploy Node; build-time = gratis en GH Pages + retraso de 1-2 min.
11. **Sin sitemap.xml, robots.txt, Open Graph, Twitter Cards** — la auditoría SEO es pobre. **REQUIERE CONFIRMACIÓN** si se aborda en este proyecto o después.
12. **Sin accesibilidad auditada formalmente**: hay `prefers-reduced-motion` (`global.css:423`) y focus-visible (`global.css:223`), pero no hay tests automatizados.
13. **Tailwind v4 con `@theme`** — la sintaxis está bien, pero algunas clases referenciadas (`bg-forest`, `text-adobe`) parecen funcionar vía tokens. **REQUIERE CONFIRMACIÓN** que el build de producción las incluye correctamente.
14. **No hay HTTPS forzado, no hay cabeceras de seguridad** configuradas en GH Pages (depende del config de GH).

### 15.4 Datos / Seguridad

15. **No hay datos sensibles hoy** (todo es demo). Cuando se carguen datos reales del municipio (fotos del alcalde reales, documentos oficiales), el panel **debe usar HTTPS con cookies Secure=true** (`config.py:91-93` de correspondencia es la referencia correcta).
16. **`STORAGE_ROOT` debe estar en volumen Docker persistente**, no en el filesystem del contenedor, para que los PDFs no se pierdan al redeploy.

---

## 16. Archivos o código que deberían refactorizarse antes de conectar la API

> Estas refactorizaciones **no son implementar la API**, son preparación. Deben ocurrir en una rama aparte antes del trabajo del backend.

### 16.1 Eliminar código muerto (6 componentes + 2 exports)

- `src/components/CoverArt.astro` — huérfano, eliminar
- `src/components/ValleyScene.astro` — huérfano, eliminar
- `src/components/Seal.astro` — huérfano, eliminar
- `src/components/HeroCarousel.astro` — huérfano, eliminar (mantener `data/heroes.ts` solo si se reactiva)
- `src/components/QuickLinks.astro` — huérfano, decidir: ¿se activa con `homeQuickLinks`? Si no, eliminar ambos
- `src/components/ServiceIndex.astro` — huérfano, eliminar
- `src/data/heroes.ts` (export `heroSlides` no usado) — eliminar si no se reactiva HeroCarousel
- `src/data/navigation.ts` (export `homeQuickLinks` no usado) — eliminar si no se reactiva QuickLinks

### 16.2 Corregir inconsistencias de contenido

- Resolver el conflicto de alcalde entre `site.ts:24-32` y `institucional.ts:18-22`. **Decisión a tomar con el usuario antes de la migración.**
- Reemplazar placeholders "(demo)", "(texto demo)" en `news.ts`, `events.ts`, `gaceta.ts`, `institucional.ts`, `notices.ts` antes del lanzamiento público.
- Definir URL real del PDF en `gaceta.ts` o eliminar las entradas (si la gaceta real aún no existe).

### 16.3 Separar `notices.ts` en dos archivos

- `src/data/notices.ts` mezclar contenido (`notices[]`) con config de UI (`heroShortcuts`, `transparencyLinks`) es incorrecto. Separar en:
  - `src/data/notices.ts` → solo avisos/comunicados (CRUD)
  - `src/data/site-config.ts` (o mover a `site.ts`) → `heroShortcuts`, `transparencyLinks` (config)

### 16.4 Reemplazar `coverGradient` por algo realmente usado

- `NewsArticle.coverGradient` y `TourismSpot.coverGradient` están en el tipo pero no se renderizan en ningún componente. Evaluar si se eliminan del modelo o se empiezan a usar como fallback visual.

### 16.5 Estandarizar nombres de archivos en `public/images/`

- `ALCALDE.jpeg` → `alcalde.jpeg` (todo minúsculas para evitar problemas en deploy Linux/GH Pages)
- Definir convención: `kebab-case-<uso>.<ext>`

### 16.6 Mover validaciones a una capa común

- Hoy no hay validación de slugs duplicados, fechas, etc. (no es problema porque no hay CRUD). Cuando se conecte el panel, **las validaciones deben vivir en backend** (Pydantic) y el frontend (Astro/Flutter) debe confiar en respuestas 422.

### 16.7 Introducir `CmsSiteSettings` antes que el resto

- Crear la entidad/configuración global primero. Permite ir migrando el sitio de TS → API paulatinamente sin romper nada: `site.ts` se reemplaza por `get('/api/public/site-settings')` cuando esté listo, pero el resto del sitio sigue estático.

---

## 17. Plan recomendado de implementación

> Estimaciones en días-hombre (1 dev senior full-time). NO incluye tiempo de QA ni despliegue.

### Fase 0 — Preparación (2-3 días)

**Objetivo:** limpiar el sitio público antes de cualquier integración.

- Decidir y resolver el conflicto del alcalde (Fredy Patzi vs Roberto Mamani)
- Eliminar los 6 componentes huérfanos + 2 exports no usados
- Separar `notices.ts` en `notices.ts` + config de UI
- Eliminar placeholders "(demo)" o marcarlos claramente como demo
- Estandarizar nombres de imágenes
- Renombrar `ALCALDE.jpeg` → `alcalde.jpeg`
- Verificar build limpio: `npm run build`, revisar `dist/`
- Push a `main`, esperar deploy en GH Pages

### Fase 1 — Base administrativa (5-6 días)

**Objetivo:** backend + BD + auth + storage operativos.

- Crear repo `sipe-sipe-gestion-backend` (o `sipe-sipe-gestion/` con frontend y backend)
- Crear estructura: `backend/app/{core,modules/cms}`, `backend/alembic`, `backend/Dockerfile`
- Reutilizar de correspondencia:
  - `core/config.py` (ajustar DB, JWT issuer, cookie path = `/cms-api/auth`)
  - `core/security.py` (copiar literal)
  - `core/storage/{storage_service.py, local_filesystem_storage.py}` (copiar literal)
  - `core/cors.py` + `core/error_middleware.py` (copiar literal)
  - `common/schemas.py` (copiar literal)
  - `modules/auth/{router,service,dependencies,schemas,models}.py` adaptados a `cms_users` + `cms_roles`
- Crear modelos SQLAlchemy: `cms_user`, `cms_role`, `cms_permission`, `cms_user_role`, `cms_role_permission`
- Crear migración Alembic inicial
- Crear Docker Compose con `postgres` + `backend` + volumen `cms_storage` separado
- Seed inicial: roles `cms.admin`, `cms.editor`; usuario admin inicial con password temporal
- Health checks `/health` + `/health/database`
- Swagger `/docs`
- Tests: pytest de auth + permisos

### Fase 2 — Contenido institucional (settings + alcalde + misión/visión + autoridades + Concejo + unidades) (4-5 días)

- Módulo `cms/site_settings.py` (key/value) + endpoint público + admin
- Módulo `cms/mayor.py` (un registro activo) + upload de foto vía `CmsMedia`
- Módulo `cms/institutional.py` (mission/vision/values)
- Módulo `cms/authorities.py` (CRUD + foto)
- Módulo `cms/council.py` (presidente + miembros)
- Módulo `cms/organizational_units.py` (CRUD)
- Refactor Astro: `src/data/site.ts`, `src/data/institucional.ts`, `src/data/concejo.ts` → funciones que hacen `fetch('/api/public/...')` en build time (sitio sigue estático)
- Verificar visualmente: páginas `/`, `/institucional/`, `/concejo/`

### Fase 3 — Noticias + Eventos + Trámites + Turismo + Galería + Avisos (5-6 días)

- Módulo `cms/news.py` (CRUD + publish + paginado + búsqueda)
- Módulo `cms/events.py`
- Módulo `cms/tramites.py`
- Módulo `cms/tourism.py`
- Módulo `cms/notices.py`
- Módulo `cms/gallery.py` (galería destacada del inicio)
- Módulo `cms/navigation.py` (menú principal)
- Módulo `cms/config_ui.py` (hero shortcuts + transparency links)
- Módulo `cms/media.py` (upload/list/delete con SHA-256, MIME allowlist, sanitize filename)
- Refactor Astro: `src/data/news.ts`, `events.ts`, `tramites.ts`, `tourism.ts`, `notices.ts`, `media.ts` → fetch al backend

### Fase 4 — Gaceta Municipal (3-4 días)

- Módulo `cms/gaceta_category.py` (CRUD categorías — **REQUIERE CONFIRMACIÓN de valores**)
- Módulo `cms/gaceta.py` (CRUD + upload PDF + reemplazar PDF + publish)
- Endpoint público `/api/public/gaceta` + `/api/public/gaceta/{id}/pdf`
- Refactor Astro: `src/pages/gaceta/index.astro` + `NoticesBoard.astro` → fetch
- Decisión a tomar con usuario: ¿categorías cerradas (enum) o administrables?

### Fase 5 — Panel administrativo Flutter (8-10 días)

**Objetivo:** construir el panel.

**Bootstrap (1 día)**
- Crear proyecto Flutter `sipe_sipe_gestion`
- `pubspec.yaml`: flutter_bloc, dio, get_it, go_router, intl, responsive_framework, file_picker, packages locales `cms_api`, `cms_repository`, `failures`
- `bootstrap.dart`, `main.dart`, `core/router.dart`, `routes.dart`
- `core/auth/permissions.dart`, `permission_guard.dart`, `session_header_labels.dart`
- `core/theme/ui_colors.dart` con paleta institucional verde GAM
- `core/util/form/` (controllers, validators)
- `shared/widgets/`: copiar y adaptar de correspondencia
- `injection/` (GetIt)

**Auth + layout base (1 día)**
- `features/authentication/sign_in/`
- `features/app/app_session_cubit.dart`, `splash` layout, `home` (shell con sidebar)

**CRUD genérico plantilla (1-2 días)**
- Patrón `features/<dominio>/list_<entidad>/{cubit,views/tabla_o_lista}`
- Patrón `features/<dominio>/upsert_<entidad>/{cubit,helpers,views}`
- Aplicar a `autoridades` o `unidades` como piloto

**CRUDs restantes (4-5 días)**
- Autoridades, Alcalde, Concejo, Unidades, Unidades news, Eventos, Trámites, Turismo, Galería, Navegación, Hero/Transparency
- Gaceta (con upload PDF y categorías)
- Media (galería de archivos subidos)
- Settings (institutional + sitio)

**Administración (1 día)**
- Usuarios, permisos, roles

### Fase 6 — Migración del contenido demo (1 día)

- Script seed o carga manual desde el panel: copiar los 4 eventos, 4 noticias, 4 trámites, 4 sitios turísticos, 3 gacetas (sin PDF real) al backend
- Subir las 15 imágenes a `CmsMedia` y referenciarlas desde las entidades
- Decidir qué datos demo se quedan (placeholders) y cuáles se eliminan

### Fase 7 — Despliegue (2-3 días)

- Decisión: ¿Astro pasa a SSR o sigue estático?
  - **Recomendación:** mantenerlo estático (build-time fetch) para seguir en GH Pages gratis. El panel Flutter es la única app que necesita Node runtime.
- Levantar `sipe-sipe-gestion-backend` en el mismo servidor donde está `correspondencia_sipe_sipe`
- Opciones de hosting del backend:
  - Mismo VPS, distinto puerto (`8001`), reverse proxy (Apache/Nginx)
  - Contenedor separado con su propio proxy
- BD separada `gestion_sipe` en el mismo Postgres (REQUIERE CONFIRMACIÓN si se prefiere Postgres dedicado)
- Volumen Docker `cms_storage` persistente montado
- Variables de entorno: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `STORAGE_ROOT`, `COOKIE_*`, `CORS_*`
- Configurar HTTPS (Let's Encrypt) en el subdominio del CMS (e.g. `gestion.sipesipe.gob.bo`)
- Actualizar `astro.config.mjs` con la URL del backend público para fetch en build
- Verificar flujo completo: editar una noticia en el panel → push a `main` (o re-build automático) → aparece en la web

### Fase 8 — QA + monitoreo (ongoing)

- Pruebas E2E del panel
- Pruebas E2E del flujo editorial completo
- Logs + métricas básicas

---

## Resumen de tiempos

| Fase | Días | Bloquea a la siguiente |
|---|---|---|
| 0 — Preparación | 2-3 | ✅ nada más empieza |
| 1 — Base administrativa | 5-6 | ✅ fases 2-7 |
| 2 — Contenido institucional | 4-5 | ✅ |
| 3 — Noticias/Eventos/Trámites/Turismo/Galería/Avisos | 5-6 | ✅ |
| 4 — Gaceta Municipal | 3-4 | depende de 3 |
| 5 — Panel Flutter | 8-10 | depende de 1-4 |
| 6 — Migración demo | 1 | depende de 2-4 |
| 7 — Despliegue | 2-3 | depende de todo |
| 8 — QA | ongoing | depende de 7 |
| | | |
| **Total desarrollo** | **30-38 días** (~6-7 semanas) | |

> **Las fases 1-4 se pueden hacer en paralelo con la fase 5** (1 dev backend + 1 dev Flutter). En serie son ~7 semanas; en paralelo ~4-5 semanas.

---

## Puntos que requieren confirmación explícita

| # | Pregunta | Bloquea |
|---|---|---|
| 1 | ¿Qué alcalde va en `site.ts` vs `institucional.ts`? (Fredy Patzi Barrios / Roberto Mamani Condori / otro) | Fase 0 |
| 2 | ¿Qué categorías tendrá la Gaceta Municipal? (Ordenanza / Reglamento / Resolución / Convocatoria / Decreto / Comunicado / otros) | Fase 4 |
| 3 | ¿Sitio Astro sigue estático (build-time fetch) o pasa a SSR (`@astrojs/node`)? | Fase 7 |
| 4 | ¿Mismo Postgres que Correspondencia (BD separada `gestion_sipe`) o Postgres dedicado? | Fase 1 |
| 5 | ¿Mismo VPS que Correspondencia o servidor dedicado para Gestión? | Fase 7 |
| 6 | ¿Trámites requieren adjuntos descargables? (hoy no tienen) | Fase 3 |
| 7 | ¿Sitios turísticos requieren ruta individual con galería? | Fase 3 |
| 8 | ¿SEO (sitemap, OG, JSON-LD) entra en este proyecto? | futuro |

---

**Fin de la auditoría.** No se modificó ningún archivo del proyecto.