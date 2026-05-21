import { useState } from 'react';
import { SubHero } from '../components';
import { ACTIVITIES } from '../data';
import { openWhatsApp, createActivityMessage } from '../utils/whatsapp';
import type { PageParams } from '../types';

interface ActivitiesPageProps {
  go: (route: string, params?: PageParams) => void;
}

export function ActivitiesPage({ go }: ActivitiesPageProps) {
  const cats = ['All', ...new Set(ACTIVITIES.map((a) => a.category))];
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState(ACTIVITIES[0].id);
  const list = cat === 'All' ? ACTIVITIES : ACTIVITIES.filter((a) => a.category === cat);
  const active = ACTIVITIES.find((a) => a.id === open) || ACTIVITIES[0];

  return (
    <main>
      <SubHero
        crumbs={['TourLand', 'Activities']}
        eyebrow="Things to do"
        title="Six categories. Hundreds of experiences."
        img="https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=2000&q=80&auto=format&fit=crop"
      />
      <section className="container sec">
        <div className="flex gap-2 mt-2" style={{ flexWrap: 'wrap', marginBottom: 48 }}>
          {cats.map((c) => (
            <button
              key={c}
              className={'chip' + (cat === c ? ' active' : '')}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="activity-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {list.map((a) => (
              <button
                key={a.id}
                onClick={() => setOpen(a.id)}
                style={{
                  textAlign: 'left',
                  padding: '20px 22px',
                  background: open === a.id ? 'var(--ink)' : 'var(--bone)',
                  color: open === a.id ? 'var(--bone)' : 'var(--ink)',
                  borderRadius: 'var(--r)',
                  border: '1px solid ' + (open === a.id ? 'var(--ink)' : 'var(--line-2)'),
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all .2s',
                }}
              >
                <div>
                  <div className="mono" style={{ color: open === a.id ? 'rgba(248,244,234,.5)' : 'var(--mute)', marginBottom: 4 }}>
                    {a.category} · {a.duration}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-.01em' }}>
                    {a.name}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                  {a.price.replace('from ', '')}
                </div>
              </button>
            ))}
          </div>

          <article
            key={active.id}
            style={{
              position: 'sticky',
              top: 96,
              borderRadius: 'var(--r-lg)',
              overflow: 'hidden',
              background: 'var(--bone)',
              border: '1px solid var(--line-2)',
            }}
          >
            <div style={{ position: 'relative', aspectRatio: '16/9' }}>
              <img
                src={active.img}
                alt={active.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div style={{ padding: '32px 36px' }}>
              <h3 className="h-3">{active.name}</h3>
              <p style={{
                margin: '14px 0 24px',
                color: 'var(--mute)',
                fontSize: 16,
                lineHeight: 1.55,
              }}>
                {active.overview}
              </p>
              <div style={{
                display: 'flex',
                gap: 36,
                padding: '18px 0',
                borderTop: '1px solid var(--line-2)',
                borderBottom: '1px solid var(--line-2)',
              }}>
                <div>
                  <div className="eyebrow">Duration</div>
                  <div style={{ marginTop: 4, fontWeight: 500 }}>{active.duration}</div>
                </div>
                <div>
                  <div className="eyebrow">Difficulty</div>
                  <div style={{ marginTop: 4, fontWeight: 500 }}>{active.difficulty}</div>
                </div>
                <div>
                  <div className="eyebrow">From</div>
                  <div style={{ marginTop: 4, fontWeight: 500 }}>{active.price}</div>
                </div>
              </div>
              <div className="mt-4 eyebrow">How it works</div>
              <ol style={{ margin: '14px 0 28px', paddingLeft: 0, listStyle: 'none' }}>
                {active.steps.map((s, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '28px 1fr',
                      gap: 14,
                      padding: '12px 0',
                      borderBottom: '1px dashed var(--line)',
                      alignItems: 'baseline',
                    }}
                  >
                    <span className="mono" style={{ color: 'var(--sunset)' }}>0{i + 1}</span>
                    <span style={{ fontSize: 15 }}>{s}</span>
                  </li>
                ))}
              </ol>
              <div className="flex gap-3">
                <button className="btn btn-primary" onClick={() => go('planner')}>
                  Add to my tour <span className="arrow">→</span>
                </button>
                <button
                  className="btn btn-light"
                  onClick={() => {
                    openWhatsApp({
                      message: createActivityMessage(active.name),
                    });
                  }}
                >
                  💬 Talk to a guide
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
