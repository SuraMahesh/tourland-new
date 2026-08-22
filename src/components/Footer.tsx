import { NAV } from '../data';
import Logo  from '../assets/logo.jpeg';

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
         {/* <img src={Logo} alt="Logo" style={{width: "200px"}} /> */}
         <p>Modo Traverls</p>
          </div>
          <p style={{
            color: 'rgba(248,244,234,.6)',
            fontSize: 14,
            lineHeight: 1.55,
            marginTop: 10,
            maxWidth: 340,
          }}>
            We design curated, independent journeys crafted by local trip builders who know the island's secrets inside and out. From mist-shrouded tea plantations and ancient heritage sites to sun-drenched surf breaks and wild elephant safaris, we build seamless, immersive itineraries tailored to your unique travel style.
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>© 2026 Modotravels  · Design & Develop by <a className="footer_link" href="https://felixto.com" target="_blank" rel="noopener noreferrer">Felixto</a></div>
        <div style={{ display: 'flex', gap: 18 }}>
          <a>Privacy</a>
          <a>Terms</a>
          <a>Sustainability</a>
        </div>
      </div>
    </footer>
  );
}
