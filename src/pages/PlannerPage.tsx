import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { SubHero } from '../components';
import { ACTIVITIES, VEHICLES, DAILY_KM_ALLOWANCE } from '../data';
import { generateTripPDF } from '../utils/pdf';
import { openWhatsApp, createTripInquiryMessage, createBookingMessage } from '../utils/whatsapp';
import { openBookingEmail, BOOKING_EMAIL } from '../utils/email';
import type { VehicleId, TouristDetails, BookingDetails } from '../types';

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
  lat: number;
  lng: number;
}

interface TripData {
  startDate: string;
  days: number;
  travellers: { adults: number; children: number };
  regions: string[];
  activities: string[];
  vehicle: VehicleId;
  estKm: number;
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
  { n: 4, t: 'Vehicle', d: 'Choose your ride.' },
];

const TOUR_REGIONS: TourRegion[] = [
  { id: 'colombo', name: 'Colombo', days: 1, blurb: 'Arrival, dinner on Galle Face.', lat: 6.93, lng: 79.85 },
  { id: 'sigiriya', name: 'Sigiriya & Dambulla', days: 2, blurb: 'Rock fortress, cave temples, balloon ride.', lat: 7.95, lng: 80.75 },
  { id: 'kandy', name: 'Kandy', days: 2, blurb: 'Temple of the Tooth, lakeside walks.', lat: 7.29, lng: 80.64 },
  { id: 'nuwaraeliya', name: 'Nuwara Eliya', days: 1, blurb: 'Tea estates, Pedro factory tour.', lat: 6.97, lng: 80.78 },
  { id: 'ella', name: 'Ella', days: 2, blurb: 'Nine Arches Bridge, Little Adam\'s Peak.', lat: 6.87, lng: 81.05 },
  { id: 'yala', name: 'Yala / Udawalawe', days: 2, blurb: 'Leopard or elephant safari, jungle lodge.', lat: 6.37, lng: 81.42 },
  { id: 'mirissa', name: 'Mirissa & Galle', days: 3, blurb: 'Whales, fort, beach down-time.', lat: 5.95, lng: 80.46 },
  { id: 'trinco', name: 'Trincomalee', days: 2, blurb: 'East-coast reefs and quiet bays.', lat: 8.58, lng: 81.21 },
];

/* Which experiences actually happen in each region — an activity is only
   offered (or mentioned in the itinerary) when its destination is on the tour. */
const REGION_ACTIVITIES: Record<string, string[]> = {
  colombo: [],
  sigiriya: [],
  kandy: ['train', 'perahera', 'cook'],
  nuwaraeliya: ['train', 'cook', 'hike'],
  ella: ['train', 'hike'],
  yala: ['safari'],
  mirissa: ['whale', 'cook'],
  trinco: ['whale'],
};

const activitiesAvailableFor = (regionIds: string[]): string[] =>
  Array.from(new Set(regionIds.flatMap((id) => REGION_ACTIVITIES[id] ?? [])));

/* ---------- Rough distance estimate from selected regions ---------- */
const CMB_AIRPORT = { lat: 7.18, lng: 79.88 };
const ROAD_WINDING_FACTOR = 1.4; // straight-line → real Sri Lankan roads
const LOCAL_KM_PER_DAY = 25; // sightseeing driving around each base

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function estimateRouteKm(regionIds: string[], days: number): number {
  const stops = regionIds
    .map((id) => TOUR_REGIONS.find((r) => r.id === id))
    .filter((r): r is TourRegion => r !== undefined);
  const route = [CMB_AIRPORT, ...stops, CMB_AIRPORT];
  let km = 0;
  for (let i = 1; i < route.length; i++) {
    km += haversineKm(route[i - 1], route[i]) * ROAD_WINDING_FACTOR;
  }
  km += days * LOCAL_KM_PER_DAY;
  return Math.ceil(km / 50) * 50;
}

/* ---------- Pricing (per vehicle, never per person) ---------- */
const ADVANCE_RATE = 0.1; // 10% advance confirms the booking
const ADVANCE_DAYS_BEFORE = 14; // due two weeks before the tour

