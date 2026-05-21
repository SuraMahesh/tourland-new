import { useState, useMemo } from 'react';
import { SubHero } from '../components';
import { ACTIVITIES } from '../data';
import { generateTripPDF } from '../utils/pdf';
import { openWhatsApp, createTripInquiryMessage } from '../utils/whatsapp';

const U = (id: string, w: number = 1600) => {
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
};

interface PlannerStep {
  n: number;
  t: string;
  d: string;
}

interface TourRegion {
  id: string;
  name: string;
  days: number;
  blurb: string;
}

interface TripData {
  startDate: string;
  days: number;
  travellers: { adults: number; children: number };
  regions: string[];
  activities: string[];
  transfer: 'private' | 'suv' | 'ev';
  pickupAirport: boolean;
  style: 'relaxed' | 'balanced' | 'packed';
}

interface ItineraryDay {
  day: number;
  date: string;
  region: string;
  title: string;
  activities: string[];
}

const PLANNER_STEPS: PlannerStep[] = [
  { n: 1, t: 'Dates', d: 'When and how long?' },
  { n: 2, t: 'Regions', d: 'Where do you want to go?' },
  { n: 3, t: 'Activities', d: 'Pick experiences.' },
  { n: 4, t: 'Transfers', d: 'Airport pickup and extras.' },
];

const TOUR_REGIONS: TourRegion[] = [
  { id: 'colombo', name: 'Colombo', days: 1, blurb: 'Arrival, dinner on Galle Face.' },
  { id: 'sigiriya', name: 'Sigiriya & Dambulla', days: 2, blurb: 'Rock fortress, cave temples, balloon ride.' },
  { id: 'kandy', name: 'Kandy', days: 2, blurb: 'Temple of the Tooth, lakeside walks.' },
  { id: 'nuwaraeliya', name: 'Nuwara Eliya', days: 1, blurb: 'Tea estates, Pedro factory tour.' },
  { id: 'ella', name: 'Ella', days: 2, blurb: 'Nine Arches Bridge, Little Adam\'s Peak.' },
  { id: 'yala', name: 'Yala / Udawalawe', days: 2, blurb: 'Leopard or elephant safari, jungle lodge.' },
  { id: 'mirissa', name: 'Mirissa & Galle', days: 3, blurb: 'Whales, fort, beach down-time.' },
  { id: 'trinco', name: 'Trincomalee', days: 2, blurb: 'East-coast reefs and quiet bays.' },
];

