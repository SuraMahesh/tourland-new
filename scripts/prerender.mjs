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

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
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
let seoModule, dataModule, imgModule, ssrModule;
try {
  seoModule = await server.ssrLoadModule('/src/data/seoMeta.ts');
  dataModule = await server.ssrLoadModule('/src/data/index.ts');
  imgModule = await server.ssrLoadModule('/src/utils/img.ts');
  ssrModule = await server.ssrLoadModule('/src/ssr-entry.tsx');
} catch (error) {
  await server.close();
  throw error;
}

const { resolveSeo, buildMetaTags, PAGE_METADATA, SITE_URL } = seoModule;
const { imgSrcSet } = imgModule;
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
  if (seo.heroImg) {
    const srcset = imgSrcSet(seo.heroImg);
    const responsive = srcset
      ? ` imagesrcset="${escapeAttr(srcset)}" imagesizes="100vw"`
      : '';
    lines.push(
      `<link rel="preload" as="image" href="${escapeAttr(seo.heroImg)}"${responsive} fetchpriority="high" />`,
    );
  }
  const schemaJson = JSON.stringify(seo.schema).replaceAll('<', '\\u003c');
  lines.push(`<script type="application/ld+json" data-seo-schema="true">${schemaJson}</script>`);
  return lines.join('\n    ');
}

const before = template.slice(0, startIndex);
const after = template.slice(endIndex + END.length);

// Render each route's markup into #root so the first paint shows real content
// long before the JS bundle loads. main.tsx replaces it with the live app on
// mount, so this is a paint-only placeholder — a failed route falls back to an
// empty root rather than failing the build.
const ROOT_MARKER = '<div id="root"></div>';
if (!after.includes(ROOT_MARKER)) {
  await server.close();
  throw new Error(`${ROOT_MARKER} not found in dist/index.html`);
}

// Routes whose markup depends on the current date can't render identically at
// build time and hydration time; they stay client-rendered.
const SKIP_STATIC = new Set(['/planner']);

// The SSR pass runs through Vite's dev pipeline, so bundled images resolve to
// dev URLs like /src/assets/logo.png; map them to the built hashed filenames.
const builtAssets = readdirSync(resolve(distDir, 'assets'));
function resolveDevAssetUrls(html) {
  return html.replace(/\/src\/assets\/([\w.-]+)\.(\w+)/g, (match, base, ext) => {
    const built = builtAssets.find((f) => f.startsWith(`${base}-`) && f.endsWith(`.${ext}`));
    if (!built) throw new Error(`no built asset found for ${match}`);
    return `/assets/${built}`;
  });
}

async function staticBodyFor(route) {
  if (SKIP_STATIC.has(route)) return '';
  try {
    return resolveDevAssetUrls(await ssrModule.renderPage(route));
  } catch (error) {
    console.warn(`prerender: static render failed for ${route}: ${error.message}`);
    return '';
  }
}

for (const route of routes) {
  const appHtml = await staticBodyFor(route);
  const body = after.replace(ROOT_MARKER, `<div id="root">${appHtml}</div>`);
  const html = before + seoBlockFor(route) + body;
  const outFile =
    route === '/' ? resolve(distDir, 'index.html') : resolve(distDir, route.slice(1), 'index.html');
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
}

await server.close();

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
