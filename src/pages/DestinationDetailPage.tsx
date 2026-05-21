import { useParams } from 'react-router-dom';
import { SubHero, MiniMap } from '../components';
import { DESTINATIONS } from '../data';
import type { PageParams } from '../types';

interface DestinationDetailPageProps {
  go: (route: string, params?: PageParams) => void;
}

export function DestinationDetailPage({ go }: DestinationDetailPageProps) {
  const params = useParams();
  const d = DESTINATIONS.find((x) => x.id === params.id) || DESTINATIONS[0];

  return (
    <main>
      <section className="subhero" style={{ height: 640 }}>
        <div className="subhero-media">
          <img src={d.img.replace('w=1600', 'w=2400')} alt={d.name} />
        </div>
        <div className="subhero-shade" />
        <div className="subhero-inner">
          <div className="crumbs">
            <span style={{ cursor: 'pointer' }} onClick={() => go('destinations')}>
              Destinations
            </span>
            <span className="sep">/</span>
            <span>{d.region}</span>
          </div>
          <div className="eyebrow on-dark">{d.tag}</div>
          <h1 className="h-1">{d.name}</h1>
          <div style={{ display: 'flex', gap: 32, marginTop: 8, fontSize: 14, color: 'rgba(248,244,234,.85)' }}>
            <div>
              <div className="eyebrow on-dark">Best time</div>
              <div style={{ marginTop: 4 }}>{d.best}</div>
            </div>
            <div>
              <div className="eyebrow on-dark">Entry</div>
              <div style={{ marginTop: 4 }}>{d.fee}</div>
            </div>
            <div>
              <div className="eyebrow on-dark">Region</div>
              <div style={{ marginTop: 4 }}>{d.region}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container sec" style={{ paddingTop: 80 }}>
        <div className="destination-content" >
          <div>
            <div className="eyebrow">About</div>
            {d.desc.split('\n\n').map((paragraph, i) => (
              <p
                key={i}
                style={{
                  color: 'var(--mute)',
                  fontSize: 16,
                  lineHeight: 1.65,
                  maxWidth: 640,
                  marginBottom: i === 0 ? 28 : 20,
                  marginTop: i === 0 ? 14 : 0,
                }}
              >
                {paragraph}
              </p>
            ))}
            <p style={{ color: 'var(--mute)', fontSize: 16, lineHeight: 1.65, maxWidth: 640, marginTop: 28 }}>
              We've walked the trails, paid the fees, and rated every guide. Below: how to get there, when to skip it, and what nearby places pair well — the kind of advice a local friend would give.
            </p>
            <div className="mt-8 flex gap-3">
              <button className="btn btn-primary" onClick={() => go('planner')}>
                Add to my tour <span className="arrow">→</span>
              </button>
              <button className="btn btn-light">Save</button>
            </div>
          </div>
          <aside style={{ padding: 32, background: 'var(--bone)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-2)' }}>
            <div className="eyebrow">Quick facts</div>
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['Region', d.region],
                ['Tag', d.tag],
                ['Best season', d.best],
                ['Entry fee', d.fee],
                ['Coords', `${d.lat.toFixed(2)}°N, ${d.lng.toFixed(2)}°E`],
                ['Time from Colombo', '≈ 4h drive'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 18,
                    paddingBottom: 14,
                    borderBottom: '1px dashed var(--line)',
                    fontSize: 14,
                  }}
                >
                  <span className="mute">{k}</span>
                  <span style={{ fontWeight: 500, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <MiniMap pins={[d]} active={d.id} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
