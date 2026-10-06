export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  /** CSS gradient or image URL */
  background: string;
};

export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  publishedAt: string;
  author: string;
  coverGradient: string;
  coverImage: string;
  coverAlt: string;
};

export type MunicipalEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt?: string;
  image: string;
};

export type TourismSpot = {
  id: string;
  name: string;
  summary: string;
  distanceKm: number;
  coverGradient: string;
  image: string;
};

export type Tramite = {
  id: string;
  name: string;
  unit: string;
  durationDays: number;
  requirements: string[];
  costBs: number | null;
};

export type GacetaEntry = {
  id: string;
  number: string;
  title: string;
  publishedAt: string;
  pdfUrl: string;
};

export type Authority = {
  name: string;
  role: string;
  bio: string;
  photo?: string;
};

export type CouncilMember = {
  name: string;
  block: string;
  commission: string;
};
