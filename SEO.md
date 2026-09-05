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
with helpful, specific pages.

Implemented so far: `/guide` ("How to Travel Sri Lanka: Complete Guide") targets
the "how to travel sri lanka" cluster with trip facts, itineraries, transport
advice, and an FAQ emitted as `FAQPage` structured data (eligible for rich
results). The destinations page title targets "beautiful places in Sri Lanka".
FAQ copy lives in `GUIDE_FAQS` in `src/data/seoMeta.ts`.

Still to do:

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

Lighthouse (local, production build): **Accessibility 100, Best Practices 100,
SEO 100 on every audited page**; Performance ~88–96 mobile / ~97 desktop.
What's in place — keep these invariants when editing:

- **Responsive images**: every `<img>` for destination/activity photos uses
  `srcSet` from `src/utils/img.ts`. Local images in `public/assets/**` need a
  pre-generated `-800.jpg` variant — when adding an image, run
  `sips -Z 800 -s format jpeg -s formatOptions 70 name.jpg --out name-800.jpg`.
- **Hero preload**: each page's `heroImg` in `PAGE_METADATA` is emitted as a
  `<link rel="preload" as="image">` by the prerenderer — set it for new pages.
- **Fonts are self-hosted** (`public/fonts/*.woff2`, variable, latin +
  latin-ext) with `@font-face` at the top of `index.css` using
  `font-display: optional` — text never repaints or shifts when fonts arrive.
  Never reintroduce a Google Fonts stylesheet or CSS `@import`.
- **Static rendering + hydration**: `scripts/prerender.mjs` renders every
  route's full markup into `#root` via `src/ssr-entry.tsx`, and `main.tsx`
  hydrates it. **The build-time render and the first client render must produce
  identical markup** — no `new Date()`, `window`, `Math.random`, or
  `localStorage` in initial render output. Fill viewer-dependent values in a
  mount effect (see the date effect in HomePage), or gate browser-only UI on
  `useHydrated()` (see LazyMapView). Date-heavy routes can opt out via
  `SKIP_STATIC` in the prerender script (currently `/planner`). A hydration
  mismatch shows up as React error #418 in the console and forfeits the LCP
  win — check the browser console after touching initial-render code.
- **Leaflet is lazy**: always use `LazyMapView`, never import `MapView` or
  `MiniMap` into eagerly-loaded code. framer-motion was removed (header
  animations are CSS in `index.css`).
- **CLS**: the route Suspense fallback must stay `minHeight: 100vh` so the
  footer never renders in-viewport mid-load. Give every new `<img>` explicit
  `width`/`height`.
- **Accessibility invariants**: heading levels never skip (footer uses h2,
  cards h3); form controls get `htmlFor`/`id` label association; text colors
  use `--mute`/`--sunset-ink` (not raw `--sunset`) on light backgrounds.

Re-check after significant UI changes: `npm run build && npm run preview`,
then Lighthouse in Chrome DevTools, or https://pagespeed.web.dev on the live
site. Watch LCP (<2.5 s) and CLS (<0.1). The remaining mobile-performance gap
is the client-side-rendered SPA boot; closing it fully would mean rendering
page content into the prerendered HTML (SSG + hydration).

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
