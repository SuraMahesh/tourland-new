import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { NAV } from '../data';
import { motion } from 'framer-motion';

interface HeaderProps {
  route: string;
  go: (route: string, params?: any) => void;
  transparent?: boolean;
}

export function Header({ route, go, transparent = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

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
            <motion.a
              key={k}
              className={route === k ? 'active' : ''}
              onClick={() => go(k)}
              whileHover={{ rotate: 2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ cursor: 'pointer', display: 'inline-block' }}
            >
              {l}
            </motion.a>
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
            display: isMobile ? 'block' : 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            fontSize: '24px',
            zIndex: 1000,
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && isMobile && (
        <motion.div
          className="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 999,
          }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav
            className="mobile-menu-nav"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px',
              gap: '8px',
            }}
          >
            {NAV.map(([navRoute, label], index) => (
              <motion.button
                key={navRoute}
                onClick={() => handleNavClick(navRoute)}
                className={`mobile-menu-item ${navRoute === route ? 'active' : ''}`}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                {label}
              </motion.button>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}


