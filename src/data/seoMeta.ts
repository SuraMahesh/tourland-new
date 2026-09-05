import type { Destination } from '../types';

export const SITE_URL = 'https://www.modotravels.com';
export const SITE_NAME = 'Modotravels';
export const DEFAULT_DESCRIPTION =
  'Plan a more personal Sri Lanka journey with local insight, considered routes, and practical advice from Modotravels.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/meta.jpg`;

export interface PageMeta {
  title: string;
  description: string;
  // Above-the-fold hero image, preloaded from the prerendered HTML for LCP.
  heroImg?: string;
}

export const PAGE_METADATA: Record<string, PageMeta> = {
  '/': {
    heroImg: '/assets/destinations/ella.jpg',
    title: 'Modotravels | Sri Lanka Tours, Travel Planning & Local Guides',
    description: DEFAULT_DESCRIPTION,
  },
  '/guide': {
    heroImg: '/assets/destinations/ella.jpg',
    title: 'How to Travel Sri Lanka: Complete Guide | Modotravels',
    description:
      'How to travel Sri Lanka: visas, best time to go, getting around, costs, sample itineraries, and the most beautiful places to visit — from local planners.',
  },
  '/destinations': {
    heroImg: '/assets/destinations/sigiriya.jpg',
    title: "Sri Lanka's Most Beautiful Places & Destinations | Modotravels",
    description:
      'Discover the most beautiful places in Sri Lanka — beaches, hill country, ancient cities, and wildlife parks — with local advice for every destination.',
  },
  '/seasons': {
    heroImg: '/assets/destinations/galle.jpg',
    title: 'Best time to visit Sri Lanka | Modotravels',
    description:
      'Use our Sri Lanka seasonal guide to match each coast, region, and experience to the best time of year.',
  },
  '/activities': {
    heroImg: '/assets/destinations/ella.jpg',
    title: 'Things to do in Sri Lanka | Modotravels',
    description:
      'Find memorable things to do in Sri Lanka, from scenic train rides and safaris to surfing and rainforest walks.',
  },
  '/planner': {
    heroImg: '/assets/destinations/teaestates.jpg',
    title: 'Plan your Sri Lanka trip | Modotravels',
    description:
      'Build a practical Sri Lanka itinerary with vehicle options, route planning, and local trip support.',
  },
  '/reviews': {
    heroImg: '/assets/destinations/trincomalee.jpg',
    title: 'Sri Lanka travel reviews | Modotravels',
    description:
      'Read traveller stories and honest impressions from journeys planned with Modotravels in Sri Lanka.',
  },
  '/contact': {
    heroImg: '/assets/destinations/kandy.jpg',
    title: 'Contact Modotravels | Sri Lanka travel planning',
    description:
      'Talk to Modotravels about planning a thoughtful, locally informed trip around Sri Lanka.',
  },
  '/privacy-policy': {
    heroImg: '/assets/destinations/galle.jpg',
    title: 'Privacy policy | Modotravels',
    description: 'How Modotravels collects, uses, and protects your personal information.',
  },
  '/terms': {
    heroImg: '/assets/destinations/sigiriya.jpg',
    title: 'Terms of service | Modotravels',
    description:
      'The terms that apply when you plan and book a Sri Lanka journey with Modotravels.',
  },
};

export interface GuideFaq {
  q: string;
  a: string;
}

// Rendered on the /guide page and emitted as FAQPage structured data —
// keep the two in sync by only editing this list.
export const GUIDE_FAQS: GuideFaq[] = [
  {
    q: 'Do I need a visa to travel to Sri Lanka?',
    a: 'Most nationalities need an Electronic Travel Authorization (ETA), applied for online before arrival at the official portal eta.gov.lk. The standard tourist ETA allows a 30-day double-entry stay and can be extended in Colombo. Always check the official portal for current fees and eligibility for your passport.',
  },
  {
    q: 'What is the best time to visit Sri Lanka?',
    a: 'There is no single season — the island has two monsoons. The south and west coasts and hill country are at their best from December to April, while the east coast shines from May to September. The Cultural Triangle is good almost year-round, so a well-routed trip works in any month.',
  },
  {
    q: 'How many days do you need in Sri Lanka?',
    a: 'Seven days is enough for one region done well — for example the south coast plus hill country. Ten to fourteen days lets you loop the classic route: Cultural Triangle, Kandy, the hill country by train, a safari, and the southern beaches without rushing.',
  },
  {
    q: 'How do you get around Sri Lanka?',
    a: 'The most practical way is a private car with a local driver, which typically costs less than travellers expect and turns transfer days into sightseeing days. The Kandy–Ella train is one of the most scenic rides in the world and worth building the route around. Tuk-tuks cover short local hops.',
  },
  {
    q: 'Is Sri Lanka safe for tourists?',
    a: 'Sri Lanka is generally a safe destination and locals are famously welcoming to travellers. Take the usual precautions you would anywhere — guard valuables on busy beaches and trains, use registered drivers, and respect ocean conditions and wildlife-park rules.',
  },
  {
    q: 'How much does a Sri Lanka trip cost?',
    a: 'Outside international flights, backpackers manage on roughly USD 30–50 per day, mid-range travellers on about USD 80–150 per day for two including a driver, and boutique trips run upwards from there. Entrance fees for major sites like Sigiriya (about USD 30) are the main fixed extras.',
  },
];

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
  heroImg?: string;
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
      : pathname === '/guide'
        ? [
            agencySchema,
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: GUIDE_FAQS.map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: { '@type': 'Answer', text: faq.a },
              })),
            },
          ]
        : [agencySchema];

  return {
    title: meta.title,
    description: meta.description,
    canonical,
    ogType: destination ? 'article' : 'website',
    ogImage,
    heroImg: destination ? destination.img : PAGE_METADATA[pathname]?.heroImg,
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
