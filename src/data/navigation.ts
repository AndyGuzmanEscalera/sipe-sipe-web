import type { NavItem } from '../types/content';

export const mainNav: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Institucional', href: '/institucional/' },
  { label: 'Concejo Municipal', href: '/concejo/' },
  { label: 'Gaceta Municipal', href: '/gaceta/' },
  { label: 'Noticias', href: '/noticias/' },
  { label: 'Eventos', href: '/eventos/' },
  { label: 'Trámites', href: '/tramites/' },
  { label: 'Turismo', href: '/turismo/' },
  { label: 'Contacto', href: '/contacto/' },
];

/** Accesos del índice municipal en inicio. */
export const homeQuickLinks: NavItem[] = [
  {
    label: 'Institucional',
    href: '/institucional/',
    description: 'Misión, visión, autoridades y organigrama',
  },
  {
    label: 'Concejo Municipal',
    href: '/concejo/',
    description: 'Concejales, comisiones y sesiones',
  },
  {
    label: 'Gaceta Municipal',
    href: '/gaceta/',
    description: 'Normativa y publicaciones oficiales',
  },
  {
    label: 'Noticias y artículos',
    href: '/noticias/',
    description: 'Comunicados y cobertura de gestión',
  },
  {
    label: 'Eventos',
    href: '/eventos/',
    description: 'Agenda cultural y actividades municipales',
  },
  {
    label: 'Consulta de trámites',
    href: '/tramites/',
    description: 'Requisitos, costos y tiempos de respuesta',
  },
];
