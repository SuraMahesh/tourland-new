import type { Destination } from '../types';

export const SITE_URL = 'https://www.modotravels.com';
export const SITE_NAME = 'Modotravels';
export const DEFAULT_DESCRIPTION =
  'Plan a more personal Sri Lanka journey with local insight, considered routes, and practical advice from Modotravels.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/meta.png`;

export interface PageMeta {
  title: string;
  description: string;
}

export const PAGE_METADATA: Record<string, PageMeta> = {
  '/': {
    title: 'Modo Travels - Curated Sri Lanka Journeys',
    description: DEFAULT_DESCRIPTION,
  },
  '/destinations': {
    title: 'Sri Lanka destinations | Modotravels',
    description:
      'Explore Sri Lanka destinations by coast, hill country, culture, and wildlife, with local advice for every stop.',
  },
  '/seasons': {
    title: 'Best time to visit Sri Lanka | Modotravels',
    description:
      'Use our Sri Lanka seasonal guide to match each coast, region, and experience to the best time of year.',
  },
  '/activities': {
    title: 'Things to do in Sri Lanka | Modotravels',
    description:
      'Find memorable things to do in Sri Lanka, from scenic train rides and safaris to surfing and rainforest walks.',
  },
  '/planner': {
    title: 'Plan your Sri Lanka trip | Modotravels',
    description:
      'Build a practical Sri Lanka itinerary with vehicle options, route planning, and local trip support.',
  },
  '/reviews': {
    title: 'Sri Lanka travel reviews | Modotravels',
    description:
      'Read traveller stories and honest impressions from journeys planned with Modotravels in Sri Lanka.',
  },
  '/contact': {
    title: 'Contact Modotravels | Sri Lanka travel planning',
    description:
      'Talk to Modotravels about planning a thoughtful, locally informed trip around Sri Lanka.',
  },
  '/privacy-policy': {
    title: 'Privacy policy | Modotravels',
    description: 'How Modotravels collects, uses, and protects your personal information.',
  },
  '/terms': {
    title: 'Terms of service | Modotravels',
    description:
      'The terms that apply when you plan and book a Sri Lanka journey with Modotravels.',
  },
};

export function absoluteUrl(pathOrUrl: string): string {
  return pathOrUrl.startsWith('http') ? pathOrUrl : `${SITE_URL}${pathOrUrl}`;
}

// Meta descriptions should stay within ~160 characters; cut at a sentence
// boundary when possible so snippets never end mid-thought.
export function truncateDescription(text: string, max = 160): string {
  const paragraph = text.split('\n')[0].trim();
  if (paragraph.length <= max) return paragraph;
  const sentences = paragraph.match(/[^.!?]+[.!?]+/g) ?? [];
  let out = '';
  for (const sentence of sentences) {
    if (out.length + sentence.length > max) break;
    out += sentence;
  }
  out = out.trim();
  if (!out) {
    out = `${paragraph.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
  }
  return out;
}

export function getDestinationMeta(destination: Destination): PageMeta {
  return {
    title: `${destination.name}, Sri Lanka - ${destination.tag} | ${SITE_NAME}`,
    description: truncateDescription(destination.desc),
  };
}

export function normalizePath(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export interface ResolvedSeo {
  title: string;
  description: string;
  canonical: string;
  ogType: 'website' | 'article';
  ogImage: string;
  robots: string;
  schema: object[];
}

export function resolveSeo(rawPath: string, destinations: Destination[]): ResolvedSeo {
  const pathname = normalizePath(rawPath);
  const destinationId = pathname.startsWith('/destination/') ? pathname.split('/')[2] : undefined;
  const destination = destinationId
    ? destinations.find((item) => item.id === destinationId)
    : undefined;
  const isKnownPage = Boolean(destination) || Boolean(PAGE_METADATA[pathname]);
  const meta = destination
    ? getDestinationMeta(destination)
    : PAGE_METADATA[pathname] ?? {
        title: `Sri Lanka travel planning | ${SITE_NAME}`,
        description: DEFAULT_DESCRIPTION,
      };
  const canonical = pathname === '/' ? `${SITE_URL}/` : `${SITE_URL}${pathname}`;
  const ogImage = destination ? absoluteUrl(destination.img) : DEFAULT_OG_IMAGE;

  const agencySchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    image: DEFAULT_OG_IMAGE,
    areaServed: { '@type': 'Country', name: 'Sri Lanka' },
  };

  const schema: object[] = destination
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'TouristDestination',
          name: destination.name,
          description: meta.description,
          url: canonical,
          image: ogImage,
          geo: {
            '@type': 'GeoCoordinates',
            latitude: destination.lat,
            longitude: destination.lng,
          },
          containedInPlace: { '@type': 'Country', name: 'Sri Lanka' },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Destinations',
              item: `${SITE_URL}/destinations`,
            },
            { '@type': 'ListItem', position: 3, name: destination.name, item: canonical },
          ],
        },
      ]
    : pathname === '/'
      ? [
          agencySchema,
          { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
        ]
      : [agencySchema];

  return {
    title: meta.title,
    description: meta.description,
    canonical,
    ogType: destination ? 'article' : 'website',
    ogImage,
    robots: isKnownPage ? 'index, follow' : 'noindex, follow',
    schema,
  };
}

export interface MetaTag {
  attr: 'name' | 'property';
  key: string;
  content: string;
}

export function buildMetaTags(seo: ResolvedSeo): MetaTag[] {
  return [
    { attr: 'name', key: 'description', content: seo.description },
    { attr: 'name', key: 'robots', content: seo.robots },
    { attr: 'property', key: 'og:type', content: seo.ogType },
    { attr: 'property', key: 'og:site_name', content: SITE_NAME },
    { attr: 'property', key: 'og:locale', content: 'en_US' },
    { attr: 'property', key: 'og:title', content: seo.title },
    { attr: 'property', key: 'og:description', content: seo.description },
    { attr: 'property', key: 'og:url', content: seo.canonical },
    { attr: 'property', key: 'og:image', content: seo.ogImage },
    { attr: 'name', key: 'twitter:card', content: 'summary_large_image' },
    { attr: 'name', key: 'twitter:title', content: seo.title },
    { attr: 'name', key: 'twitter:description', content: seo.description },
    { attr: 'name', key: 'twitter:image', content: seo.ogImage },
  ];
}
