import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { NAV } from '../data';

interface HeaderProps {
  route: string;
  go: (route: string, params?: any) => void;
  transparent?: boolean;
}

export function Header({ route, go, transparent = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  const isTransparent = transparent && !scrolled;

  const handleNavClick = (route: string) => {
    go(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className={'hd' + (isTransparent ? ' is-transparent' : '')}>
      <div className="hd-inner">
        <button onClick={() => handleNavClick('home')} style={{ display: 'flex' }}>
          <Logo />
        </button>

        {/* Desktop Navigation */}
        <nav className="nav nav-desktop">
          {NAV.map(([k, l]) => (
            <a key={k} className={route === k ? 'active' : ''} onClick={() => go(k)}>
              {l}
            </a>
          ))}
        </nav>

        {/* Desktop Tools */}
        <div className="hd-tools hd-tools-desktop">
          <button className="lang-sel">
            EN <span style={{ opacity: 0.5 }}>·</span> SI · TA{' '}
            <span style={{ fontSize: 9, opacity: 0.5, marginLeft: 2 }}>▾</span>
          </button>
          <a className="wa-pill" href="#">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.43 1.27 4.9L2 22l5.25-1.37C8.7 21.51 10.31 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.1 14.32c-.21.6-1.05 1.11-1.71 1.25-.46.1-1.05.18-3.06-.65-2.57-1.07-4.23-3.66-4.36-3.83-.13-.17-1.05-1.4-1.05-2.66s.66-1.89.89-2.15c.23-.26.5-.32.66-.32h.48c.15 0 .36-.06.56.43.21.5.71 1.74.77 1.86.06.13.1.28.02.45-.08.17-.13.27-.25.42-.13.15-.27.34-.38.45-.13.13-.26.26-.11.51.15.25.66 1.09 1.42 1.77.97.87 1.78 1.14 2.03 1.27.25.13.4.11.55-.07.15-.17.62-.72.79-.97.17-.25.34-.21.57-.13.23.08 1.47.69 1.72.82.25.13.42.19.48.3.06.1.06.6-.15 1.2z" />
            </svg>
            +94 77 200 8000
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            fontSize: '24px',
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay">
          <div className="mobile-nav-header">
            <span className="mobile-nav-brand">TourLand</span>
            <button
              className="mobile-nav-close"
              onClick={() => setMobileMenuOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className="mobile-nav-premium">
            {[
              { key: 'destinations', label: 'Destinations', img: 'https://images.unsplash.com/photo-1546708973-c0d27b302cee?w=800&q=60&auto=format&fit=crop' },
              { key: 'activities', label: 'Activities', img: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=60&auto=format&fit=crop' },
              { key: 'planner', label: 'Plan Tour', img: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=60&auto=format&fit=crop' },
              { key: 'contact', label: 'Contact', img: 'https://images.unsplash.com/photo-1518509562904-e7ef99cddc85?w=800&q=60&auto=format&fit=crop' },
            ].map((item) => (
              <PremiumNavLink
                key={item.key}
                label={item.label}
                img={item.img}
                isActive={route === item.key}
                onClick={() => handleNavClick(item.key)}
              />
            ))}
          </nav>

          <div className="mobile-nav-footer-premium">
            <button className="mobile-footer-btn">WhatsApp +94 77 200 8000</button>
          </div>
        </div>
      )}
    </header>
  );
}

function PremiumNavLink({
  label,
  img,
  isActive,
  onClick,
}: {
  label: string;
  img: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`premium-nav-link ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="premium-nav-bg" style={{ backgroundImage: `url(${img})` }} />
      <div className="premium-nav-overlay" />
      <div className="premium-nav-content">
        <span className="premium-nav-label">{label}</span>
        {isActive && <span className="premium-nav-indicator">✓</span>}
      </div>
    </button>
  );
}
