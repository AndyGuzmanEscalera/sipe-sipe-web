import type { HeroSlide } from '../types/content';

export const heroSlides: HeroSlide[] = [
  {
    id: 'valle',
    title: 'SIPE SIPE TIERRA DE TRADICIÓN',
    subtitle: 'Historia viva entre el valle y los cerros de Cochabamba.',
    ctaLabel: 'Descubra más',
    ctaHref: '/turismo/',
    background: 'linear-gradient(135deg, #0f3d2e 0%, #1a6b4a 45%, #2d8f5f 100%)',
  },
  {
    id: 'feria',
    title: 'FERIA AGROPECUARIA MUNICIPAL',
    subtitle: 'Productores locales, artesanía y gastronomía de la región.',
    ctaLabel: 'Ver eventos',
    ctaHref: '/eventos/',
    background: 'linear-gradient(135deg, #3d2a0f 0%, #8a5a12 45%, #c9921a 100%)',
  },
  {
    id: 'agua',
    title: 'PROGRAMA AGUA PARA TODOS',
    subtitle: 'Inversión en redes, reservorios y riego comunitario.',
    ctaLabel: 'Conozca la gestión',
    ctaHref: '/noticias/',
    background: 'linear-gradient(135deg, #0c2a4a 0%, #1565a8 50%, #3ba4e0 100%)',
  },
];
