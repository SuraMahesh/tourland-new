import { useState } from 'react';
import { SubHero, DestinationCard, MiniMap } from '../components';
import { DESTINATIONS } from '../data';
import type { PageParams } from '../types';

interface DestinationsPageProps {
  go: (route: string, params?: PageParams) => void;
  t: any;
  setTweak: (key: string, value: any) => void;
}

export function DestinationsPage({ go, t, setTweak }: DestinationsPageProps) {
  const [region, setRegion] = useState('All');
  const regions = ['All', ...new Set(DESTINATIONS.map((d) => d.region))];
  const filtered = region === 'All' ? DESTINATIONS : DESTINATIONS.filter((d) => d.region === region);

  return (
    <main>
      <SubHero
        crumbs={['TourLand', 'Destinations']}
        eyebrow="Destinations"
        title="Eight regions to choose from."
        img="https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=2000&q=80&auto=format&fit=crop"
      />
      <section className="container sec">
        <div className="sec-head">
          <div className="lh" style={{ maxWidth: 680 }}>
            <div className="idx-strip">
              <span className="n">28</span>
              <span className="l" />
              <span className="eyebrow">places worth a stop</span>
            </div>
            <h2 className="h-3" style={{ marginTop: 14 }}>
              Filter by region, season, or interest.
            </h2>
          </div>
          <div className="rh">
            {(['grid', 'asym', 'carousel'] as const).map((v) => (
              <button
                key={v}
                className={'chip' + (t.cardLayout === v ? ' active' : '')}
                onClick={() => setTweak('cardLayout', v)}
              >
                {v}
              </button>
            ))}
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

        <div className="grid" style={{ gridTemplateColumns: '1fr 320px', alignItems: 'start', gap: 48 }}>
          <div className="grid grid-3">
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
            <MiniMap pins={filtered} onPick={(id) => go('destination', { id })} />
            <div style={{ marginTop: 18, fontSize: 13, color: 'var(--mute)', lineHeight: 1.5 }}>
              Tap a pin to open. {filtered.length} {filtered.length === 1 ? 'destination' : 'destinations'} shown.
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
