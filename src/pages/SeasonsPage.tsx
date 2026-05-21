import { SubHero, SecHead } from '../components';
import { SEASONS } from '../data';
export function SeasonsPage() {
  return (
    <main>
      <SubHero
        crumbs={['TourLand', 'Seasons']}
        eyebrow="When to go"
        title="Two monsoons. Always somewhere in sun."
        img="https://images.unsplash.com/photo-1546708973-c0d27b302cee?w=2000&q=80&auto=format&fit=crop"
      />
      <section className="container sec">
        <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <div className="eyebrow">The short version</div>
            <p className="h-3" style={{ margin: '14px 0 24px', fontWeight: 500, letterSpacing: '-.02em' }}>
              South & west are best <em style={{ fontStyle: 'normal', color: 'var(--sunset)' }}>Dec–Apr</em>. The east coast flips: <em style={{ fontStyle: 'normal', color: 'var(--teal)' }}>May–Sep</em>. The Cultural Triangle and Hill Country are open almost year-round.
            </p>
            <p style={{ color: 'var(--mute)', fontSize: 16, lineHeight: 1.65 }}>
              If you're chasing whales, January through March. If you want the Esala Perahera processions, fly in late July to early August. October is the in-between — cheap, quiet, slightly damp.
            </p>
          </div>
          <div style={{ padding: 24, background: 'var(--bone)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-2)' }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              Peak months · 2026
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {SEASONS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: '14px 6px',
                    borderRadius: 10,
                    textAlign: 'center',
                    background: ['Feb', 'Mar', 'Apr', 'Aug', 'Dec'].includes(s.month) ? 'var(--sunset)' : 'transparent',
                    border: '1px solid var(--line-2)',
                    color: 'var(--ink)',
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.month}</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--mute)' }}>
                    {s.weather}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <SecHead n="02" eyebrow="By month" title="What's good when." />
          <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--line)' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 1fr 1fr 1fr',
                padding: '14px 24px',
                background: 'var(--sand-2)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                color: 'var(--mute)',
              }}
            >
              <div>Month</div>
              <div>Weather</div>
              <div>Best region</div>
              <div>What to do</div>
              <div>Festival</div>
            </div>
            {SEASONS.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 1fr 1fr 1fr',
                  padding: '20px 24px',
                  borderTop: '1px solid var(--line-2)',
                  alignItems: 'center',
                  background: 'var(--bone)',
                }}
              >
                <div className="h-4" style={{ fontFamily: 'var(--font-display)' }}>
                  {s.month}
                </div>
                <div style={{ fontSize: 14 }}>{s.weather}</div>
                <div style={{ fontSize: 14 }}>{s.region}</div>
                <div style={{ fontSize: 14 }}>{s.pick}</div>
                <div style={{ fontSize: 14, color: 'var(--mute)' }}>{s.festival}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
