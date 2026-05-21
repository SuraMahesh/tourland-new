import { useState } from 'react';
import { SubHero, ReviewCard } from '../components';
import { REVIEWS } from '../data';
export function ReviewsPage() {
  const [sent, setSent] = useState(false);
  const [rating, setRating] = useState(0);

  const stats = [
    { label: 'Avg. Rating', value: '4.9/5', icon: '★' },
    { label: 'Completed Trips', value: '2,100+', icon: '✓' },
    { label: 'Response Time', value: '24hrs', icon: '⏱' },
  ];

  return (
    <main>
      <SubHero
        crumbs={['TourLand', 'Reviews']}
        eyebrow="From our travellers"
        title="Real stories from real trips."
        img="https://images.unsplash.com/photo-1518509562904-e7ef99cddc85?w=2000&q=80&auto=format&fit=crop"
      />

      <section style={{ background: 'linear-gradient(135deg, var(--ink) 0%, rgba(44,62,80,.95) 100%)', color: 'var(--bone)', padding: '80px 40px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, maxWidth: 900, margin: '0 auto' }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16, color: 'var(--sunset)' }}>{stat.icon}</div>
                <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>{stat.value}</div>
                <div style={{ fontSize: 14, color: 'rgba(248,244,234,.6)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48, maxWidth: 600, margin: '0 auto' }}>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(248,244,234,.8)', margin: 0 }}>
              Every review is hand-read by our team. We reply personally within 24 hours and use your feedback to continuously improve your experience.
            </p>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ marginBottom: 64, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 12, color: 'var(--sunset)' }}>Recent trips</div>
          <h2 className="h-3" style={{ margin: 0 }}>What our travellers say.</h2>
        </div>

        <div className="grid grid-2" style={{ gap: 32, marginBottom: 80 }}>
          {REVIEWS.map((r) => (
            <ReviewCard key={r.id} r={r} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <div style={{ padding: '60px 48px', background: 'linear-gradient(135deg, var(--bone) 0%, rgba(248,244,234,.5) 100%)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-2)' }}>
            <div style={{ marginBottom: 32 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Share your story</div>
              <h3 className="h-4" style={{ margin: 0, fontSize: 24 }}>Tell us about your adventure.</h3>
            </div>

            {sent ? (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 64, color: 'var(--sunset)', marginBottom: 16 }}>✓</div>
                <h4 className="h-4">Thank you!</h4>
                <p className="mute" style={{ marginTop: 8, fontSize: 14 }}>Your review is being read by our team. Look for a personal response within 24 hours.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 13 }}>Your name</label>
                  <input required placeholder="Full name" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--line-2)', borderRadius: 'var(--r)', fontSize: 14, boxSizing: 'border-box' }} />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 13 }}>Tour reference (optional)</label>
                  <input placeholder="e.g. TL-2026-0419" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--line-2)', borderRadius: 'var(--r)', fontSize: 14, boxSizing: 'border-box' }} />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 12, fontWeight: 500, fontSize: 13 }}>How was your trip?</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        type="button"
                        key={n}
                        onClick={() => setRating(n)}
                        style={{
                          flex: 1,
                          padding: '12px 8px',
                          fontSize: 24,
                          border: `2px solid ${n <= rating ? 'var(--sunset)' : 'var(--line-2)'}`,
                          borderRadius: 'var(--r)',
                          background: n <= rating ? 'rgba(217, 119, 66, 0.1)' : 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          color: n <= rating ? 'var(--sunset)' : 'var(--mute)',
                        }}
                        onMouseEnter={(e) => {
                          if (n > rating) {
                            e.currentTarget.style.borderColor = 'var(--sunset)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (n > rating) {
                            e.currentTarget.style.borderColor = 'var(--line-2)';
                          }
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 13 }}>Your review</label>
                  <textarea placeholder="Share what made your trip special…" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--line-2)', borderRadius: 'var(--r)', fontSize: 14, minHeight: 140, fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>

                <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
                  Share your story <span className="arrow">→</span>
                </button>
              </form>
            )}
          </div>

          <div style={{ padding: '0' }}>
            <div className="eyebrow" style={{ marginBottom: 24, color: 'var(--sunset)' }}>Why we ask</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px', color: 'var(--ink)' }}>We genuinely care</h4>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--mute)', margin: 0 }}>Your feedback helps us understand what works and what doesn't. Every review shapes how we plan future trips.</p>
              </div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px', color: 'var(--ink)' }}>You deserve recognition</h4>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--mute)', margin: 0 }}>We showcase your story (with permission) to inspire others and build trust with future travellers.</p>
              </div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px', color: 'var(--ink)' }}>We reply personally</h4>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--mute)', margin: 0 }}>Your planner will reach out within 24 hours. We don't treat reviews as data—we treat them as conversations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
