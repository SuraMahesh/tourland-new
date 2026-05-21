import { useState, useEffect } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Marquee, SecHead, DestinationCard, ReviewCard, TwoCoasts } from '../components';
import { DESTINATIONS, ACTIVITIES, REVIEWS, HOW_IT_WORKS } from '../data';
import type { Tweaks, PageParams } from '../types';

function DateRangePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // Feb 2026
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleDateClick = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!startDate || (startDate && endDate)) {
      setStartDate(selected);
      setEndDate(null);
    } else {
      if (selected < startDate) {
        setStartDate(selected);
      } else {
        setEndDate(selected);
        setShowCalendar(false);
      }
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      onChange(`${fmt(startDate)} – ${fmt(endDate)}, 2026`);
    }
  }, [startDate, endDate, onChange]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const days = [];
  const firstDay = getFirstDayOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(currentMonth);

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isInRange = (day: number | null) => {
    if (!day || !startDate) return false;
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!endDate) return false;
    return d > startDate && d < endDate;
  };

  const isStart = (day: number | null) => {
    if (!day || !startDate) return false;
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return d.toDateString() === startDate.toDateString();
  };

  const isEnd = (day: number | null) => {
    if (!day || !endDate) return false;
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return d.toDateString() === endDate.toDateString();
  };

  return (
    <div style={{ position: 'relative', zIndex: 100 }}>
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid rgba(248,244,234,.2)',
          borderRadius: 'var(--r)',
          background: 'rgba(44,62,80,.4)',
          color: 'var(--bone)',
          cursor: 'pointer',
          fontSize: 14,
          textAlign: 'left',
        }}
      >
        📅 {value || 'Select dates'}
      </button>

      {isMobile && showCalendar && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.5)',
            zIndex: 140,
          }}
          onClick={() => setShowCalendar(false)}
        />
      )}

      {showCalendar && (
        <div
          style={{
            position: isMobile ? 'fixed' : 'absolute',
            top: isMobile ? '50%' : '100%',
            left: isMobile ? '50%' : 0,
            transform: isMobile ? 'translate(-50%, -50%)' : 'none',
            marginTop: isMobile ? 0 : 12,
            background: 'var(--bone)',
            borderRadius: 'var(--r-lg)',
            border: '1px solid var(--line-2)',
            padding: 24,
            zIndex: 150,
            minWidth: isMobile ? 'min(90vw, 360px)' : 320,
            maxWidth: isMobile ? '90vw' : 'none',
            boxShadow: '0 20px 60px rgba(0,0,0,.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: isMobile ? 18 : 20, padding: isMobile ? '8px' : '0', borderRadius: 'var(--r)' }}
            >
              ←
            </button>
            <div style={{ fontWeight: 600, fontSize: isMobile ? 13 : 14 }}>
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: isMobile ? 18 : 20, padding: isMobile ? '8px' : '0', borderRadius: 'var(--r)' }}
            >
              →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: isMobile ? 6 : 4, marginBottom: 16 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--mute)', padding: isMobile ? '10px 0' : '8px 0' }}>
                {isMobile ? d.charAt(0) : d}
              </div>
            ))}
            {days.map((day, i) => (
              <button
                key={i}
                onClick={() => day && handleDateClick(day)}
                style={{
                  padding: isMobile ? '10px 4px' : '8px',
                  border: isStart(day) || isEnd(day) ? '2px solid var(--sunset)' : '1px solid transparent',
                  background:
                    isStart(day) || isEnd(day)
                      ? 'var(--sunset)'
                      : isInRange(day)
                        ? 'rgba(217, 119, 66, 0.1)'
                        : 'transparent',
                  color: isStart(day) || isEnd(day) ? 'white' : 'var(--ink)',
                  borderRadius: 'var(--r)',
                  cursor: day ? 'pointer' : 'default',
                  fontSize: isMobile ? 13 : 12,
                  fontWeight: day ? 500 : 400,
                  opacity: day ? 1 : 0.3,
                  transition: 'all 0.15s ease',
                }}
              >
                {day}
              </button>
            ))}
          </div>

          {startDate && endDate && (
            <button
              onClick={() => setShowCalendar(false)}
              style={{
                width: '100%',
                padding: isMobile ? '14px' : '10px',
                background: 'var(--sunset)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--r)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: isMobile ? 14 : 13,
              }}
            >
              Done
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface HomePageProps {
  go: (route: string, params?: PageParams) => void;
  t: Tweaks;
  setTweak: (key: string | keyof Tweaks, value: any) => void;
}

export function HomePage({ go, t, setTweak }: HomePageProps) {
  const ref = useReveal();
  const [reel, setReel] = useState(0);
  const [dateRange, setDateRange] = useState('Feb 14 – 28, 2026');

  useEffect(() => {
    const id = setInterval(() => setReel((r) => (r + 1) % 4), 5500);
    return () => clearInterval(id);
  }, []);

  const HERO_REELS = [
    { img: 'https://images.unsplash.com/photo-1571406761758-9a3eed5338ef?w=2400&q=80&auto=format&fit=crop', label: 'Train, Kandy → Ella', coords: '06° 56′ N · 80° 38′ E' },
    { img: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=2400&q=80&auto=format&fit=crop', label: 'Sigiriya rock fortress', coords: '07° 57′ N · 80° 45′ E' },
    { img: 'https://images.unsplash.com/photo-1546708973-c0d27b302cee?w=2400&q=80&auto=format&fit=crop', label: 'Tea estates, Hill Country', coords: '06° 58′ N · 80° 46′ E' },
    { img: 'https://images.unsplash.com/photo-1518509562904-e7ef99cddc85?w=2400&q=80&auto=format&fit=crop', label: 'East coast, Trincomalee', coords: '08° 35′ N · 81° 12′ E' },
  ];

  const now = HERO_REELS[reel];

  return (
    <main ref={ref}>
      <section className="hero">
        <div className="hero-media">
          {HERO_REELS.map((r, i) => (
            <div key={i} className={'hero-reel' + (i === reel ? ' is-active' : '')}>
              <img src={r.img} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
            </div>
          ))}
          <div className="hero-shade" />
        </div>
        <div className="hero-inner">
          <div className="hero-top">
            <div className="hero-title">
              <div className="eyebrow on-dark" style={{ marginBottom: 18 }}>
                ● Live in Colombo · 28°C · 17 May 2026
              </div>
              <h1 className="h-1">
                Sri Lanka.
                <br />
                <em style={{ fontStyle: 'normal', color: 'var(--sunset)' }}>Curated.</em>
              </h1>
              <p className="lede">Eight regions, two monsoons, one small island. Build your route with planners who live here.</p>
            </div>
            <div className="hero-meta">
              <div className="now">{now.coords}</div>
              <div>
                Reel {String(reel + 1).padStart(2, '0')} / {String(HERO_REELS.length).padStart(2, '0')} · {now.label}
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                {HERO_REELS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReel(i)}
                    style={{
                      width: i === reel ? 32 : 24,
                      height: 2,
                      background: i === reel ? 'var(--bone)' : 'rgba(248,244,234,.3)',
                      border: 0,
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all .4s',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <div className="searchbar">
              <div className="sb-field">
                <label>Where</label>
                <select defaultValue="">
                  <option value="">All of Sri Lanka</option>
                  {DESTINATIONS.map((d) => (
                    <option key={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="sb-field">
                <label>When</label>
                <DateRangePicker value={dateRange} onChange={setDateRange} />
              </div>
              <div className="sb-field">
                <label>Travellers</label>
                <input type="text" placeholder="2 adults" defaultValue="2 adults" />
              </div>
              <div className="sb-field">
                <label>Style</label>
                <select defaultValue="">
                  <option value="">Surprise me</option>
                  <option>Nature & wildlife</option>
                  <option>Culture & heritage</option>
                  <option>Honeymoon</option>
                  <option>Family · kids</option>
                </select>
              </div>
              <button className="sb-go" onClick={() => go('planner')}>
                →
              </button>
            </div>
            <div className="hero-stats">
              <div>
                <b>28</b>destinations
              </div>
              <div>
                <b>06</b>regions
              </div>
              <div>
                <b>120</b>vetted hotels
              </div>
              <div>
                <b>2.1k</b>trips built · 4.9★
              </div>
            </div>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          <span key="a">Wildlife</span>,
          <span key="b">Tea Country</span>,
          <span key="c">Heritage</span>,
          <span key="d">Surf</span>,
          <span key="e">Cuisine</span>,
          <span key="f">Festivals</span>,
          <span key="g">Whales</span>,
          <span key="h">Trains</span>,
        ]}
      />

      <section className="sec container">
        <SecHead
          n="01"
          eyebrow="Where to go"
          title="Eight regions, one small island."
          lede="From hill-country tea estates to leopard country and surf coves — handpicked by planners who've travelled every one."
        // right={
        //   <div className="flex gap-2">
        //     {(['grid', 'asym', 'carousel'] as const).map((v) => (
        //       <button
        //         key={v}
        //         className={'chip' + (t.cardLayout === v ? ' active' : '')}
        //         onClick={() => setTweak('cardLayout', v)}
        //       >
        //         {v}
        //       </button>
        //     ))}
        //   </div>
        // }
        />
        <DestinationGrid layout={t.cardLayout} dest={DESTINATIONS} onPick={(id) => go('destination', { id })} />
        <div className="mt-6 center">
          <button className="btn btn-light" onClick={() => go('destinations')}>
            See all 28 destinations <span className="arrow">→</span>
          </button>
        </div>
      </section>

      <section style={{ background: 'var(--ink)', color: 'var(--bone)', position: 'relative', overflow: 'hidden' }}>
        <TwoCoasts go={go} />
      </section>

      <section className="sec container">
        <SecHead n="03" eyebrow="Things to do" title="Curated experiences. Nothing on the bus-tour list." lede="Local guides, eco-rated operators, small groups." />
        <div className="grid grid-3">
          {ACTIVITIES.slice(0, 6).map((a) => (
            <article key={a.id} className="card reveal" onClick={() => go('activities')} style={{ cursor: 'pointer' }}>
              <div className="ph" style={{ aspectRatio: '5/4' }}>
                <img src={a.img} alt={a.name} loading="lazy" />
              </div>
              <div className="bd">
                <div className="mono" style={{ color: 'var(--mute)', marginBottom: 6 }}>
                  {a.category} · {a.duration} · {a.difficulty}
                </div>
                <h4>{a.name}</h4>
                <p>{a.overview.slice(0, 110)}…</p>
                <div className="meta">
                  <span>{a.price}</span>
                  <span>·</span>
                  <span>{a.steps.length} steps</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>


      <section className="sec container">
        <SecHead n="05" eyebrow="How it works" title="From idea to itinerary, in four steps." />
        <div className="grid grid-2 xl:grid-4">
          {HOW_IT_WORKS.map((s, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                padding: '32px 28px',
                background: 'var(--bone)',
                borderRadius: 'var(--r-lg)',
                border: '1px solid var(--line-2)',
                minHeight: 240,
              }}
            >
              <div className="mono" style={{ color: 'var(--sunset)', marginBottom: 14 }}>
                {s.n}
              </div>
              <h4 className="h-4">{s.t}</h4>
              <p className="mute" style={{ marginTop: 10, fontSize: 14 }}>
                {s.d}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 center">
          <button className="btn btn-primary btn-lg" onClick={() => go('planner')}>
            Start planning <span className="arrow">→</span>
          </button>
        </div>
      </section>

      <section style={{ background: 'var(--jungle)', color: 'var(--bone)' }}>
        <div className="container sec">
          <SecHead
            n="06"
            eyebrow="Recent travellers"
            title="What people say after they get home."
            right={
              <button className="btn btn-outline-dark" onClick={() => go('reviews')}>
                All reviews <span className="arrow">→</span>
              </button>
            }
          />
          <div className="grid grid-2">
            {REVIEWS.slice(0, 2).map((r) => (
              <ReviewCard key={r.id} r={r} onDark />
            ))}
          </div>
        </div>
      </section>

      <section className="container sec">
        <SecHead n="07" eyebrow="Frequently asked" title="Questions we get all the time." />
        <FAQAccordion />
      </section>
    </main>
  );
}

function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How far in advance should I book?',
      a: 'We recommend 3-6 months for peak season (Dec–Apr), though we can usually accommodate shorter notice. Off-season bookings can be made 4-8 weeks out. Contact us directly for urgent requests.',
    },
    {
      q: "What's included in the trip cost?",
      a: "Land arrangements (accommodation, transport, activities), experienced guides, and 24/7 WhatsApp support. Flights, visas, insurance, and meals outside specified activities are not included.",
    },
    {
      q: 'Can I customize my itinerary?',
      a: 'Yes, absolutely. Use our trip planner to sketch your idea, and our team will refine it. We also start from scratch if you prefer a hands-off approach.',
    },
    {
      q: 'Do you offer private tours?',
      a: 'Yes. We offer private guides, private vehicles, and fully private itineraries. Small groups (2–6 people) cost less than solo travel; larger groups pay a per-person rate.',
    },
    {
      q: "What's your cancellation policy?",
      a: "Free cancellation up to 30 days before departure. 50% refund 15–29 days out. Non-refundable after that, though we can rebook most trips at no extra charge.",
    },
  ];

  return (
    <div className="grid grid-2" style={{ gap: 24 }}>
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="reveal"
          style={{
            borderRadius: 'var(--r-lg)',
            border: `1px solid var(--line-2)`,
            background: 'var(--bone)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--sunset)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(217, 119, 66, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--line-2)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%',
              padding: '24px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
            }}
          >
            <h4 style={{ margin: 0, textAlign: 'left', fontWeight: 600, fontSize: 16, color: 'var(--ink)', maxWidth: '90%' }}>
              {faq.q}
            </h4>
            <span
              style={{
                color: 'var(--sunset)',
                fontSize: 20,
                fontWeight: 300,
                transition: 'transform 0.3s ease',
                transform: open === i ? 'rotate(180deg)' : 'rotate(0)',
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              ↓
            </span>
          </button>
          {open === i && (
            <div
              style={{
                padding: '0 24px 24px',
                color: 'var(--mute)',
                fontSize: 15,
                lineHeight: 1.65,
                borderTop: '1px solid var(--line-2)',
                animation: 'slideDown 0.3s ease',
              }}
            >
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface DestinationGridProps {
  layout: 'grid' | 'asym' | 'carousel';
  dest: any[];
  onPick: (id: string) => void;
}

function DestinationGrid({ layout, dest, onPick }: DestinationGridProps) {
  if (layout === 'carousel') {
    return (
      <div style={{ display: 'flex', gap: 20, overflowX: 'auto', scrollSnapType: 'x mandatory', padding: '4px 0 24px', margin: '0 -40px', paddingLeft: 40, paddingRight: 40 }}>
        {dest.map((d) => (
          <DestinationCard key={d.id} d={d} variant="carousel" onClick={() => onPick(d.id)} />
        ))}
      </div>
    );
  }
  if (layout === 'asym') {
    return (
      <div className="grid grid-2">
        {dest.slice(0, 4).map((d) => (
          <DestinationCard key={d.id} d={d} variant="asym" onClick={() => onPick(d.id)} />
        ))}
      </div>
    );
  }
  return (
    <div 
    // style={{
    //   display: "grid",
    //   gridTemplateColumns: "repeat(2, 1fr)",   // Default: Mobile (1 column)
    //   gap: "16px",
    //   width: "100%"
    // }}
    className="responsive-grid"
    >
      {dest.slice(0, 8).map((d) => (
        <DestinationCard key={d.id} d={d} variant="grid" onClick={() => onPick(d.id)} />
      ))}
    </div>
  );
}
