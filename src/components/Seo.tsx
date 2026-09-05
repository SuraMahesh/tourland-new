import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { buildMetaTags, resolveSeo } from '../data/seoMeta';

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

export function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    let cancelled = false;
    // The destinations data is ~40KB; loading it on demand keeps it out of the
    // critical bundle. Prerendered pages already ship correct head tags, so a
    // slightly-late client update only matters for in-app navigation.
    import('../data').then(({ DESTINATIONS }) => {
      if (cancelled) return;
      applySeo(pathname, DESTINATIONS);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}

function applySeo(pathname: string, destinations: Parameters<typeof resolveSeo>[1]) {
  {
    const seo = resolveSeo(pathname, destinations);

    document.title = seo.title;
    for (const tag of buildMetaTags(seo)) {
      setMeta(tag.attr, tag.key, tag.content);
    }
    setLink('canonical', seo.canonical);

    let schemaElement = document.head.querySelector<HTMLScriptElement>('script[data-seo-schema]');
    if (!schemaElement) {
      schemaElement = document.createElement('script');
      schemaElement.type = 'application/ld+json';
      schemaElement.dataset.seoSchema = 'true';
      document.head.appendChild(schemaElement);
    }
    schemaElement.textContent = JSON.stringify(seo.schema);
  }
}
