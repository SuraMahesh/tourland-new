import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DESTINATIONS } from '../data';
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
    const seo = resolveSeo(pathname, DESTINATIONS);

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
  }, [pathname]);

  return null;
}
