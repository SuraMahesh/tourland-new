# SEO Guide — Modotravels (www.modotravels.com)

The canonical domain is **https://www.modotravels.com** (the apex `modotravels.com`
308-redirects to it). Every URL in code, sitemaps, and structured data must use the
`www` host.

## 1. What is implemented (technical SEO)

### Per-route metadata (`src/data/seoMeta.ts`)
Single source of truth for titles, meta descriptions, canonicals, Open Graph /
Twitter tags, and JSON-LD structured data. Used by both the runtime `<Seo />`
component and the build-time prerenderer.

- Static pages: entries in `PAGE_METADATA`. **When you add a new route, add an
  entry here — it automatically gets prerendered and added to the sitemap.**
- Destination pages: title `"{Name}, Sri Lanka - {tag} | Modotravels"` and a
  description cut from the first paragraph of the destination copy at a sentence
  boundary (≤160 chars). New destinations in `src/data/index.ts` are picked up
  automatically.
- Unknown paths get `noindex, follow` so soft-404s never enter the index.

### Structured data (JSON-LD)
- Home: `TravelAgency` + `WebSite`
- Other static pages: `TravelAgency`
- Destination pages: `TouristDestination` (with `GeoCoordinates` from lat/lng)
  + `BreadcrumbList`

Validate after changes: https://search.google.com/test/rich-results

### Prerendering (`scripts/prerender.mjs`)
This is an SPA — without prerendering, crawlers that don't run JavaScript
(Facebook/WhatsApp/Twitter link previews, Bing, many others) would see the home
page's tags on every URL. `npm run build` now runs `vite build` and then writes
a static `dist/<route>/index.html` for all 37 routes with the correct `<head>`.
Vercel serves these static files before applying the SPA rewrite in
`vercel.json`, so crawlers get correct tags and the app still hydrates normally.

The prerenderer swaps everything between `<!-- seo:start -->` and
`<!-- seo:end -->` in `index.html`. Keep those markers; put route-independent
tags (favicon, preconnects, theme-color) outside them.

### Sitemap and robots
- `dist/sitemap.xml` is generated at build time from the same route list, with
  `lastmod` set to the build date. (The old hand-maintained `public/sitemap.xml`
  is gone — never re-add one; it pointed at the wrong host.)
- `public/robots.txt` allows everything and points at the sitemap on the `www` host.

## 2. One-time setup you must do yourself

1. **Google Search Console** (https://search.google.com/search-console): verify
   `modotravels.com` as a *Domain property* (DNS TXT record), then submit
   `https://www.modotravels.com/sitemap.xml`. This is where you monitor
   indexing, queries, and errors.
2. **Bing Webmaster Tools** (https://www.bing.com/webmasters): import the site
   from Search Console (one click), submit the same sitemap.
3. **Google Business Profile** — if Modotravels has a physical address or phone
   in Sri Lanka, create a profile; "Sri Lanka travel agency" queries lean
   heavily on local results. Then add the address/phone to the `TravelAgency`
   schema in `seoMeta.ts` (`address`, `telephone`, `sameAs` for social profiles).

## 3. Content strategy (the biggest long-term lever)

Technical SEO gets you crawled; content gets you ranked. Travel queries are won
with helpful, specific pages:

- **Target long-tail queries** the site already has pages for: "best time to
  visit Sri Lanka" (/seasons), "things to do in Sri Lanka" (/activities),
  "{destination} Sri Lanka" pages. Expand thin pages with genuinely useful
  detail (how to get there, costs, sample itineraries) rather than keywords.
- **Add itinerary guides** — "10 days in Sri Lanka", "Sri Lanka south coast in
  one week". These match high-intent searches and link naturally to
  destination pages, funneling authority to them.
- **Interlink**: every destination page already lists `nearby` destinations —
  make sure those render as real `<a href>` links (crawlable), not just
  onClick handlers.
- One `<h1>` per page (already correct), descriptive `alt` text on images
  (already mostly correct), descriptive anchor text ("Sigiriya rock fortress
  guide", not "read more").

## 4. Performance (Core Web Vitals)

Page speed is a ranking signal. Current state and what to improve, in order of
impact:

1. **Images are the main cost.** Destination heroes load from Unsplash at
   w=1600. Serve responsive sizes (`srcset` or lower `w=` for cards), add
   `loading="lazy"` to below-the-fold images, and `fetchpriority="high"` +
   explicit `width`/`height` on the LCP hero image.
2. **JS bundle**: the build warns about a >500 kB chunk. Leaflet and
   framer-motion are the likely culprits — keep map components lazy-loaded so
   they don't ship on the home page.
3. Measure with https://pagespeed.web.dev against the live URL; watch LCP
   (target <2.5 s) and CLS (<0.1).

## 5. Off-page

- Get listed in travel directories and Sri Lanka tourism aggregators; ask
  partner hotels/guides to link to the site.
- Encourage reviews on Google/TripAdvisor; genuine review volume feeds both
  rankings and conversion.
- Set `sameAs` in the TravelAgency schema once social profiles exist.

## 6. Maintenance checklist

- New route → add to `PAGE_METADATA` in `src/data/seoMeta.ts`.
- New destination → just add to `DESTINATIONS`; sitemap/prerender pick it up.
- Changed copy → rebuild and redeploy (sitemap `lastmod` updates automatically).
- Monthly: check Search Console → Pages for indexing errors; Rich Results test
  on one destination page after schema changes.
- Never introduce links to the apex domain (`https://modotravels.com/...`) —
  always `www`.
