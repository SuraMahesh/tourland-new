import type { Destination, Hotel, Review } from '../types';

interface DestinationCardProps {
  d: Destination;
  onClick?: () => void;
  variant?: 'grid' | 'asym' | 'carousel';
}

export function DestinationCard({ d, onClick, variant = 'grid' }: DestinationCardProps) {
  if (variant === 'asym') {
    return (
      <article className="card" onClick={onClick} style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 0 }}>
        <div className="ph" style={{ height: 280 }}>
          <img src={d.img} alt={d.name} loading="lazy" />
        </div>
        <div className="bd" style={{ padding: '28px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="mono" style={{ color: 'var(--mute)', marginBottom: 10 }}>
              {d.region}
            </div>
            <h4 style={{ fontSize: 28, letterSpacing: '-.025em' }}>{d.name}</h4>
            <p style={{ marginTop: 10 }}>{d.desc}</p>
          </div>
          <div className="meta" style={{ marginTop: 20, justifyContent: 'space-between' }}>
            <span>✦ Best: {d.best}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 500, color: 'var(--ink)' }}>
              Explore <span className="arrow">→</span>
            </span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'carousel') {
    return (
      <article className="card" onClick={onClick} style={{ cursor: 'pointer', minWidth: 360, flex: '0 0 360px', scrollSnapAlign: 'start' }}>
        <div className="ph" style={{ aspectRatio: '4/5' }}>
          <img src={d.img} alt={d.name} loading="lazy" />
        </div>
        <div className="bd">
          <div className="mono" style={{ color: 'var(--mute)', marginBottom: 6 }}>
            {d.region}
          </div>
          <h4>{d.name}</h4>
          <p>{d.desc.slice(0, 90)}…</p>
        </div>
      </article>
    );
  }

  return (
    <article className="card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="ph" style={{ aspectRatio: '4/3' }}>
        <img src={d.img} alt={d.name} loading="lazy" />
      </div>
      <div className="bd">
        <div className="mono" style={{ color: 'var(--mute)', marginBottom: 6 }}>
          {d.region}
        </div>
        <h4>{d.name}</h4>
        <p>{d.desc.slice(0, 110)}…</p>
        <div className="meta">
          <span>✦ {d.tag}</span>
          <span>·</span>
          <span>Best: {d.best}</span>
        </div>
      </div>
    </article>
  );
}

interface HotelCardProps {
  h: Hotel;
}

export function HotelCard({ h }: HotelCardProps) {
  return (
    <article className="card" style={{ position: 'relative' }}>
      {h.recommended && (
        <span
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            zIndex: 2,
            background: 'var(--sunset)',
            color: 'var(--ink)',
            padding: '5px 10px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '.03em',
          }}
        >
          ★ Recommended
        </span>
      )}
      <div className="ph" style={{ aspectRatio: '4/3' }}>
        <img src={h.img} alt={h.name} loading="lazy" />
      </div>
      <div className="bd">
        <div className="mono" style={{ color: 'var(--mute)', marginBottom: 6 }}>
          {h.city}
        </div>
        <h4>{h.name}</h4>
        <p>{h.blurb}</p>
        <div className="meta" style={{ justifyContent: 'space-between' }}>
          <span>
            {'★'.repeat(h.stars)} <span style={{ color: 'var(--mute)', marginLeft: 8 }}>{h.amenities.slice(0, 2).join(' · ')}</span>
          </span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{h.price}</span>
        </div>
      </div>
    </article>
  );
}

interface ReviewCardProps {
  r: Review;
  onDark?: boolean;
}

export function ReviewCard({ r, onDark }: ReviewCardProps) {
  return (
    <article
      className="reveal"
      style={{
        padding: '40px',
        background: onDark ? 'rgba(248,244,234,.08)' : 'var(--bone)',
        borderRadius: 'var(--r-lg)',
        border: `1px solid ${onDark ? 'rgba(248,244,234,.12)' : 'var(--line-2)'}`,
        backdropFilter: onDark ? 'blur(10px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        if (!onDark) {
          e.currentTarget.style.borderColor = 'var(--sunset)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(217, 119, 66, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!onDark) {
          e.currentTarget.style.borderColor = 'var(--line-2)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, fontSize: 16 }}>
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{ color: i < r.stars ? 'var(--sunset)' : onDark ? 'rgba(248,244,234,.2)' : 'var(--line-2)' }}>
            ★
          </span>
        ))}
      </div>
      <p
        style={{
          fontSize: 17,
          lineHeight: 1.65,
          letterSpacing: '-.005em',
          color: onDark ? 'rgba(248,244,234,.9)' : 'var(--ink)',
          margin: '0 0 32px 0',
          flex: 1,
          fontWeight: 500,
        }}
      >
        "{r.text}"
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          paddingTop: 20,
          borderTop: `1px solid ${onDark ? 'rgba(248,244,234,.12)' : 'var(--line-2)'}`,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--sunset), var(--teal))',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--bone)',
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {r.name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: onDark ? 'var(--bone)' : 'var(--ink)' }}>
            {r.name}
          </div>
          <div className="mono" style={{ fontSize: 12, color: onDark ? 'rgba(248,244,234,.5)' : 'var(--mute)' }}>
            {r.from} · {r.when}
          </div>
        </div>
      </div>
    </article>
  );
}
