const base = import.meta.env.BASE_URL;

/** Prefijo para enlaces e imágenes en `public/` (GitHub Pages usa subruta del repo). */
export function withBase(path: string): string {
  if (
    !path ||
    path.startsWith('http') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:') ||
    path.startsWith('#')
  ) {
    return path;
  }
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${clean}`;
}

/** Ruta lógica del sitio (sin prefijo del repo) para comparar navegación activa. */
export function stripBase(pathname: string): string {
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
  if (prefix && prefix !== '/' && pathname.startsWith(prefix)) {
    const rest = pathname.slice(prefix.length);
    return rest === '' ? '/' : rest;
  }
  return pathname;
}
