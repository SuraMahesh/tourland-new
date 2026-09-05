// Responsive image helpers. Local /assets images ship with a pre-generated
// -800.jpg variant (see scripts in SEO.md); Unsplash URLs are resized via
// their ?w= parameter.

const LOCAL_RE = /^\/assets\/(destinations|activities)\/([a-z-]+)\.jpg$/;

export function imgSrcSet(url: string): string | undefined {
  if (url.includes('images.unsplash.com')) {
    const at = (w: number) => url.replace(/([?&])w=\d+/, `$1w=${w}`);
    return [480, 800, 1200, 1600].map((w) => `${at(w)} ${w}w`).join(', ');
  }
  const match = url.match(LOCAL_RE);
  if (match) {
    return `/assets/${match[1]}/${match[2]}-800.jpg 800w, ${url} 1600w`;
  }
  return undefined;
}

// Cards render at ~400px wide on desktop grids and near full-width on phones.
export const CARD_SIZES = '(max-width: 768px) 92vw, 400px';
export const HERO_SIZES = '100vw';
