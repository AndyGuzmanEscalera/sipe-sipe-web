export const site = {
  name: 'Gobierno Autónomo Municipal de Sipe Sipe',
  shortName: 'GAM Sipe Sipe',
  motto: 'Valle, memoria y gestión pública',
  locationLine: 'Cochabamba, Bolivia',
  email: 'comunicacion@gamsipesipe.gob.bo',
  supportEmail: 'soporte@gamsipesipe.gob.bo',
  phone: '+591 4 000 1234',
  address: 'Plaza 6 de Agosto s/n, Sipe Sipe',
  hours: 'Lunes a viernes · 08:00–12:00 y 14:00–18:00',
  copyright: 'Gobierno Autónomo Municipal de Sipe Sipe',
  edition: 'Edición digital 2026',
  social: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    youtube: 'https://youtube.com/',
  },
  stats: [
    { value: '41.280', label: 'Habitantes' },
    { value: '2.850', label: 'm s.n.m.' },
    { value: '27', label: 'Comunidades' },
    { value: '498', label: 'km² de territorio' },
  ],
  mayor: {
    name: 'Fredy Patzi Barrios',
    title: 'Alcalde Municipal',
    welcomeTitle: 'Una gestión cercana a cada comunidad.',
    message:
      'Trabajamos con transparencia, participación ciudadana y una visión de desarrollo que integra a nuestras comunidades. Este portal acerca la información municipal y los servicios públicos a todas las familias de Sipe Sipe.',
    photo: '/images/alcaldeblanco.png',
    photoNote: 'Retrato institucional de demostración.',
  },
  topLinks: [
    { label: 'Correo institucional', href: 'mailto:comunicacion@gamsipesipe.gob.bo' },
    { label: 'Intranet', href: '#' },
  ] as const,
} as const;
