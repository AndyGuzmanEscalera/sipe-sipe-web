const endpoint = import.meta.env.PUBLIC_GESTION_API_URL?.replace(/\/$/, '');

/**
 * Solo para metadatos o secciones aún en migración.
 * El contenido administrable visible al ciudadano debe cargarse en runtime
 * (ver LiveMayor, LiveInstitutional, LiveGaceta, LiveAuthorities).
 */
export async function fetchGestion<T>(path: string): Promise<T | null> {
  if (!endpoint) return null;
  try {
    const response = await fetch(`${endpoint}${path}`, { cache: 'no-store' });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function gestionMediaUrl(id: string | undefined): string | undefined {
  return id && endpoint ? `${endpoint}/api/public/media/${id}` : undefined;
}
