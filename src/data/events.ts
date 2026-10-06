import type { MunicipalEvent } from '../types/content';

export const events: MunicipalEvent[] = [
  {
    id: 'evt-001',
    title: 'Sesión ordinaria del Concejo Municipal',
    description: 'Tratamiento de ordenanzas de presupuesto participativo (datos demo).',
    location: 'Sala de sesiones — Edificio Municipal',
    startsAt: '2026-04-02T15:00:00',
    endsAt: '2026-04-02T18:00:00',
    image: '/images/iglesia-san-pedro.jpg',
  },
  {
    id: 'evt-002',
    title: 'Jornada de vacunación y control nutricional',
    description: 'Campaña gratuita para niños menores de 5 años.',
    location: 'Centro de Salud Aurora B',
    startsAt: '2026-04-08T08:00:00',
    endsAt: '2026-04-08T13:00:00',
    image: '/images/sipe-sipe-amanecer.jpg',
  },
  {
    id: 'evt-003',
    title: 'Festival de danzas originarias',
    description: 'Presentaciones de fraternidades locales y feria gastronómica.',
    location: 'Plaza 6 de Agosto',
    startsAt: '2026-04-15T16:00:00',
    endsAt: '2026-04-15T22:00:00',
    image: '/images/iglesia-san-pedro-plaza.jpg',
  },
  {
    id: 'evt-004',
    title: 'Audiencia pública — Plan de movilidad',
    description: 'Socialización del estudio de transporte urbano y rural.',
    location: 'Auditorio municipal',
    startsAt: '2026-04-22T18:30:00',
    image: '/images/puente-viloma.jpg',
  },
];

export function getUpcomingEvents(limit = 3): MunicipalEvent[] {
  return [...events]
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, limit);
}
