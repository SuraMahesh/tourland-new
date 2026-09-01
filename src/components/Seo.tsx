import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DESTINATIONS } from '../data';

const SITE_URL = 'https://www.modotravels.com';
const SITE_NAME = 'Modotravels';
const DEFAULT_DESCRIPTION =
  'Plan a more personal Sri Lanka journey with local insight, considered routes, and practical advice from Modotravels.';

const PAGE_METADATA: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Modo Travels - Curated Sri Lanka Journeys',
    description: DEFAULT_DESCRIPTION,
  },
  '/destinations': {
    title: 'Sri Lanka destinations | Modotravels',
    description: 'Explore Sri Lanka destinations by coast, hill country, culture, and wildlife, with local advice for every stop.',
  },
  '/seasons': {
    title: 'Best time to visit Sri Lanka | Modotravels',
    description: 'Use our Sri Lanka seasonal guide to match each coast, region, and experience to the best time of year.',
  },
  '/activities': {
    title: 'Things to do in Sri Lanka | Modotravels',
    description: 'Find memorable things to do in Sri Lanka, from scenic train rides and safaris to surfing and rainforest walks.',
  },
  '/planner': {
    title: 'Plan your Sri Lanka trip | Modotravels',
    description: 'Build a practical Sri Lanka itinerary with vehicle options, route planning, and local trip support.',
  },
  '/reviews': {
    title: 'Sri Lanka travel reviews | Modotravels',
    description: 'Read traveller stories and honest impressions from journeys planned with Modotravels in Sri Lanka.',
  },
  '/contact': {
    title: 'Contact Modotravels | Sri Lanka travel planning',
    description: 'Talk to Modotravels about planning a thoughtful, locally informed trip around Sri Lanka.',
  },
};

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setLink(rel: string, href: string, type?: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    if (type) element.type = type;
    document.head.appendChild(element);
  }
  element.href = href;
  if (type) element.type = type;
}

export function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const destinationId = pathname.startsWith('/destination/') ? pathname.split('/')[2] : undefined;
    const destination = DESTINATIONS.find((item) => item.id === destinationId);
    const metadata = destination
      ? {
          title: `Modo Travels - Curated Sri Lanka Journeys`,
          description: `Plan a more personal Sri Lanka journey with local insight, considered routes, and practical advice from Modotravels`,
        }
      : PAGE_METADATA[pathname] || {
          title: 'Sri Lanka travel planning | Modotravels',
          description: DEFAULT_DESCRIPTION,
        };
    const canonicalUrl = `${SITE_URL}${pathname === '/' ? '' : pathname}`;

    document.title = metadata.title;
    setMeta('name', 'description', metadata.description);
    setMeta('name', 'robots', 'index, follow');
    setMeta('property', 'og:type', destination ? 'article' : 'website');
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:title', metadata.title);
    setMeta('property', 'og:description', metadata.description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', destination ? destination.img : `${SITE_URL}/meta.jpg`);
    setMeta('property', 'og:image:type', 'image/jpeg');
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', metadata.title);
    setMeta('name', 'twitter:description', metadata.description);
    setMeta('name', 'twitter:image', destination ? destination.img : `${SITE_URL}/meta.jpg`);
    setLink('canonical', canonicalUrl);
    setLink('icon', '/favicon.jpeg', 'image/jpeg');
    setLink('apple-touch-icon', '/favicon.jpeg');

    const schema = destination
      ? {
          '@context': 'https://schema.org',
          '@type': 'TouristDestination',
          name: destination.name,
          description: destination.desc.split('\n\n')[0],
          image: destination.img,
          containedInPlace: { '@type': 'Country', name: 'Sri Lanka' },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'TravelAgency',
          name: SITE_NAME,
          url: SITE_URL,
          description: DEFAULT_DESCRIPTION,
          areaServed: { '@type': 'Country', name: 'Sri Lanka' },
        };
    let schemaElement = document.head.querySelector<HTMLScriptElement>('script[data-seo-schema]');
    if (!schemaElement) {
      schemaElement = document.createElement('script');
      schemaElement.type = 'application/ld+json';
      schemaElement.dataset.seoSchema = 'true';
      document.head.appendChild(schemaElement);
    }
    schemaElement.textContent = JSON.stringify(schema);
  }, [pathname]);

  return null;
}