export function PlannerPage() {
  const [step, setStep] = useState<number>(1);
  const [trip, setTrip] = useState<TripData>({
    startDate: '2026-02-14',
    days: 12,
    travellers: { adults: 2, children: 0 },
    regions: ['colombo', 'sigiriya', 'kandy', 'ella', 'mirissa'],
    activities: ['safari', 'train', 'whale'],
    transfer: 'private',
    pickupAirport: true,
    style: 'balanced',
  });

  const set = (patch: Partial<TripData>) => setTrip((t) => ({ ...t, ...patch }));

  const itinerary = useMemo(() => buildItinerary(trip), [trip]);

  return (
    <main style={{ background: 'var(--paper)' }}>
      <SubHero
        crumbs={['TourLand', 'Plan your tour']}
        eyebrow="Tour planner"
        title="Build your route in four steps."
        img={U('1604920900522-43c8e2ce7027', 2000)}
      />

      <section className="container" style={{ paddingTop: 48, paddingBottom: 120 }}>
        {/* Progress */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: 0,
            marginBottom: 48,
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-lg)',
            overflow: 'hidden',
            background: 'var(--bone)',
          }}
        >
          {PLANNER_STEPS.map((s) => {
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            return (
              <button
                key={s.n}
                onClick={() => setStep(s.n)}
                style={{
                  padding: isMobile ? '14px 12px' : '22px 24px',
                  textAlign: 'left',
                  background: step === s.n ? 'var(--ink)' : 'transparent',
                  color: step === s.n ? 'var(--bone)' : 'var(--ink)',
                  borderRight: s.n < 4 ? '1px solid var(--line-2)' : 'none',
                  transition: 'all .2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? 8 : 16,
                  cursor: 'pointer',
                  border: 'none',
                  minHeight: 44,
                }}
              >
                <div
                  style={{
                    width: isMobile ? 32 : 36,
                    height: isMobile ? 32 : 36,
                    borderRadius: '50%',
                    background: step === s.n ? 'var(--sunset)' : 'var(--paper)',
                    color: step === s.n ? 'var(--ink)' : 'var(--mute)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 600,
                    fontSize: isMobile ? 12 : 14,
                    flexShrink: 0,
                  }}
                >
                  {step > s.n ? '✓' : `0${s.n}`}
                </div>
                {!isMobile && (
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        opacity: 0.6,
                      }}
                    >
                      Step 0{s.n}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-.01em', marginTop: 2 }}>
                      {s.t}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="planner-grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 48, alignItems: 'start' }}>
          <div
            style={{
              padding: 48,
              background: 'var(--bone)',
              borderRadius: 'var(--r-xl)',
              border: '1px solid var(--line-2)',
            }}
          >
            {step === 1 && <Step1Dates trip={trip} set={set} />}
            {step === 2 && <Step2Regions trip={trip} set={set} />}
            {step === 3 && <Step3Activities trip={trip} set={set} />}
            {step === 4 && <Step4Transfer trip={trip} set={set} />}

            <div
              className="mt-8 flex"
              style={{
                justifyContent: 'space-between',
                paddingTop: 32,
                borderTop: '1px solid var(--line-2)',
              }}
            >
              <button
                className="btn btn-light"
                disabled={step <= 1}
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                style={{ opacity: step <= 1 ? 0.4 : 1 }}
              >
                ← Back
              </button>
              {step < 4 ? (
                <button className="btn btn-primary" onClick={() => setStep((s) => Math.min(4, s + 1))}>
                  Continue <span className="arrow">→</span>
                </button>
              ) : (
                <button className="btn btn-primary" onClick={() => setStep(5)}>
                  Review & book <span className="arrow">→</span>
                </button>
              )}
            </div>

            <div className="mt-3 mute" style={{ fontSize: 12, textAlign: 'right' }}>
              Auto-saved to your draft · last edit just now
            </div>
          </div>

          {/* Sidebar — live itinerary */}
          <ItinerarySidebar trip={trip} itinerary={itinerary} step={step} />
        </div>

        {/* Final review */}
        {step >= 5 && <FinalReview trip={trip} itinerary={itinerary} />}
      </section>
    </main>
  );
}

/* ---------- Step 1: Dates ---------- */
function Step1Dates({
  trip,
  set,
}: {
  trip: TripData;
  set: (patch: Partial<TripData>) => void;
}) {
  return (
    <div>
      <div className="eyebrow">Step 01</div>
      <h2 className="h-3 mt-2">When are you going?</h2>
      <p className="mute mt-2" style={{ maxWidth: 520 }}>
        Most travellers spend 10–14 days. Two weeks is the sweet spot to see two coasts plus the Hill Country at an unhurried pace.
      </p>

      <div className="grid mt-6" style={{ gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="field">
          <label>Start date</label>
          <input
            type="date"
            value={trip.startDate}
            onChange={(e) => set({ startDate: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Duration · {trip.days} days</label>
          <input
            type="range"
            min="5"
            max="28"
            value={trip.days}
            onChange={(e) => set({ days: +e.target.value })}
            style={{ padding: 0, background: 'transparent', border: 0, marginTop: 14 }}
          />
          <div
            className="mono"
            style={{
              color: 'var(--mute)',
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 4,
            }}
          >
            <span>5</span>
            <span>28</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="eyebrow">Travellers</div>
        <div className="grid mt-2" style={{ gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {(['adults', 'children'] as const).map((k) => (
            <div
              key={k}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r)',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>
                  {k}
                </div>
                <div className="mono" style={{ color: 'var(--mute)' }}>
                  {k === 'adults' ? '13+' : '2–12'}
                </div>
              </div>
              <div className="flex gap-2" style={{ alignItems: 'center' }}>
                <button
                  onClick={() =>
                    set({
                      travellers: {
                        ...trip.travellers,
                        [k]: Math.max(k === 'adults' ? 1 : 0, trip.travellers[k] - 1),
                      },
                    })
                  }
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--paper)',
                    border: '1px solid var(--line)',
                    cursor: 'pointer',
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    minWidth: 24,
                    textAlign: 'center',
                    fontWeight: 500,
                  }}
                >
                  {trip.travellers[k]}
                </span>
                <button
                  onClick={() =>
                    set({
                      travellers: {
                        ...trip.travellers,
                        [k]: trip.travellers[k] + 1,
                      },
                    })
                  }
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--paper)',
                    border: '1px solid var(--line)',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="eyebrow">Trip style</div>
        <div className="grid mt-2" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {(
            [
              ['relaxed' as const, 'Relaxed', 'Slow pace, beach days'],
              ['balanced' as const, 'Balanced', 'A bit of everything'],
              ['packed' as const, 'Packed', 'See as much as possible'],
            ] as const
          ).map(([k, t, d]) => (
            <button
              key={k}
              onClick={() => set({ style: k })}
              style={{
                padding: '18px 18px',
                textAlign: 'left',
                borderRadius: 'var(--r)',
                background: trip.style === k ? 'var(--ink)' : 'var(--paper)',
                color: trip.style === k ? 'var(--bone)' : 'var(--ink)',
                border: '1px solid ' + (trip.style === k ? 'var(--ink)' : 'var(--line)'),
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 500 }}>{t}</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Step 2: Regions ---------- */
function Step2Regions({
  trip,
  set,
}: {
  trip: TripData;
  set: (patch: Partial<TripData>) => void;
}) {
  const totalDays = TOUR_REGIONS.filter((r) => trip.regions.includes(r.id)).reduce(
    (a, r) => a + r.days,
    0
  );
  const toggle = (id: string) =>
    set({
      regions: trip.regions.includes(id)
        ? trip.regions.filter((x) => x !== id)
        : [...trip.regions, id],
    });

  return (
    <div>
      <div className="eyebrow">Step 02</div>
      <h2 className="h-3 mt-2">Pick your regions.</h2>
      <p className="mute mt-2" style={{ maxWidth: 520 }}>
        Drag to reorder, click to toggle. The classic route runs Colombo → Cultural Triangle → Hill Country → South Coast.
      </p>

      <div className="mt-6 flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="mono">
          <span style={{ color: 'var(--ink)', fontSize: 18, fontWeight: 500 }}>
            {totalDays}
          </span>{' '}
          <span className="mute">/ {trip.days} days planned</span>
        </div>
        <button
          className="btn btn-light btn-sm"
          onClick={() =>
            set({
              regions: ['colombo', 'sigiriya', 'kandy', 'ella', 'mirissa'],
            })
          }
        >
          Reset to classic
        </button>
      </div>

      <div className="grid mt-3" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {TOUR_REGIONS.map((r) => {
          const on = trip.regions.includes(r.id);
          return (
            <button
              key={r.id}
              onClick={() => toggle(r.id)}
              style={{
                padding: '18px 20px',
                textAlign: 'left',
                borderRadius: 'var(--r)',
                background: on ? 'var(--ink)' : 'var(--paper)',
                color: on ? 'var(--bone)' : 'var(--ink)',
                border: '1px solid ' + (on ? 'var(--ink)' : 'var(--line)'),
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 12,
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-.01em' }}>
                  {r.name}
                </div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                  {r.blurb}
                </div>
              </div>
              <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', opacity: 0.8 }}>
                {r.days}d
              </div>
            </button>
          );
        })}
      </div>

      {totalDays !== trip.days && (
        <div
          className="mt-4"
          style={{
            padding: '14px 18px',
            background:
              totalDays > trip.days
                ? 'rgba(217,119,66,.1)'
                : 'rgba(31,138,138,.08)',
            borderRadius: 'var(--r)',
            fontSize: 13,
            color: 'var(--ink)',
          }}
        >
          {totalDays > trip.days
            ? `↘ ${totalDays - trip.days} days over. Drop a region, or extend your trip.`
            : `${trip.days - totalDays} days unfilled — add a region, or we'll pad with beach time.`}
        </div>
      )}
    </div>
  );
}

/* ---------- Step 3: Activities ---------- */
function Step3Activities({
  trip,
  set,
}: {
  trip: TripData;
  set: (patch: Partial<TripData>) => void;
}) {
  const toggle = (id: string) =>
    set({
      activities: trip.activities.includes(id)
        ? trip.activities.filter((x) => x !== id)
        : [...trip.activities, id],
    });

  return (
    <div>
      <div className="eyebrow">Step 03</div>
      <h2 className="h-3 mt-2">Choose your experiences.</h2>
      <p className="mute mt-2" style={{ maxWidth: 520 }}>
        We'll slot these into your itinerary on the appropriate days. Add or remove anytime — your draft auto-saves.
      </p>

      <div className="grid mt-6" style={{ gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {ACTIVITIES.map((a) => {
          const on = trip.activities.includes(a.id);
          return (
            <button
              key={a.id}
              onClick={() => toggle(a.id)}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                gap: 16,
                alignItems: 'center',
                textAlign: 'left',
                padding: 0,
                borderRadius: 'var(--r)',
                overflow: 'hidden',
                background: on ? 'var(--ink)' : 'var(--paper)',
                color: on ? 'var(--bone)' : 'var(--ink)',
                border: '1px solid ' + (on ? 'var(--ink)' : 'var(--line)'),
                cursor: 'pointer',
              }}
            >
              <img
                src={a.img}
                alt=""
                style={{ width: 80, height: 80, objectFit: 'cover' }}
              />
              <div style={{ padding: '14px 0' }}>
                <div
                  style={{
                    fontSize: 11,
                    opacity: 0.6,
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {a.category} · {a.duration}
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, marginTop: 3 }}>
                  {a.name}
                </div>
              </div>
              <div
                style={{
                  padding: '14px 20px 14px 0',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  opacity: 0.8,
                }}
              >
                {on ? '✓' : '+'} {a.price.replace('from ', '').replace('Guide ', '')}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Step 4: Transfer ---------- */
function Step4Transfer({
  trip,
  set,
}: {
  trip: TripData;
  set: (patch: Partial<TripData>) => void;
}) {
  return (
    <div>
      <div className="eyebrow">Step 04</div>
      <h2 className="h-3 mt-2">Airport pickup & transfers.</h2>
      <p className="mute mt-2" style={{ maxWidth: 520 }}>
        The driver is the same person for your whole trip. They know the roads, the lunch spots, and which sambol is the spiciest.
      </p>

      <div className="mt-6 grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {(
          [
            ['private' as const, 'Private car & driver', 'A/C sedan, English-speaking, your whole trip', '+$0 (incl.)'],
            ['suv' as const, 'Premium SUV', 'More space, same driver-guide', '+$280'],
            ['ev' as const, 'Electric car', 'Same service, zero emissions', '+$190'],
          ] as const
        ).map(([k, t, d, p]) => (
          <button
            key={k}
            onClick={() => set({ transfer: k })}
            style={{
              padding: '22px 22px',
              textAlign: 'left',
              borderRadius: 'var(--r)',
              background: trip.transfer === k ? 'var(--ink)' : 'var(--paper)',
              color: trip.transfer === k ? 'var(--bone)' : 'var(--ink)',
              border: '1px solid ' + (trip.transfer === k ? 'var(--ink)' : 'var(--line)'),
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 500 }}>{t}</div>
            <div
              style={{
                fontSize: 13,
                opacity: 0.7,
                margin: '6px 0 14px',
                lineHeight: 1.45,
              }}
            >
              {d}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{p}</div>
          </button>
        ))}
      </div>

      <div
        className="mt-6"
        style={{
          padding: '24px 28px',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r)',
          background: 'var(--paper)',
        }}
      >
        <label
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            gap: 16,
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              border: '2px solid ' + (trip.pickupAirport ? 'var(--ink)' : 'var(--line)'),
              background: trip.pickupAirport ? 'var(--ink)' : 'transparent',
              color: 'var(--bone)',
              display: 'grid',
              placeItems: 'center',
              fontSize: 14,
            }}
          >
            {trip.pickupAirport ? '✓' : ''}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>
              Airport pickup at CMB · Bandaranaike Intl
            </div>
            <div className="mute" style={{ fontSize: 13, marginTop: 4 }}>
              Meet & greet at arrivals with a TourLand sign · 24/7 monitoring of your flight
            </div>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            + $35
          </div>
          <input
            type="checkbox"
            checked={trip.pickupAirport}
            onChange={(e) => set({ pickupAirport: e.target.checked })}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div
        className="mt-3"
        style={{
          padding: '18px 22px',
          background: 'rgba(31,138,138,.08)',
          borderRadius: 'var(--r)',
          fontSize: 13,
        }}
      >
        <strong>Drop-off:</strong> we'll get you back to CMB for your return flight. No extra charge.
      </div>
    </div>
  );
}

/* ---------- Itinerary builder ---------- */
function buildItinerary(trip: TripData): ItineraryDay[] {
  const picks = TOUR_REGIONS.filter((r) => trip.regions.includes(r.id));
  const ordered = trip.regions
    .map((id) => picks.find((r) => r.id === id))
    .filter((r): r is TourRegion => r !== undefined);

  const totalAllocated = ordered.reduce((a, r) => a + r.days, 0);
  const scale = trip.days / Math.max(1, totalAllocated);
  const days: ItineraryDay[] = [];
  let dayNo = 1;
  const start = new Date(trip.startDate);

  ordered.forEach((r, ri) => {
    const allocated = Math.max(1, Math.round(r.days * scale));
    for (let i = 0; i < allocated && dayNo <= trip.days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + dayNo - 1);
      const isFirst = i === 0;
      const isLast = i === allocated - 1;
      days.push({
        day: dayNo,
        date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        region: r.name,
        title:
          isFirst && dayNo === 1
            ? `Arrive in ${r.name}`
            : isFirst
              ? `${r.name} · arrive from ${ordered[ri - 1]?.name || ''}`
              : isLast && ri < ordered.length - 1
                ? `${r.name} · transfer to ${ordered[ri + 1]?.name}`
                : `${r.name} · day ${i + 1}`,
        activities: relevantActivities(r.id, trip.activities, isFirst),
      });
      dayNo++;
    }
  });

  while (dayNo <= trip.days) {
    const date = new Date(start);
    date.setDate(start.getDate() + dayNo - 1);
    days.push({
      day: dayNo,
      date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      region: 'Beach time',
      title: 'Free day · Mirissa',
      activities: ['Surf, swim, sundowner.'],
    });
    dayNo++;
  }

  return days.slice(0, trip.days);
}

function relevantActivities(
  regionId: string,
  picked: string[],
  isFirst: boolean
): string[] {
  const map: Record<string, string[]> = {
    sigiriya: ['safari', 'perahera'],
    kandy: ['train', 'perahera', 'cook'],
    nuwaraeliya: ['cook', 'train'],
    ella: ['train', 'hike'],
    yala: ['safari'],
    mirissa: ['whale', 'cook'],
    trinco: ['whale'],
    colombo: [],
  };

  const local = (map[regionId] || []).filter((id) => picked.includes(id));
  const named = local
    .map((id) => ACTIVITIES.find((a) => a.id === id)?.name)
    .filter((n): n is string => n !== undefined);

  if (isFirst && regionId === 'colombo') {
    return [
      'Airport pickup at CMB',
      'Galle Face Hotel high tea',
      'Sunset on Galle Face Green',
    ];
  }

  if (named.length === 0) {
    return regionId === 'kandy'
      ? ['Temple of the Tooth · evening puja']
      : regionId === 'ella'
        ? ['Little Adam\'s Peak hike at dawn']
        : regionId === 'mirissa'
          ? ['Sundowner at Coconut Tree Hill']
          : regionId === 'sigiriya'
            ? ['Climb Sigiriya rock at dawn']
            : ['Free exploration · driver on call'];
  }

  return named;
}

/* ---------- Itinerary sidebar ---------- */
function ItinerarySidebar({
  trip,
  itinerary,
  step,
}: {
  trip: TripData;
  itinerary: ItineraryDay[];
  step: number;
}) {
  const startD = new Date(trip.startDate);
  const endD = new Date(startD);
  endD.setDate(startD.getDate() + trip.days - 1);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const base =
    trip.days * 165 * trip.travellers.adults + trip.days * 95 * trip.travellers.children;
  const transferAdd = trip.transfer === 'suv' ? 280 : trip.transfer === 'ev' ? 190 : 0;
  const pickup = trip.pickupAirport ? 35 : 0;
  const activityAdd = trip.activities.length * 65;
  const total = base + transferAdd + pickup + activityAdd;

  return (
    <aside
      style={{
        position: 'sticky',
        top: 96,
        borderRadius: 'var(--r-xl)',
        overflow: 'hidden',
        background: 'var(--ink)',
        color: 'var(--bone)',
        border: '1px solid var(--ink)',
      }}
    >
      <div style={{ padding: '28px 28px 0' }}>
        <div className="eyebrow on-dark">Your trip</div>
        <h3 className="h-3 mt-2" style={{ color: 'var(--bone)', marginTop: 8 }}>
          {trip.days}-day{trip.days > 1 ? 's' : ''} in Sri Lanka
        </h3>
        <div className="mono" style={{ color: 'rgba(248,244,234,.6)', marginTop: 8 }}>
          {fmt(startD)} → {fmt(endD)} · {trip.travellers.adults}A{' '}
          {trip.travellers.children > 0 ? `+ ${trip.travellers.children}C` : ''} ·{' '}
          {trip.style}
        </div>
      </div>
      <div className="divider-dark" style={{ marginTop: 24 }} />

      <div style={{ padding: '24px 28px', maxHeight: 520, overflowY: 'auto' }}>
        <div className="eyebrow on-dark" style={{ marginBottom: 16 }}>
          Itinerary
        </div>
        <ol
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {itinerary.map((day, i) => (
            <li
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr',
                gap: 12,
                paddingBottom: 14,
                borderBottom: '1px solid rgba(248,244,234,.08)',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'rgba(248,244,234,.5)',
                    letterSpacing: '.08em',
                  }}
                >
                  DAY
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {String(day.day).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(248,244,234,.4)', marginTop: 2 }}>
                  {day.date}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--bone)' }}>
                  {day.title}
                </div>
                <ul style={{ margin: '6px 0 0', padding: 0, listStyle: 'none' }}>
                  {day.activities.map((a, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: 12,
                        color: 'rgba(248,244,234,.65)',
                        padding: '2px 0',
                      }}
                    >
                      · {a}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="divider-dark" />
      <div style={{ padding: '24px 28px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 6,
          }}
        >
          <span style={{ color: 'rgba(248,244,234,.7)', fontSize: 13 }}>
            Estimated total
          </span>
          <span style={{ fontSize: 13, color: 'rgba(248,244,234,.5)' }}>USD</span>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 42,
            fontWeight: 500,
            letterSpacing: '-.025em',
            lineHeight: 1,
          }}
        >
          ${total.toLocaleString()}
        </div>
        <div
          className="mono"
          style={{
            color: 'rgba(248,244,234,.5)',
            marginTop: 6,
          }}
        >
          For {trip.travellers.adults} adult{trip.travellers.adults > 1 ? 's' : ''}
          {trip.travellers.children > 0
            ? ` + ${trip.travellers.children} child${trip.travellers.children > 1 ? 'ren' : ''}`
            : ''}{' '}
          · all-in
        </div>

        <div
          style={{
            marginTop: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            fontSize: 12,
            color: 'rgba(248,244,234,.6)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Land arrangements</span>
            <span>${base.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Experiences ×{trip.activities.length}</span>
            <span>${activityAdd}</span>
          </div>
          {transferAdd > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Transfer upgrade</span>
              <span>${transferAdd}</span>
            </div>
          )}
          {pickup > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Airport pickup</span>
              <span>${pickup}</span>
            </div>
          )}
        </div>

        <div style={{ marginTop: 22, display: 'flex', gap: 8 }}>
          <button
            className="btn btn-on-dark"
            style={{ flex: 1 }}
            onClick={() => {
              if (step >= 4) {
                openWhatsApp({
                  message: createTripInquiryMessage({
                    duration: trip.days,
                    travelers: trip.travellers,
                    regions: trip.regions,
                    startDate: trip.startDate,
                  })
                });
              } else {
                alert('✓ Draft saved automatically!');
              }
            }}
          >
            {step >= 4 ? '💬 WhatsApp us' : 'Save draft'}
          </button>
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => generateTripPDF(trip, itinerary, `tourland-trip-${trip.days}days.pdf`)}
          >
            PDF
          </button>
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'rgba(248,244,234,.45)',
            marginTop: 10,
            textAlign: 'center',
          }}
        >
          Free cancellation up to 30 days before departure.
        </div>
      </div>
    </aside>
  );
}

/* ---------- Final review ---------- */
function FinalReview({ trip, itinerary }: { trip: TripData; itinerary: ItineraryDay[] }) {
  return (
    <div
      className="mt-8"
      style={{
        padding: 48,
        background: 'var(--ink)',
        color: 'var(--bone)',
        borderRadius: 'var(--r-xl)',
      }}
    >
      <div className="eyebrow on-dark">✓ Draft ready</div>
      <h3 className="h-2 mt-2" style={{ color: 'var(--bone)' }}>
        Your draft is saved.
      </h3>
      <p
        style={{
          color: 'rgba(248,244,234,.7)',
          maxWidth: 640,
          fontSize: 16,
          marginTop: 14,
        }}
      >
        A real planner — Sandali in Colombo — will read this draft within four hours and reply with refinements: hotel availability, road conditions, season-specific notes.
      </p>
      <div className="flex gap-3 mt-6">
        <button
          className="btn btn-on-dark btn-lg"
          onClick={() => {
            openWhatsApp({
              message: createTripInquiryMessage({
                duration: trip.days,
                travelers: trip.travellers,
                regions: trip.regions,
                startDate: trip.startDate,
              })
            });
          }}
        >
          💬 WhatsApp to confirm
        </button>
        <button
          className="btn btn-outline-dark btn-lg"
          onClick={() => generateTripPDF(trip, itinerary, `tourland-trip-${trip.days}days.pdf`)}
        >
          📄 Download PDF
        </button>
      </div>
    </div>
  );
}
