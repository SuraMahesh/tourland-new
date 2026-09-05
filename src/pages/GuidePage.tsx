import type { ReactNode } from 'react';
import { SubHero, SecHead, DestinationCard } from '../components';
import { DESTINATIONS, GUIDE_FAQS } from '../data';
import type { PageParams } from '../types';

type GoFn = (route: string, params?: PageParams) => void;

interface GuidePageProps {
  go: GoFn;
}

function DestLink({ id, go, children }: { id: string; go: GoFn; children: ReactNode }) {
  return (
    <a
      href={`/destination/${id}`}
      onClick={(event) => {
        event.preventDefault();
        go('destination', { id });
      }}
      style={{ color: 'var(--sunset)', fontWeight: 500 }}
    >
      {children}
    </a>
  );
}

function PageLink({ to, go, children }: { to: string; go: GoFn; children: ReactNode }) {
  return (
    <a
      href={`/${to}`}
      onClick={(event) => {
        event.preventDefault();
        go(to);
      }}
      style={{ color: 'var(--sunset)', fontWeight: 500 }}
    >
      {children}
    </a>
  );
}

const HIGHLIGHT_IDS = ['sigiriya', 'ella', 'galle', 'mirissa', 'kandy', 'yala'];

const ITINERARIES: { days: string; name: string; route: string[]; note: string }[] = [
  {
    days: '7 days',
    name: 'South coast & hills',
    route: ['galle', 'mirissa', 'ella', 'kandy'],
    note: 'Beaches, whales in season, the famous train through tea country, and the Temple of the Tooth. The best single week between December and April.',
  },
  {
    days: '10 days',
    name: 'The classic loop',
    route: ['sigiriya', 'dambulla', 'kandy', 'ella', 'yala', 'mirissa'],
    note: 'Cultural Triangle, hill country by train, a leopard safari, and the south coast — the route most first-time visitors are looking for.',
  },
  {
    days: '14 days',
    name: 'The whole island',
    route: ['anuradhapura', 'sigiriya', 'kandy', 'nuwaraeliya', 'ella', 'yala', 'galle'],
    note: 'Adds the sacred city of Anuradhapura and slower hill-country days. Swap the south coast for Trincomalee and the east between May and September.',
  },
];

