import type { NewsArticle } from '../types/content';

export const newsArticles: NewsArticle[] = [
  {
    slug: 'inauguracion-centro-salud-aurora',
    title: 'Inauguran ampliación del Centro de Salud Aurora B',
    excerpt:
      'La nueva infraestructura duplica la capacidad de consulta externa y farmacia comunitaria.',
    body: `El Gobierno Autónomo Municipal de Sipe Sipe entregó la ampliación del Centro de Salud Aurora B, con inversión municipal complementada por cooperación internacional.

La obra incluye tres consultorios, sala de observación, farmacia y área de espera climatizada. Se estima atender a más de 180 pacientes por día en jornada extendida.

El Alcalde destacó el trabajo conjunto con juntas vecinales para el mantenimiento de espacios verdes perimetrales.`,
    category: 'Salud',
    publishedAt: '2026-03-18',
    author: 'Unidad de Comunicación',
    coverGradient: 'linear-gradient(145deg, #0d9488, #134e4a)',
    coverImage: '/images/iglesia-san-pedro-plaza.jpg',
    coverAlt: 'Centro poblado de Sipe Sipe junto al Templo de San Pedro',
  },
  {
    slug: 'pavimentacion-avenida-6-agosto',
    title: 'Avance del 72% en pavimentación de la Av. 6 de Agosto',
    excerpt:
      'El proyecto beneficia a comerciantes y familias del eje principal con drenaje pluvial renovado.',
    body: `La Secretaría de Obras Públicas reporta avance del 72% en la pavimentación de la Avenida 6 de Agosto, tramo Plaza — Mercado Central.

Se repusieron más de 400 metros de alcantarillado y se instalaron bolardos para seguridad peatonal. La entrega final está prevista para el segundo trimestre.

Los vecinos participaron en audiencias para definir horarios de trabajo que minimicen el impacto comercial.`,
    category: 'Obras',
    publishedAt: '2026-03-12',
    author: 'Obras Públicas',
    coverGradient: 'linear-gradient(145deg, #475569, #1e293b)',
    coverImage: '/images/puente-viloma.jpg',
    coverAlt: 'Puente ferroviario sobre el río Viloma, Sipe Sipe',
  },
  {
    slug: 'becas-escolares-2026',
    title: 'Abren convocatoria de becas escolares municipales 2026',
    excerpt:
      '400 becas para estudiantes de secundaria con excelencia académica y situación vulnerable.',
    body: `Educación Municipal abrió la convocatoria de becas 2026. Los postulantes deben presentar certificado de notas, carta de motivación y formulario en línea (demo).

El comité evaluador estará conformado por representantes de U.E., padres de familia y concejo escolar. Los resultados se publicarán en esta web y en murales oficiales.`,
    category: 'Educación',
    publishedAt: '2026-03-05',
    author: 'Educación',
    coverGradient: 'linear-gradient(145deg, #7c3aed, #4c1d95)',
    coverImage: '/images/iglesia-san-pedro.jpg',
    coverAlt: 'Templo de San Pedro en Sipe Sipe',
  },
  {
    slug: 'feria-productiva-sipe-sipe',
    title: 'Feria Productiva reúne a más de 60 emprendimientos locales',
    excerpt:
      'Textiles, derivados lácteos y café de altura destacaron en la jornada de economía popular.',
    body: `La Feria Productiva municipal congregó emprendedores de todas las zonas del municipio. Se habilitó una rueda de negocios con compradores institucionales.

El evento contó con música folclórica, degustaciones y talleres de formalización para MYPEs. La próxima edición se anunciará en la sección Eventos.`,
    category: 'Economía',
    publishedAt: '2026-02-28',
    author: 'Desarrollo Económico',
    coverGradient: 'linear-gradient(145deg, #ea580c, #9a3412)',
    coverImage: '/images/inka-raqay-camino.jpg',
    coverAlt: 'Camino rural hacia Inka Raqay, Sipe Sipe',
  },
];

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find((article) => article.slug === slug);
}

export function getLatestNews(limit = 3): NewsArticle[] {
  return [...newsArticles]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}
