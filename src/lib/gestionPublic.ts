const endpoint = import.meta.env.PUBLIC_GESTION_API_URL?.replace(/\/$/, '');

export async function fetchGestion<T>(path: string): Promise<T | null> {
  if (!endpoint) return null;
  try {
    const response = await fetch(`${endpoint}${path}`);
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function gestionMediaUrl(id: string | undefined): string | undefined {
  return id && endpoint ? `${endpoint}/api/public/media/${id}` : undefined;
}
