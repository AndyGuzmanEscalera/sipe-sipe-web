import type { IconName } from '../components/Icon.astro';

export const heroShortcuts: { label: string; href: string; icon: IconName }[] = [
  { label: 'Trámites', href: '/tramites/', icon: 'document' },
  { label: 'Gaceta', href: '/gaceta/', icon: 'building' },
  { label: 'Concejo', href: '/concejo/', icon: 'users' },
  { label: 'Noticias', href: '/noticias/', icon: 'newspaper' },
  { label: 'Agenda', href: '/eventos/', icon: 'calendar' },
  { label: 'Turismo', href: '/turismo/', icon: 'pin' },
];

export const notices = [
  {
    date: '2026-03-20',
    tag: 'Convocatoria',
    title: 'Becas escolares municipales 2026: inscripciones abiertas hasta el 15 de abril.',
    href: '/noticias/becas-escolares-2026/',
  },
  {
    date: '2026-03-17',
    tag: 'Comunicado',
    title: 'Cortes programados de agua potable en el distrito 3 por mantenimiento de red.',
    href: '/noticias/',
  },
  {
    date: '2026-03-10',
    tag: 'Aviso',
    title: 'Vencimiento del pago de impuestos a inmuebles con descuento por pronto pago.',
    href: '/tramites/',
  },
  {
    date: '2026-03-04',
    tag: 'Participación',
    title: 'Audiencia pública de rendición de cuentas inicial: sábado 28 de marzo.',
    href: '/eventos/',
  },
];

export const transparencyLinks: { label: string; description: string; icon: IconName }[] = [
  { label: 'Rendición de cuentas', description: 'Informes de gestión y audiencias públicas', icon: 'megaphone' },
  { label: 'POA y presupuesto', description: 'Programa Operativo Anual y ejecución', icon: 'chart' },
  { label: 'Contrataciones', description: 'Procesos publicados en SICOES', icon: 'check' },
  { label: 'Tributos municipales', description: 'Impuestos, tasas y patentes', icon: 'coins' },
];
