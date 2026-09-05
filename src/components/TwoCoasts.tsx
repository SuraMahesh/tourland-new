import { COAST_DATA, DESTINATIONS } from '../data';
import { LazyMapView } from './LazyMapView';

const MONTHS_SHORT = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const TODAY_MONTH = new Date().getMonth();

interface TwoCoastsProps {
  go: (route: string, params?: Record<string, any>) => void;
}

export function TwoCoasts({ go }: TwoCoastsProps) {
  const activeNow = COAST_DATA.filter((c) => c.season[TODAY_MONTH]);
  const monthName = new Date().toLocaleDateString('en-GB', { month: 'long' });
  const mapPins = [
    DESTINATIONS.find((d) => d.id === 'galle'),
    DESTINATIONS.find((d) => d.id === 'trincomalee'),
    DESTINATIONS.find((d) => d.id === 'kandy'),
    DESTINATIONS.find((d) => d.id === 'ella'),
  ].filter(Boolean) as typeof DESTINATIONS;

  const mapMeta = {
    galle: { color: '#d97742', label: 'Southwest coast' },
    trincomalee: { color: '#1f8a8a', label: 'East coast' },
    kandy: { color: '#d6b56e', label: 'Central highlands' },
    ella: { color: '#7fae8c', label: 'Hill country' },
  } as const;

  return (
    <div className="container" style={{ padding: '140px 40px 120px', position: 'relative' }}>
      {/* Decorative giant numerals in background */}
      <div
        aria-hidden="true"
        className="coast-watermark"
        data-num="02"
        style={{
          position: 'absolute',
          top: 80,
          right: 40,
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(140px,20vw,300px)',
          fontWeight: 500,
          letterSpacing: '-.05em',
          color: 'rgba(248,244,234,.04)',
          lineHeight: 0.85,
          pointerEvents: 'none',
        }}
      />

      <div className="season-wrap" >
        {/* LEFT — headline + island */}
        <div>
     
          <h2 className="h-2" style={{ color: 'var(--bone)', marginTop: 18 }}>
            Two coasts.
            <br />
            Two seasons.
            <br />
            <em style={{ fontStyle: 'normal', color: 'var(--sunset)' }}>Always open.</em>
          </h2>
          <p style={{ color: 'rgba(248,244,234,.7)', fontSize: 17, lineHeight: 1.5, marginTop: 24, maxWidth: 440 }}>
            The southwest monsoon hits one coast while the northeast goes dry — so as one side puts up the umbrellas, the other turns on the sun. Pick your region, pick your season.
          </p>

          <div style={{ marginTop: 28, borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid rgba(248,244,234,.18)', boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>
            <LazyMapView pins={mapPins} pinMeta={mapMeta} active={mapPins[0]?.id} height={320} />
          </div>

          {/* <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'rgba(248,244,234,.6)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 14, height: 2, background: 'var(--sunset)', borderRadius: 1 }} />
              Southwest monsoon · wet south & west
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 14, height: 2, background: 'var(--teal)', borderRadius: 1 }} />
              Northeast monsoon · wet east
            </span>
          </div> */}
        </div>

        {/* RIGHT — four regions, each with month strip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div
            className="flex month-strip-row"
            style={{
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '0 4px 16px',
              borderBottom: '1px solid rgba(248,244,234,.1)',
            }}
          >
            <span className="eyebrow on-dark">Region</span>
            <div className="month-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(12,minmax(28px,1fr))', gap: 6, flex: 1, maxWidth: 480, marginLeft: 'auto' }}>
              {MONTHS_SHORT.map((m, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: 'center',
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 500,
                    color: i === TODAY_MONTH ? 'var(--sunset)' : 'rgba(248,244,234,.4)',
                    letterSpacing: '.05em',
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>

          {COAST_DATA.map((c, ri) => (
            <CoastRow key={c.id} c={c} isLast={ri === COAST_DATA.length - 1} />
          ))}

          {/* Today callout */}
          <div
            style={{
              marginTop: 32,
              marginBottom: 12,
              padding: '24px 28px',
              borderRadius: 'var(--r-lg)',
              background: 'linear-gradient(135deg, rgba(217,119,66,.18), rgba(31,138,138,.12))',
              border: '1px solid rgba(248,244,234,.15)',
              // display: 'grid',
              // gridTemplateColumns: 'auto 1fr auto',
              gap: 24,
              alignItems: 'center',
            }}
            className='right-wrap'
          >
            <div>
              <div className="eyebrow on-dark" style={{ color: 'rgba(248,244,234,.6)' }}>
                Right now
              </div>
              <div className="h-4" style={{ color: 'var(--bone)', marginTop: 6, fontFamily: 'var(--font-display)', fontSize: 28 }}>
                {monthName} 2026
              </div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(248,244,234,.18)', paddingLeft: 24 }}>
              <div style={{ fontSize: 13, color: 'rgba(248,244,234,.6)', marginBottom: 4 }}>
                In season today
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {activeNow.length > 0 ? (
                  activeNow.map((c) => (
                    <span
                      key={c.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 12px',
                        borderRadius: 999,
                        background: 'rgba(248,244,234,.1)',
                        border: '1px solid rgba(248,244,234,.18)',
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--bone)',
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: c.accent,
                          boxShadow: `0 0 0 3px ${c.accent}22`,
                        }}
                      />
                      {c.name}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: 13, color: 'rgba(248,244,234,.6)' }}>Check the calendar</span>
                )}
              </div>
            </div>
            <button
              className="btn btn-on-dark btn-sm"
              onClick={() => go('seasons')}
              style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
              Full calendar <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoastRow({ c, isLast }: { c: typeof COAST_DATA[0]; isLast: boolean }) {
  return (
    <div
      style={{
        // display: 'grid',
        // gridTemplateColumns: '1fr 480px',
        // gap: 32,
        // alignItems: 'center',
        // padding: '24px 4px',
        borderBottom: isLast ? 'none' : '1px solid rgba(248,244,234,.08)',
      }}
      className='coast-wrap'
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <h3
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 500,
              letterSpacing: '-.025em',
              color: 'var(--bone)',
              lineHeight: 1,
            }}
          >
            {c.name}
          </h3>
          <span
            className="mono"
            style={{
              color: c.accent,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '.03em',
            }}
          >
            {c.range}
          </span>
        </div>
        <div
          className="mono"
          style={{
            color: 'rgba(248,244,234,.55)',
            marginTop: 8,
            fontSize: 12,
            letterSpacing: '.02em',
          }}
        >
          {c.spots}
        </div>
        <div
          style={{
            fontSize: 13.5,
            color: 'rgba(248,244,234,.7)',
            lineHeight: 1.5,
            marginTop: 8,
            maxWidth: 520,
          }}
        >
          {c.note}
        </div>
      </div>
      <div className='calender-box-wrap'>
        {c.season.map((on, i) => {
          const isPeak = on && c.peak.includes(i);
          const isToday = i === TODAY_MONTH;
          return (
            <div
              key={i}
              style={{
                position: 'relative',
                height: 36,
                borderRadius: 6,
                background: on ? c.accent : 'rgba(248,244,234,.06)',
                opacity: on ? (isPeak ? 1 : 0.68) : 1,
                outline: isToday ? '1.5px solid var(--bone)' : 'none',
                outlineOffset: isToday ? 2 : 0,
                transition: 'opacity .2s',
              }}
            >
              {isToday && on && (
                <div
                  style={{
                    position: 'absolute',
                    top: -3,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--bone)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

