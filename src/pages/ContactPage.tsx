import { useState } from 'react';
import { SubHero } from '../components';
import { WHATSAPP_LINK, contactViaWhatsApp } from '../utils/whatsapp';

const COUNTRIES = [
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+61', flag: '🇦🇺' },
  { code: '+64', flag: '🇳🇿' },
  { code: '+91', flag: '🇮🇳' },
  { code: '+94', flag: '🇱🇰' },
  { code: '+86', flag: '🇨🇳' },
  { code: '+81', flag: '🇯🇵' },
  { code: '+33', flag: '🇫🇷' },
  { code: '+49', flag: '🇩🇪' },
  { code: '+39', flag: '🇮🇹' },
  { code: '+34', flag: '🇪🇸' },
  { code: '+31', flag: '🇳🇱' },
  { code: '+46', flag: '🇸🇪' },
  { code: '+47', flag: '🇳🇴' },
  { code: '+45', flag: '🇩🇰' },
  { code: '+358', flag: '🇫🇮' },
  { code: '+41', flag: '🇨🇭' },
  { code: '+43', flag: '🇦🇹' },
  { code: '+32', flag: '🇧🇪' },
];

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [countryCode, setCountryCode] = useState('+94');
  const [phone, setPhone] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', topic: 'New trip enquiry', message: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!phone.trim()) newErrors.phone = 'Phone is required';
    else if (phone.length < 7) newErrors.phone = 'Phone too short';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setSent(true);
    }
  };

  return (
    <main>
      <SubHero
        crumbs={['TourLand', 'Contact']}
        eyebrow="Get in touch"
        title="Talk to a human in Colombo."
        img="https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=2000&q=80&auto=format&fit=crop"
      />
      <section className="container sec">
        <div className="contact-wrapper" >
          <div>
            <div className="eyebrow">Three ways to reach us</div>
            <h2 className="h-3" style={{ margin: '14px 0 32px' }}>
              WhatsApp is fastest. Phones are answered too.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  contactViaWhatsApp();
                }}
                className="card"
                style={{
                  padding: '24px 28px',
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr auto',
                  alignItems: 'center',
                  gap: 18,
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#25d366', display: 'grid', placeItems: 'center' }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.43 1.27 4.9L2 22l5.25-1.37C8.7 21.51 10.31 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 17 }}>WhatsApp · +94 77 200 8000</div>
                  <div className="mute" style={{ fontSize: 13 }}>
                    24/7 · average reply 6 minutes
                  </div>
                </div>
                <span className="arrow" style={{ fontSize: 20 }}>
                  →
                </span>
              </a>
              <a
                href="mailto:hello@tourland.lk"
                className="card"
                style={{
                  padding: '24px 28px',
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr auto',
                  alignItems: 'center',
                  gap: 18,
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--ink)', color: 'var(--bone)', display: 'grid', placeItems: 'center', fontSize: 20 }}>
                  ✉
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 17 }}>hello@tourland.lk</div>
                  <div className="mute" style={{ fontSize: 13 }}>
                    Replies within 4 hours, Mon–Sun
                  </div>
                </div>
                <span className="arrow" style={{ fontSize: 20 }}>
                  →
                </span>
              </a>
            </div>
          </div>

          <div style={{ padding: 8, background: 'var(--bone)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-2)' }}>
            <div className="eyebrow">Email us</div>
            <h3 className="h-3 mt-2" style={{ margin: '14px 0 32px' }}>
              Send a message.
            </h3>
            {sent ? (
              <div style={{ padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 48, color: 'var(--sunset)' }}>✓</div>
                <h4 className="h-4 mt-2">Message received.</h4>
                <p className="mute mt-2">We've copied your planner. Reply usually within four hours.</p>
              </div>
            ) : (
              <form
                className="grid"
                style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}
                onSubmit={handleSubmit}
              >
                <div className="field">
                  <label>Name</label>
                  <input
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ borderColor: errors.name ? 'var(--sunset)' : 'var(--line)' }}
                  />
                  {errors.name && <span style={{ fontSize: 12, color: 'var(--sunset)', marginTop: 4 }}>{errors.name}</span>}
                </div>
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ borderColor: errors.email ? 'var(--sunset)' : 'var(--line)' }}
                  />
                  {errors.email && <span style={{ fontSize: 12, color: 'var(--sunset)', marginTop: 4 }}>{errors.email}</span>}
                </div>
                <div className="field" style={{ gridColumn: '1/-1' }}>
                  <label>Phone (with WhatsApp)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 8 }}>
                    <div style={{ position: 'relative',}}>
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(!openDropdown)}
                        className="country-dropdown-btn"
                        style={{
                          width: '100%',
                          padding: '12px 6px',
                          border: '1px solid var(--line)',
                          borderRadius: 'var(--r)',
                          background: 'var(--bone)',
                          fontSize: 15,
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <span>{COUNTRIES.find((c) => c.code === countryCode)?.flag} {countryCode}</span>
                        <span style={{ fontSize: 12 }}>▼</span>
                      </button>
                      {openDropdown && (
                        <div className="country-dropdown-menu">
                          {COUNTRIES.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setCountryCode(c.code);
                                setOpenDropdown(false);
                              }}
                              className="country-option"
                            >
                              <span>{c.flag}</span>
                              <span>{c.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      placeholder="77 200 8000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      style={{
                        padding: '12px 14px',
                        border: `1px solid ${errors.phone ? 'var(--sunset)' : 'var(--line)'}`,
                        borderRadius: 'var(--r)',
                        background: 'var(--bone)',
                        fontSize: 15,
                        transition: 'border 0.2s ease',
                      }}
                    />
                  </div>
                  {errors.phone && <span style={{ fontSize: 12, color: 'var(--sunset)', marginTop: 6, display: 'block' }}>{errors.phone}</span>}
                </div>
                <div className="field" style={{ gridColumn: '1/-1' }}>
                  <label>Topic</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="topic-select"
                  >
                    <option>New trip enquiry</option>
                    <option>Existing booking</option>
                    <option>Airport pickup</option>
                    <option>Press / partnership</option>
                  </select>
                </div>
                <div className="field" style={{ gridColumn: '1/-1' }}>
                  <label>Message</label>
                  <textarea
                    placeholder="Tell us about your trip — dates, who's coming, what you love…"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ borderColor: errors.message ? 'var(--sunset)' : 'var(--line)' }}
                  />
                  {errors.message && <span style={{ fontSize: 12, color: 'var(--sunset)', marginTop: 6, display: 'block' }}>{errors.message}</span>}
                </div>
                <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mute" style={{ fontSize: 12 }}>
                    By sending you agree to our privacy policy.
                  </span>
                  <button className="btn btn-primary" type="submit">
                    Send <span className="arrow">→</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
