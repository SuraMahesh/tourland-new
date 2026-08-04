import { NAV } from '../data';
import { MiniMap } from './MiniMap';

interface FooterProps {
  go: (route: string, params?: any) => void;
}

export function Footer({ go }: FooterProps) {
  return (
    <footer className="ft">
      <div className="ft-grid">
        <div>
          <div style={{
            color: 'var(--bone)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontWeight: 600,
            fontSize: 20,
            letterSpacing: '-.02em',
          }}>
            <svg width="24" height="24" viewBox="0 0 96 96" fill="none" aria-hidden="true">
              <path
                d="M50 8 C68 18 80 40 76 60 C72 80 52 91 36 85 C20 79 12 58 18 40 C23 25 36 12 50 8 Z"
                fill="var(--bone)"
              />
              <path d="M50 21 C58 37 57 54 44 72" stroke="var(--sunset)" strokeWidth="5" strokeLinecap="round" />
              <circle cx="42" cy="79" r="3.5" fill="var(--sunset)" />
            </svg>
            TourLand
          </div>
          <p style={{
            color: 'rgba(248,244,234,.6)',
            fontSize: 14,
            lineHeight: 1.55,
            marginTop: 18,
            maxWidth: 340,
          }}>
            Sri Lanka, curated. Independent local trip-builder based in Colombo and Galle. Travel agency licence SLTDA 04/0089.
          </p>
          {/* <div className="lk-mini">
            <MiniMap small />
          </div> */}
        </div>
        <div>
          <h6>Explore</h6>
          {NAV.slice(1, 5).map(([k, l]) => (
            <a key={k} onClick={() => go(k as string)}>
              {l}
            </a>
          ))}
          <a onClick={() => go('reviews')}>Reviews</a>
        </div>
        <div>
          <h6>Plan</h6>
          <a onClick={() => go('planner')}>Tour Planner</a>
          <a onClick={() => go('contact')}>Airport Pickup</a>
          <a onClick={() => go('contact')}>Talk to a planner</a>
          <a>Travel insurance</a>
        </div>
        <div>
          <h6>Newsletter</h6>
          <p style={{
            color: 'rgba(248,244,234,.6)',
            fontSize: 13,
            lineHeight: 1.5,
            margin: '0 0 14px',
          }}>
            One email a season, on the best time to visit and what's open.
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              type="email"
              placeholder="you@email.com"
              style={{
                flex: 1,
                background: 'rgba(248,244,234,.08)',
                border: '1px solid rgba(248,244,234,.18)',
                color: 'var(--bone)',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 13,
                outline: 'none',
              }}
            />
            <button className="btn btn-sm" style={{ background: 'var(--sunset)', color: 'var(--ink)' }}>
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="ft-bottom">
        <div>© 2026 TourLand (Pvt) Ltd · 47 Galle Face Court 2, Colombo 03</div>
        <div style={{ display: 'flex', gap: 18 }}>
          <a>Privacy</a>
          <a>Terms</a>
          <a>Sustainability</a>
        </div>
      </div>
    </footer>
  );
}
