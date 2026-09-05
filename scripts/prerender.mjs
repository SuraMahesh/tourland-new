// Post-build SEO pass for the SPA.
//
// `vite build` produces a single dist/index.html whose <head> only describes
// the home page. Crawlers that don't execute JavaScript (social previews,
// Bing, most link unfurlers) would see the wrong title/description/canonical
// on every other route. This script writes one static HTML file per route
// with the correct head tags, and generates sitemap.xml from the same data.
//
// Runs as part of `npm run build`; route metadata comes from the app's own
// src/data/seoMeta.ts and src/data/index.ts so there is one source of truth.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const distDir = resolve(root, 'dist');
const template = readFileSync(resolve(distDir, 'index.html'), 'utf8');

const START = '<!-- seo:start -->';
const END = '<!-- seo:end -->';
const startIndex = template.indexOf(START);
const endIndex = template.indexOf(END);
if (startIndex === -1 || endIndex === -1) {
  throw new Error('SEO markers <!-- seo:start --> / <!-- seo:end --> missing from dist/index.html');
}

const server = await createServer({
  root,
  logLevel: 'error',
  server: { middlewareMode: true },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
});
let seoModule, dataModule;
try {
  seoModule = await server.ssrLoadModule('/src/data/seoMeta.ts');
  dataModule = await server.ssrLoadModule('/src/data/index.ts');
} finally {
  await server.close();
}

const { resolveSeo, buildMetaTags, PAGE_METADATA, SITE_URL } = seoModule;
const { DESTINATIONS } = dataModule;

const routes = [
  ...Object.keys(PAGE_METADATA),
  ...DESTINATIONS.map((destination) => `/destination/${destination.id}`),
];

const escapeAttr = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

function seoBlockFor(route) {
  const seo = resolveSeo(route, DESTINATIONS);
  const lines = [`<title>${escapeAttr(seo.title)}</title>`];
  lines.push(`<link rel="canonical" href="${escapeAttr(seo.canonical)}" />`);
  for (const tag of buildMetaTags(seo)) {
    lines.push(`<meta ${tag.attr}="${tag.key}" content="${escapeAttr(tag.content)}" />`);
  }
  const schemaJson = JSON.stringify(seo.schema).replaceAll('<', '\\u003c');
  lines.push(`<script type="application/ld+json" data-seo-schema="true">${schemaJson}</script>`);
  return lines.join('\n    ');
}

const before = template.slice(0, startIndex);
const after = template.slice(endIndex + END.length);

for (const route of routes) {
  const html = before + seoBlockFor(route) + after;
  const outFile =
    route === '/' ? resolve(distDir, 'index.html') : resolve(distDir, route.slice(1), 'index.html');
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
}

const lastmod = new Date().toISOString().slice(0, 10);
const sitemapEntries = routes
  .map((route) => {
    const loc = route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`;
    return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
  })
  .join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;
writeFileSync(resolve(distDir, 'sitemap.xml'), sitemap);

console.log(`Prerendered ${routes.length} routes and wrote sitemap.xml`);
