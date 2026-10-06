import type { Tramite } from '../types/content';

export const tramites: Tramite[] = [
  {
    id: 'tr-01',
    name: 'Certificado de empadronamiento',
    unit: 'Secretaría General',
    durationDays: 1,
    requirements: ['Cédula de identidad', 'Comprobante de domicilio (demo)'],
    costBs: 15,
  },
  {
    id: 'tr-02',
    name: 'Licencia de funcionamiento — comercio minorista',
    unit: 'Dirección de Asuntos Municipales',
    durationDays: 5,
    requirements: ['NIT', 'Plano de ubicación', 'Certificado BOMBEROS (demo)'],
    costBs: 350,
  },
  {
    id: 'tr-03',
    name: 'Aprobación de planos — vivienda unifamiliar',
    unit: 'Obras y Urbanismo',
    durationDays: 10,
    requirements: ['Planos firmados por arquitecto', 'Certificado de propiedad'],
    costBs: 420,
  },
  {
    id: 'tr-04',
    name: 'Conexión provisional de agua potable',
    unit: 'Servicios Públicos',
    durationDays: 7,
    requirements: ['Solicitud escrita', 'Informe técnico interno'],
    costBs: null,
  },
];