function tripPricing(trip: TripData) {
  const vehicle = VEHICLES.find((x) => x.id === trip.vehicle) ?? VEHICLES[1];
  const base = trip.days * vehicle.perDay;
  const includedKm = trip.days * DAILY_KM_ALLOWANCE;
  const routeKm = trip.estKm > 0 ? trip.estKm : estimateRouteKm(trip.regions, trip.days);
  const extraKm = Math.max(0, routeKm - includedKm);
  const extraKmCharge = Math.round(extraKm * (vehicle.perDay / DAILY_KM_ALLOWANCE));
  const total = base + extraKmCharge;
  const advance = Math.round(total * ADVANCE_RATE);
  return { vehicle, base, includedKm, routeKm, extraKm, extraKmCharge, total, advance };
}

function advanceDueDate(startDate: string): Date {
  const d = new Date(startDate);
  d.setDate(d.getDate() - ADVANCE_DAYS_BEFORE);
  return d;
}

function todayIsoDate(): string {
  const today = new Date();
  return [today.getFullYear(), today.getMonth() + 1, today.getDate()]
    .map((part, index) => index === 0 ? String(part) : String(part).padStart(2, '0'))
    .join('-');
}

const fmtLong = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

function parseDateRange(value: string): { startDate: string; days: number } {
  const match = value.match(/^([A-Za-z]{3}) (\d{1,2}) – (?:(\w{3}) )?(\d{1,2}), (\d{4})$/);
  if (!match) return { startDate: todayIsoDate(), days: 15 };

  const [, startMonth, startDay, endMonth = startMonth, endDay, year] = match;
  const start = new Date(`${startMonth} ${startDay}, ${year}`);
  const end = new Date(`${endMonth} ${endDay}, ${year}`);
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
  const localStartDate = [start.getFullYear(), start.getMonth() + 1, start.getDate()]
    .map((part, index) => index === 0 ? String(part) : String(part).padStart(2, '0'))
    .join('-');
  return { startDate: localStartDate, days };
}

const HERO_DESTINATION_IDS: Record<string, string> = {
  Sigiriya: 'sigiriya',
  Ella: 'ella',
  'Yala National Park': 'yala',
  Mirissa: 'mirissa',
  Kandy: 'kandy',
  'Nuwara Eliya': 'nuwaraeliya',
  Trincomalee: 'trinco',
};

