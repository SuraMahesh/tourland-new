import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';
import { useHydrated } from '../hooks/useHydrated';

// Leaflet is ~150KB of JS the initial render never needs; loading the map in
// its own chunk keeps it out of every page's critical path.
const InnerMapView = lazy(() => import('./MapView').then((m) => ({ default: m.MapView })));

export function LazyMapView(props: ComponentProps<typeof InnerMapView>) {
  // Leaflet touches `window` at import time, so the static prerender and the
  // first client render both emit only the placeholder — they must produce
  // identical markup for hydration. The real map mounts after hydration.
  const mounted = useHydrated();

  if (!mounted) {
    return <div style={{ height: props.height ?? 460 }} aria-hidden="true" />;
  }
  return (
    <Suspense fallback={<div style={{ height: props.height ?? 460 }} aria-hidden="true" />}>
      <InnerMapView {...props} />
    </Suspense>
  );
}
