import type { TourismSpot } from '../types/content';

export const tourismSpots: TourismSpot[] = [
  {
    id: 't-1',
    name: 'Templo de San Pedro',
    summary: 'Iglesia colonial del centro de Sipe Sipe, junto a la plaza principal.',
    distanceKm: 0.1,
    coverGradient: 'linear-gradient(160deg, #a16207, #713f12)',
    image: '/images/iglesia-san-pedro-fachada.jpg',
  },
  {
    id: 't-2',
    name: 'Inka Raqay',
    summary: 'Sitio arqueológico inca con muros ceremoniales y vistas del valle.',
    distanceKm: 6.2,
    coverGradient: 'linear-gradient(160deg, #0369a1, #0c4a6e)',
    image: '/images/inka-raqay.jpg',
  },
  {
    id: 't-3',
    name: 'Puente ferroviario Viloma',
    summary: 'Viaducto histórico sobre el río Viloma, hito paisajístico del municipio.',
    distanceKm: 4.8,
    coverGradient: 'linear-gradient(160deg, #475569, #1e293b)',
    image: '/images/puente-viloma.jpg',
  },
  {
    id: 't-4',
    name: 'Valle al amanecer',
    summary: 'Miradores naturales para ver el valle de Cochabamba al salir el sol.',
    distanceKm: 3.5,
    coverGradient: 'linear-gradient(160deg, #059669, #064e3b)',
    image: '/images/inka-raqay-amanecer.jpg',
  },
];