export function PlannerPage() {
  const location = useLocation();
  const booking = location.state as { destination?: string; dateRange?: string; travellers?: string; style?: string } | null;
  const selectedDates = parseDateRange(booking?.dateRange ?? '');
  const destinationId = HERO_DESTINATION_IDS[booking?.destination ?? ''] ?? 'colombo';
  const adults = Number.parseInt(booking?.travellers ?? '2', 10) || 2;
  const tripStyle: TripData['style'] = booking?.style === 'Nature & wildlife' ? 'packed' : booking?.style === 'Family · kids' ? 'relaxed' : 'balanced';
  const [step, setStep] = useState<number>(1);
  const [trip, setTrip] = useState<TripData>({
    startDate: selectedDates.startDate,
    days: selectedDates.days,
    travellers: { adults, children: 0 },
    regions: [destinationId],
    activities: [],
    vehicle: 'sedan',
    estKm: 0,
    pickupAirport: true,
    style: tripStyle,
  });

  const set = (patch: Partial<TripData>) => setTrip((t) => ({ ...t, ...patch }));

  const itinerary = useMemo(() => buildItinerary(trip), [trip]);

  return (
    <main style={{ background: 'var(--paper)' }}>
      <SubHero
        crumbs={['Modotravels', 'Plan your tour']}
        eyebrow="Tour planner"
        title="Build your route in four steps."
        img="https://images.unsplash.com/photo-1612862862126-865765df2ded?w=1600&q=72&auto=format&fit=crop"
      />

      <section className="container" style={{ paddingTop: 48, paddingBottom: 120, marginTop: 12, marginBottom: 8 }}>
        {/* Progress */}
        <div className="planner-steps">
          {PLANNER_STEPS.map((s) => (
            <button
              key={s.n}
              onClick={() => setStep(s.n)}
              className={'planner-step' + (step === s.n ? ' is-active' : '')}
            >
              <div className="planner-step-num">{step > s.n ? '✓' : `0${s.n}`}</div>
              <div className="planner-step-label">
                <div className="planner-step-eyebrow">Step 0{s.n}</div>
                <div className="planner-step-title">{s.t}</div>
              </div>
            </button>
          ))}
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
            {step >= 4 && <Step4Transfer trip={trip} set={set} />}

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
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setStep(5);
                    setTimeout(
                      () => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }),
                      80
                    );
                  }}
                >
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
            min={todayIsoDate()}
            onChange={(e) => set({ startDate: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Duration · {trip.days} days</label>
          <input
            type="range"
            min="1"
            max="28"
            value={trip.days}
            onChange={(e) => {
              const days = +e.target.value;
              const regions = trip.regions.slice(0, days);
              const allowed = activitiesAvailableFor(regions);
              set({ days, regions, activities: trip.activities.filter((a) => allowed.includes(a)) });
            }}
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
            <span>1</span>
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
  const atCap = trip.regions.length >= trip.days;
  const setRegions = (regions: string[]) => {
    const allowed = activitiesAvailableFor(regions);
    set({ regions, activities: trip.activities.filter((a) => allowed.includes(a)) });
  };
  const toggle = (id: string) => {
    const selected = trip.regions.includes(id);
    if (!selected && atCap) return;
    setRegions(selected ? trip.regions.filter((x) => x !== id) : [...trip.regions, id]);
  };

  return (
    <div>
      <div className="eyebrow">Step 02</div>
      <h2 className="h-3 mt-2">Pick your regions.</h2>
      <p className="mute mt-2" style={{ maxWidth: 520 }}>
        Each destination needs at least one full day, so a {trip.days}-day trip fits up to {trip.days} {trip.days === 1 ? 'stop' : 'stops'}. The classic route runs Colombo → Cultural Triangle → Hill Country → South Coast.
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
            setRegions(['colombo', 'sigiriya', 'kandy', 'ella', 'mirissa'].slice(0, trip.days))
          }
        >
          Reset to classic
        </button>
      </div>

      <div className="grid mt-3" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {TOUR_REGIONS.map((r) => {
          const on = trip.regions.includes(r.id);
          const blocked = !on && atCap;
          return (
            <button
              key={r.id}
              onClick={() => toggle(r.id)}
              disabled={blocked}
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
                cursor: blocked ? 'not-allowed' : 'pointer',
                opacity: blocked ? 0.45 : 1,
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

      {atCap ? (
        <div
          className="mt-4"
          style={{
            padding: '14px 18px',
            background: 'rgba(31,138,138,.08)',
            borderRadius: 'var(--r)',
            fontSize: 13,
            color: 'var(--ink)',
          }}
        >
          Your {trip.days}-day trip is full — one destination per day. Extend the duration in Step 1 to add more stops.
        </div>
      ) : totalDays !== trip.days && (
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

  const availableIds = activitiesAvailableFor(trip.regions);
  const available = ACTIVITIES.filter((a) => availableIds.includes(a.id));

  return (
    <div>
      <div className="eyebrow">Step 03</div>
      <h2 className="h-3 mt-2">Choose your experiences.</h2>
      <p className="mute mt-2" style={{ maxWidth: 520 }}>
        We'll slot these into your itinerary on the appropriate days. Only experiences available in your selected destinations are shown.
      </p>

      {available.length === 0 && (
        <div
          className="mt-6"
          style={{
            padding: '18px 20px',
            background: 'rgba(31,138,138,.08)',
            borderRadius: 'var(--r)',
            fontSize: 14,
            color: 'var(--ink)',
            maxWidth: 560,
          }}
        >
          No signature experiences in your selected destinations yet. Go back to Step 2 and add stops like Yala, Kandy, Ella, or Mirissa to unlock safaris, the hill-country train, and whale watching.
        </div>
      )}

      <div className="grid mt-6" style={{ gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {available.map((a) => {
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
                {on ? '✓ Added' : '+ Add'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Step 4: Vehicle ---------- */
function Step4Transfer({
  trip,
  set,
}: {
  trip: TripData;
  set: (patch: Partial<TripData>) => void;
}) {
  const v = VEHICLES.find((x) => x.id === trip.vehicle) ?? VEHICLES[1];
  const includedKm = trip.days * DAILY_KM_ALLOWANCE;
  const perKm = v.perDay / DAILY_KM_ALLOWANCE;
  const autoKm = estimateRouteKm(trip.regions, trip.days);
  const effKm = trip.estKm > 0 ? trip.estKm : autoKm;
  const extraKm = Math.max(0, effKm - includedKm);

  return (
    <div>
      <div className="eyebrow">Step 04</div>
      <h2 className="h-3 mt-2">Choose your vehicle.</h2>
      <p className="mute mt-2" style={{ maxWidth: 520 }}>
        You pay for the vehicle, not per person. Every option comes with a private driver and {DAILY_KM_ALLOWANCE} km per day — pooled across your whole tour, so a quiet beach day banks kilometres for a big travel day.
      </p>

      <div className="mt-6 grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {VEHICLES.map((veh) => {
          const on = trip.vehicle === veh.id;
          return (
            <button
              key={veh.id}
              onClick={() => set({ vehicle: veh.id })}
              style={{
                padding: '22px 22px',
                textAlign: 'left',
                borderRadius: 'var(--r)',
                background: on ? 'var(--ink)' : 'var(--paper)',
                color: on ? 'var(--bone)' : 'var(--ink)',
                border: '1px solid ' + (on ? 'var(--ink)' : 'var(--line)'),
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 500 }}>{veh.name}</div>
              <div className="mono" style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>
                {veh.seats}
              </div>
              <div
                style={{
                  fontSize: 13,
                  opacity: 0.7,
                  margin: '6px 0 14px',
                  lineHeight: 1.45,
                }}
              >
                {veh.blurb}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                ${veh.perDay} / day · {DAILY_KM_ALLOWANCE} km incl.
              </div>
            </button>
          );
        })}
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 14,
          }}
        >
          <div>
            <div className="eyebrow">Rough route estimate</div>
            <div className="mute" style={{ fontSize: 12, marginTop: 4 }}>
              Airport → {trip.regions.length} region{trip.regions.length !== 1 ? 's' : ''} in your order → airport, plus local driving
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
            ~{autoKm.toLocaleString()} km
          </div>
        </div>
        <div className="field" style={{ maxWidth: 320 }}>
          <label>Or type your own estimate · km</label>
          <input
            type="number"
            min="0"
            step="50"
            value={trip.estKm || ''}
            placeholder={`~${autoKm.toLocaleString()} km (auto)`}
            onChange={(e) => set({ estKm: Math.max(0, +e.target.value || 0) })}
          />
        </div>
        <div className="mute" style={{ fontSize: 13, marginTop: 10, lineHeight: 1.5 }}>
          Your {trip.days}-day tour includes {includedKm.toLocaleString()} km. Beyond that, extra kilometres are charged at ${perKm.toFixed(2)}/km for the {v.name.toLowerCase()} (vehicle day rate ÷ {DAILY_KM_ALLOWANCE}).
          {extraKm > 0 ? (
            <>
              {' '}At ~{effKm.toLocaleString()} km, that's {extraKm.toLocaleString()} extra km ≈ ${Math.round(extraKm * perKm).toLocaleString()}.
            </>
          ) : (
            <> Your route fits inside the included distance — no extra charge.</>
          )}
        </div>
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
              Meet & greet at arrivals with a Modotravels sign · 24/7 monitoring of your flight
            </div>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Included
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

      <div
        className="mt-3"
        style={{
          padding: '18px 22px',
          background: 'rgba(217,119,66,.1)',
          borderRadius: 'var(--r)',
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        <strong>On request:</strong> tour guide, accommodation and meals can all be arranged for you — charged at cost, not included in the vehicle price. Tell us what you need and we'll quote it.
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

  const lastStop = ordered[ordered.length - 1];
  while (dayNo <= trip.days) {
    const date = new Date(start);
    date.setDate(start.getDate() + dayNo - 1);
    days.push({
      day: dayNo,
      date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      region: lastStop?.name ?? 'At leisure',
      title: lastStop ? `Free day · ${lastStop.name}` : 'Free day',
      activities: ['At leisure · driver on call.'],
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
  const local = (REGION_ACTIVITIES[regionId] || []).filter((id) => picked.includes(id));
  const named = local
    .map((id) => ACTIVITIES.find((a) => a.id === id)?.name)
    .filter((n): n is string => n !== undefined);

  if (isFirst && regionId === 'colombo') {
    return ['Airport pickup at CMB'];
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

  const { vehicle, base, includedKm, routeKm, extraKm, extraKmCharge, total } = tripPricing(trip);

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
          Per vehicle · not per person
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
            <span>{vehicle.name} × {trip.days} day{trip.days > 1 ? 's' : ''}</span>
            <span>${base.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Distance included</span>
            <span>{includedKm.toLocaleString()} km</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Est. route distance</span>
            <span>~{routeKm.toLocaleString()} km</span>
          </div>
          {extraKmCharge > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Extra {extraKm.toLocaleString()} km × ${(vehicle.perDay / DAILY_KM_ALLOWANCE).toFixed(2)}</span>
              <span>${extraKmCharge.toLocaleString()}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Airport pickup & drop-off</span>
            <span>Included</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            fontSize: 11,
            lineHeight: 1.5,
            color: 'rgba(248,244,234,.5)',
          }}
        >
          Guide, accommodation & meals arranged on request at cost. Activities quoted separately.
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
                    vehicle: vehicle.name,
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
            onClick={() => generateTripPDF({ ...trip, estKm: routeKm }, itinerary, `Modotravels-trip-${trip.days}days.pdf`)}
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

/* ---------- Final review & booking ---------- */
function FinalReview({ trip, itinerary }: { trip: TripData; itinerary: ItineraryDay[] }) {
  const [tourist, setTourist] = useState<TouristDetails>({
    name: '',
    country: '',
    email: '',
    phone: '',
  });
  const [booked, setBooked] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const p = tripPricing(trip);
  const start = new Date(trip.startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + trip.days - 1);
  const due = advanceDueDate(trip.startDate);
  const dueIsPast = due.getTime() < Date.now();
  const balance = p.total - p.advance;

  const regionNames = trip.regions
    .map((id) => TOUR_REGIONS.find((r) => r.id === id)?.name)
    .filter((n): n is string => n !== undefined);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tourist.email.trim());
  const fieldOk: Record<keyof TouristDetails, boolean> = {
    name: tourist.name.trim().length >= 2,
    country: tourist.country.trim().length >= 2,
    email: emailOk,
    phone: tourist.phone.trim().length >= 7,
  };
  const valid = fieldOk.name && fieldOk.country && fieldOk.email && fieldOk.phone;

  const booking: BookingDetails = {
    tourist: {
      name: tourist.name.trim(),
      country: tourist.country.trim(),
      email: tourist.email.trim(),
      phone: tourist.phone.trim(),
    },
    startDate: fmtLong(start),
    endDate: fmtLong(end),
    days: trip.days,
    travellers: trip.travellers,
    vehicleName: p.vehicle.name,
    vehiclePerDay: p.vehicle.perDay,
    regions: regionNames,
    routeKm: p.routeKm,
    includedKm: p.includedKm,
    extraKmCharge: p.extraKmCharge,
    total: p.total,
    advance: p.advance,
    advanceDueDate: dueIsPast ? 'now (tour starts in under two weeks)' : fmtLong(due),
  };

  const summary: [string, string][] = [
    ['Dates', `${fmtLong(start)} → ${fmtLong(end)}`],
    ['Duration', `${trip.days} day${trip.days > 1 ? 's' : ''}`],
    [
      'Travellers',
      `${trip.travellers.adults} adult${trip.travellers.adults > 1 ? 's' : ''}${trip.travellers.children > 0 ? ` + ${trip.travellers.children} child${trip.travellers.children > 1 ? 'ren' : ''}` : ''
      }`,
    ],
    ['Vehicle', `${p.vehicle.name} · $${p.vehicle.perDay}/day`],
    ['Est. distance', `~${p.routeKm.toLocaleString()} km`],
    ['Trip style', trip.style],
  ];

  const fields: { key: keyof TouristDetails; label: string; type: string; placeholder: string; error: string }[] = [
    { key: 'name', label: 'Full name *', type: 'text', placeholder: 'As in your passport', error: 'Please enter your full name.' },
    { key: 'country', label: 'Country *', type: 'text', placeholder: 'e.g. United Kingdom', error: 'Please enter your country.' },
    { key: 'email', label: 'Email *', type: 'email', placeholder: 'you@example.com', error: 'Please enter a valid email address.' },
    { key: 'phone', label: 'Contact number *', type: 'tel', placeholder: '+44 7700 900123', error: 'Please enter a valid contact number.' },
  ];

  return (
    <div id="booking" className="mt-8">
      {/* Full plan view */}
      <div
        style={{
          padding: 48,
          background: 'var(--bone)',
          borderRadius: 'var(--r-xl)',
          border: '1px solid var(--line-2)',
        }}
      >
        <div className="eyebrow">Step 05 · Review</div>
        <h3 className="h-2 mt-2">Your full tour plan.</h3>

        <div
          className="grid mt-6"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14 }}
        >
          {summary.map(([label, value]) => (
            <div
              key={label}
              style={{
                padding: '16px 18px',
                background: 'var(--paper)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r)',
              }}
            >
              <div className="eyebrow">{label}</div>
              <div style={{ marginTop: 6, fontWeight: 500, fontSize: 15, textTransform: label === 'Trip style' ? 'capitalize' : 'none' }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div>
            <div className="eyebrow">Route · {regionNames.join(' → ')}</div>
            <ol style={{ margin: '16px 0 0', padding: 0, listStyle: 'none' }}>
              {itinerary.map((day) => (
                <li
                  key={day.day}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '64px 1fr',
                    gap: 16,
                    padding: '12px 0',
                    borderBottom: '1px dashed var(--line)',
                    alignItems: 'baseline',
                  }}
                >
                  <div className="mono" style={{ color: 'var(--sunset)' }}>
                    Day {String(day.day).padStart(2, '0')}
                    <div style={{ fontSize: 10, color: 'var(--mute)', marginTop: 2 }}>{day.date}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{day.title}</div>
                    <div className="mute" style={{ fontSize: 13, marginTop: 2 }}>
                      {day.activities.join(' · ')}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Pricing breakdown */}

        </div>
        <div className="flex flex-col xl:flex-row gap-2 w-full mt-4">
          <div
            style={{
              padding: '24px 28px',
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r)',
              width: '100%',
            }}

          >
            <div className="eyebrow" style={{ marginBottom: 14 }}>Pricing · per vehicle, not per person</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{p.vehicle.name} × {trip.days} day{trip.days > 1 ? 's' : ''}</span>
                <span>${p.base.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mute">
                <span>Distance included</span>
                <span>{p.includedKm.toLocaleString()} km</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mute">
                <span>Est. route distance</span>
                <span>~{p.routeKm.toLocaleString()} km</span>
              </div>
              {p.extraKmCharge > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Extra {p.extraKm.toLocaleString()} km × ${(p.vehicle.perDay / DAILY_KM_ALLOWANCE).toFixed(2)}</span>
                  <span>${p.extraKmCharge.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mute">
                <span>Airport pickup & drop-off</span>
                <span>Included</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: 10,
                  borderTop: '1px solid var(--line)',
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                <span>Total estimate</span>
                <span>${p.total.toLocaleString()} USD</span>
              </div>
            </div>
          </div>
          <div
            style={{
              padding: '22px 28px',
              background: 'rgba(217,119,66,.1)',
              borderRadius: 'var(--r)',
              fontSize: 14,
              lineHeight: 1.6,
              width: '100%',
            }}
          >
            <strong>Payment terms</strong>
            <div style={{ marginTop: 8 }}>
              💳 Advance payment (10%): <strong>${p.advance.toLocaleString()}</strong> —{' '}
              {dueIsPast ? (
                <>due <strong>now</strong> (your tour starts in under two weeks)</>
              ) : (
                <>due by <strong>{fmtLong(due)}</strong> (two weeks before your tour)</>
              )}
              <br />
              💵 Balance: <strong>${balance.toLocaleString()}</strong> — payable during the tour.
            </div>
            <div className="mute" style={{ fontSize: 13, marginTop: 8 }}>
              Your booking is confirmed once the advance is received. Guide, accommodation & meals are arranged on request at cost.
            </div>
          </div>
        </div>


        {!booked ? (
          <>
            {/* Tourist details */}
            <div className="mt-8 eyebrow">Your details · for the booking confirmation email</div>
            <div className="grid mt-3" style={{ gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 720 }}>
              {fields.map((f) => (
                <div className="field" key={f.key}>
                  <label>{f.label}</label>
                  <input
                    type={f.type}
                    value={tourist[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) => setTourist((t) => ({ ...t, [f.key]: e.target.value }))}
                    style={showErrors && !fieldOk[f.key] ? { borderColor: 'var(--sunset)' } : undefined}
                  />
                  {showErrors && !fieldOk[f.key] && (
                    <div style={{ fontSize: 12, color: 'var(--sunset)', marginTop: 4 }}>{f.error}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  if (!valid) {
                    setShowErrors(true);
                    return;
                  }
                  setBooked(true);
                  setTimeout(
                    () => document.getElementById('booking-confirmed')?.scrollIntoView({ behavior: 'smooth' }),
                    80
                  );
                }}
              >
                Book this tour <span className="arrow">→</span>
              </button>
              <span className="mute" style={{ fontSize: 13 }}>
                No payment taken now — we confirm availability first.
              </span>
            </div>
          </>
        ) : null}
      </div>

      {/* Booking confirmation */}
      {booked && (
        <div
          id="booking-confirmed"
          className="mt-4"
          style={{
            padding: 48,
            background: 'var(--ink)',
            color: 'var(--bone)',
            borderRadius: 'var(--r-xl)',
          }}
        >
          <div className="eyebrow on-dark">✓ Booking ready</div>
          <h3 className="h-2 mt-2" style={{ color: 'var(--bone)' }}>
            Thank you, {tourist.name.trim().split(' ')[0]}!
          </h3>
          <p
            style={{
              color: 'rgba(248,244,234,.7)',
              maxWidth: 640,
              fontSize: 16,
              marginTop: 14,
              lineHeight: 1.6,
            }}
          >
            Send your booking now and we'll reply to <strong style={{ color: 'var(--bone)' }}>{tourist.email.trim()}</strong> within
            four hours confirming availability, with payment instructions for the{' '}
            <strong style={{ color: 'var(--bone)' }}>${p.advance.toLocaleString()} advance</strong>
            {dueIsPast ? ' (due now — your tour starts in under two weeks)' : ` (due by ${fmtLong(due)})`}.
          </p>
          <div
            className="mono"
            style={{ color: 'rgba(248,244,234,.55)', marginTop: 16, fontSize: 13, lineHeight: 1.7 }}
          >
            {tourist.name.trim()} · {tourist.country.trim()} · {tourist.phone.trim()}
            <br />
            {fmtLong(start)} → {fmtLong(end)} · {p.vehicle.name} · ~{p.routeKm.toLocaleString()} km · ${p.total.toLocaleString()} USD
          </div>
          <div className="flex gap-3 mt-6" style={{ flexWrap: 'wrap' }}>
            <button className="btn btn-on-dark btn-lg" onClick={() => openBookingEmail(booking)}>
              📧 Email my booking
            </button>
            <button
              className="btn btn-outline-dark btn-lg"
              onClick={() => openWhatsApp({ message: createBookingMessage(booking) })}
            >
              💬 WhatsApp it instead
            </button>
            <button
              className="btn btn-outline-dark btn-lg"
              onClick={() =>
                generateTripPDF({ ...trip, estKm: p.routeKm }, itinerary, `Modotravels-trip-${trip.days}days.pdf`)
              }
            >
              📄 Download PDF
            </button>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(248,244,234,.45)', marginTop: 14 }}>
            The email opens in your mail app, pre-filled with your details and full plan, addressed to {BOOKING_EMAIL}.
          </div>
        </div>
      )}
    </div>
  );
}
