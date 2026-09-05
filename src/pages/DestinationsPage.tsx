import { useState } from 'react';
import { SubHero, DestinationCard, LazyMapView } from '../components';
import { DESTINATIONS } from '../data';
import type { PageParams } from '../types';

interface DestinationsPageProps {
  go: (route: string, params?: PageParams) => void;
}

export function DestinationsPage({ go }: DestinationsPageProps) {
  const [region, setRegion] = useState('All');
  const regions = ['All', ...new Set(DESTINATIONS.map((d) => d.region))];
  const filtered = region === 'All' ? DESTINATIONS : DESTINATIONS.filter((d) => d.region === region);

  return (
    <main>
      <SubHero
        crumbs={['Modotravels', 'Destinations']}
        eyebrow="Destinations"
        title="Six regions to choose from."
        img="/assets/destinations/sigiriya.jpg"
      />
      <section className="container sec">
        <div className="sec-head">
          <div className="lh" style={{ maxWidth: 680 }}>
       
            <h2 className="h-3" style={{ marginTop: 14 }}>
              Filter by region, season, or interest.
            </h2>
          </div>
    
        </div>

        <div className="flex gap-2 mt-2" style={{ flexWrap: 'wrap', marginBottom: 48 }}>
          {regions.map((r) => (
            <button
              key={r}
              className={'chip' + (region === r ? ' active' : '')}
              onClick={() => setRegion(r)}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="destination-page" >
          <div className="destination-section">
            {filtered.map((d) => (
              <DestinationCard
                key={d.id}
                d={d}
                variant="grid"
                onClick={() => go('destination', { id: d.id })}
              />
           
            ))}
          </div>
          <aside style={{ position: 'sticky', top: 96, padding: 24, background: 'var(--bone)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-2)' }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              Map view
            </div>
            <LazyMapView pins={filtered} onPick={(id) => go('destination', { id })} />
            <div style={{ marginTop: 18, fontSize: 13, color: 'var(--mute)', lineHeight: 1.5 }}>
              Tap a pin to open. {filtered.length} {filtered.length === 1 ? 'destination' : 'destinations'} shown.
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
