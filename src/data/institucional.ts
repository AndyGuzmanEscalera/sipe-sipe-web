import type { Authority } from '../types/content';

export const mission =
  'Gestionar el desarrollo integral del municipio con transparencia, legalidad y participación ciudadana, priorizando servicios básicos, inversión productiva y conservación del patrimonio cultural.';

export const vision =
  'Ser un municipio referente en Cochabamba por su gestión moderna, inclusiva y sostenible, con comunidades unidas y oportunidades para todas las familias.';

export const values = [
  'Transparencia',
  'Participación',
  'Eficiencia',
  'Respeto intercultural',
  'Sostenibilidad ambiental',
];

export const executiveAuthorities: Authority[] = [
  {
    name: 'Lic. Roberto Mamani Condori',
    role: 'Alcalde Municipal',
    bio: 'Administradora pública con experiencia en programas sociales y cooperación internacional (perfil demo).',
    photo: '/images/alcaldesa.jpg',
  },
  {
    name: 'Ing. Carlos Mendoza Ríos',
    role: 'Secretario Municipal de Gobierno',
    bio: 'Coordina relaciones interinstitucionales y gabinete de ministros municipales.',
  },
  {
    name: 'Econ. Patricia Veizaga Sánchez',
    role: 'Secretaria Municipal de Hacienda',
    bio: 'Responsable de presupuesto, tesorería y modernización financiera.',
  },
  {
    name: 'Arq. Fernando Quispe Laura',
    role: 'Secretario Municipal de Obras Públicas',
    bio: 'Supervisa infraestructura vial, equipamiento y proyectos de agua.',
  },
];

export const organizationalUnits = [
  'Alcaldía',
  'Concejo Municipal',
  'Secretaría de Gobierno',
  'Secretaría de Hacienda',
  'Secretaría de Obras Públicas',
  'Secretaría de Desarrollo Humano',
  'Secretaría de Desarrollo Económico',
  'Unidad de Comunicación',
  'Unidad de Sistemas e Informática',
];
