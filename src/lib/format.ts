function parseDate(iso: string): Date {
  if (iso.includes('T')) return new Date(iso);
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

const dateFormatter = new Intl.DateTimeFormat('es-BO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('es-BO', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatDate(isoDate: string): string {
  return dateFormatter.format(parseDate(isoDate));
}

export function formatDateTime(isoDateTime: string): string {
  return dateTimeFormatter.format(parseDate(isoDateTime));
}

export function formatDay(iso: string): string {
  return new Intl.DateTimeFormat('es-BO', { day: '2-digit' }).format(parseDate(iso));
}

export function formatMonth(iso: string): string {
  return new Intl.DateTimeFormat('es-BO', { month: 'short' }).format(parseDate(iso)).replace('.', '');
}