export function GuidePage({ go }: GuidePageProps) {
  const highlights = HIGHLIGHT_IDS.map((id) => DESTINATIONS.find((d) => d.id === id)).filter(
    (d): d is NonNullable<typeof d> => Boolean(d),
  );
  const nameOf = (id: string) => DESTINATIONS.find((d) => d.id === id)?.name ?? id;

  return (
    <main>
      <SubHero
        crumbs={['Modotravels', 'Travel guide']}
        eyebrow="The complete guide"
        title="How to travel Sri Lanka."
        img="/assets/destinations/ella.jpg"
      />

      <section className="container sec">
        <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <div className="eyebrow">The short version</div>
            <p className="h-3" style={{ margin: '14px 0 24px', fontWeight: 500, letterSpacing: '-.02em' }}>
              One small island, eight UNESCO sites, two monsoons, and the best train ride in Asia.
              Sri Lanka rewards a planned route more than almost anywhere else.
            </p>
            <p style={{ color: 'var(--mute)', fontSize: 16, lineHeight: 1.65 }}>
              Fly into Colombo, apply for the ETA visa online before you leave, and travel the island
              as a loop — culture first or beaches first depending on the season. Most first-time
              visitors do it in 10–14 days with a local driver, using the{' '}
              <PageLink to="seasons" go={go}>monsoon calendar</PageLink> to decide which coast, and the{' '}
              <PageLink to="planner" go={go}>trip planner</PageLink> to lock the route.
            </p>
          </div>
          <div style={{ padding: 24, background: 'var(--bone)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-2)' }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Trip facts</div>
            {[
              ['Visa', 'Online ETA before arrival — eta.gov.lk'],
              ['Airport', 'Colombo–Bandaranaike (CMB)'],
              ['Currency', 'Sri Lankan rupee (LKR)'],
              ['Language', 'Sinhala & Tamil · English widely spoken'],
              ['SIM / eSIM', 'Cheap local data at the airport'],
              ['Plugs', 'Type G (UK-style), 230 V'],
              ['Driving side', 'Left · most visitors hire a driver'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 12, padding: '9px 0', borderTop: '1px solid var(--line-2)', fontSize: 14 }}>
                <span className="mono" style={{ color: 'var(--mute)', minWidth: 92, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', paddingTop: 2 }}>
                  {label}
                </span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container sec">
        <SecHead
          title="The most beautiful places in Sri Lanka."
          lede="Start with the six places almost every great route is built around, then browse the full list by region."
          right={
            <a
              href="/destinations"
              className="btn btn-ghost"
              onClick={(event) => {
                event.preventDefault();
                go('destinations');
              }}
            >
              All destinations →
            </a>
          }
        />
        <div className="grid grid-3" style={{ gap: 20 }}>
          {highlights.map((d) => (
            <DestinationCard key={d.id} d={d} onClick={() => go('destination', { id: d.id })} />
          ))}
        </div>
      </section>

      <section className="container sec">
        <SecHead
          title="When to go, in one paragraph."
          lede="Sri Lanka has no off-season — only a wrong coast."
        />
        <p style={{ color: 'var(--mute)', fontSize: 16, lineHeight: 1.7, maxWidth: 780 }}>
          From <strong>December to April</strong> the south and west coasts and the hill country are
          dry and bright — this is peak season, and whale-watching season in{' '}
          <DestLink id="mirissa" go={go}>Mirissa</DestLink>. From <strong>May to September</strong> the
          island flips: head east to <DestLink id="trincomalee" go={go}>Trincomalee</DestLink>,{' '}
          <DestLink id="pasikuda" go={go}>Pasikuda</DestLink>, and <DestLink id="arugambay" go={go}>Arugam Bay</DestLink>.
          The Cultural Triangle around <DestLink id="sigiriya" go={go}>Sigiriya</DestLink> works nearly
          year-round. Month-by-month detail is on the{' '}
          <PageLink to="seasons" go={go}>seasons page</PageLink>.
        </p>
      </section>

      <section className="container sec">
        <SecHead
          title="Sample itineraries."
          lede="Three proven routes our planners build most often — use them as-is or as a starting point."
        />
        <div className="grid grid-3" style={{ gap: 20, alignItems: 'stretch' }}>
          {ITINERARIES.map((it) => (
            <article key={it.name} style={{ padding: 28, background: 'var(--bone)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-2)', display: 'flex', flexDirection: 'column' }}>
              <div className="mono" style={{ color: 'var(--sunset)', fontSize: 12, marginBottom: 8 }}>{it.days}</div>
              <h3 className="h-4" style={{ marginBottom: 12 }}>{it.name}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--mute)', marginBottom: 16 }}>{it.note}</p>
              <div style={{ marginTop: 'auto', fontSize: 14, lineHeight: 1.9 }}>
                {it.route.map((id, i) => (
                  <span key={id}>
                    {i > 0 && <span style={{ color: 'var(--mute)' }}> → </span>}
                    <DestLink id={id} go={go}>{nameOf(id)}</DestLink>
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <p style={{ marginTop: 24, fontSize: 15, color: 'var(--mute)' }}>
          Want it tailored — pace, budget, vehicle, month?{' '}
          <PageLink to="planner" go={go}>Build your route in the planner</PageLink> or{' '}
          <PageLink to="contact" go={go}>talk to a local planner</PageLink>.
        </p>
      </section>

      <section className="container sec">
        <SecHead
          title="Getting around."
          lede="Distances look short on the map; mountain roads make them long. Plan transport first."
        />
        <div className="grid grid-3" style={{ gap: 20 }}>
          {[
            {
              h: 'Private car & driver',
              p: 'The default for good reason: door-to-door, flexible stops, and a local who knows the roads. Expect roughly USD 50–70 per day including fuel. Every Modotravels route includes vetted drivers.',
            },
            {
              h: 'The hill-country train',
              p: 'The Kandy to Ella line through tea estates is a destination in itself. Book reserved seats ahead in peak season, sit on the right side heading to Ella, and let your driver meet you at the other end.',
            },
            {
              h: 'Tuk-tuks & buses',
              p: 'Tuk-tuks are perfect for short hops — agree the fare or insist on the meter in Colombo. Local buses are the cheap, chaotic, memorable option for travellers with more time than luggage.',
            },
          ].map((item) => (
            <article key={item.h} style={{ padding: 28, background: 'var(--bone)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-2)' }}>
              <h3 className="h-4" style={{ marginBottom: 10 }}>{item.h}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--mute)' }}>{item.p}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container sec">
        <SecHead title="Frequently asked questions." />
        <div style={{ maxWidth: 780 }}>
          {GUIDE_FAQS.map((faq) => (
            <details key={faq.q} style={{ borderTop: '1px solid var(--line-2)', padding: '4px 0' }}>
              <summary className="h-4" style={{ cursor: 'pointer', padding: '16px 0', listStylePosition: 'outside' }}>
                {faq.q}
              </summary>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--mute)', padding: '0 0 18px' }}>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
