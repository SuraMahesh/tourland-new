import { COAST_DATA } from '../data';

const MONTHS_SHORT = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const TODAY_MONTH = new Date().getMonth();

interface TwoCoastsProps {
  go: (route: string, params?: Record<string, any>) => void;
}

export function TwoCoasts({ go }: TwoCoastsProps) {
  const activeNow = COAST_DATA.filter((c) => c.season[TODAY_MONTH]);
  const monthName = new Date().toLocaleDateString('en-GB', { month: 'long' });

  return (
    <div className="container" style={{ padding: '140px 40px 120px', position: 'relative' }}>
      {/* Decorative giant numerals in background */}
      <div
        aria-hidden="true"
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
      >
        02
      </div>

      <div className="season-wrap" >
        {/* LEFT — headline + island */}
        <div>
          <div className="idx-strip" style={{ color: 'rgba(248,244,234,.5)' }}>
            <span className="n" style={{ color: 'var(--bone)' }}>
              02
            </span>
            <span className="l" style={{ background: 'rgba(248,244,234,.3)' }} />
            <span className="eyebrow on-dark">When to go</span>
          </div>
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

          <IslandWithMonsoons activeNow={activeNow} />
        </div>

        {/* RIGHT — four regions, each with month strip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div
            className="flex"
            style={{
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '0 4px 16px',
              borderBottom: '1px solid rgba(248,244,234,.1)',
            }}
          >
            <span className="eyebrow on-dark">Region</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,minmax(28px,1fr))', gap: 6, flex: 1, maxWidth: 480, marginLeft: 'auto' }}>
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
              padding: '24px 28px',
              borderRadius: 'var(--r-lg)',
              background: 'linear-gradient(135deg, rgba(217,119,66,.18), rgba(31,138,138,.12))',
              border: '1px solid rgba(248,244,234,.15)',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap: 24,
              alignItems: 'center',
            }}
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,minmax(28px,1fr))', gap: 6 }}>
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

function IslandWithMonsoons({ activeNow }: { activeNow: typeof COAST_DATA }) {
  const SL =
    'M 70 18 C 58 22 48 32 42 50 C 36 70 32 92 36 116 C 38 140 44 162 56 184 C 66 202 78 218 96 226 C 116 234 138 230 152 218 C 168 202 176 178 174 152 C 172 122 162 92 148 68 C 134 46 116 28 96 22 C 88 19 80 17 70 18 Z';
  const swActive = activeNow.some((c) => c.id === 'sw');
  const eActive = activeNow.some((c) => c.id === 'east');

  return (
    <div style={{ marginTop: 48, position: 'relative', display: 'flex', alignItems: 'center', gap: 32 }}>
      <svg viewBox="0 0 240 280" width="240" height="280" style={{ flexShrink: 0 }}>
        <defs>
          <marker id="ar-sw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--sunset)" />
          </marker>
          <marker id="ar-ne" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--teal)" />
          </marker>
          <pattern id="dotsD" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="rgba(248,244,234,.28)" />
          </pattern>
        </defs>

        {/* Island */}
        <g transform="translate(40,20)">
          <path d={SL} fill="rgba(248,244,234,.08)" stroke="rgba(248,244,234,.45)" strokeWidth="0.8" />
          <path d={SL} fill="url(#dotsD)" />
          {/* Pulse dot on currently-active coast */}
          {swActive && (
            <circle cx="60" cy="200" r="6" fill="var(--sunset)" opacity="0.9">
              <animate attributeName="r" values="6;10;6" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.4s" repeatCount="indefinite" />
            </circle>
          )}
          {eActive && (
            <circle cx="140" cy="100" r="6" fill="var(--teal)" opacity="0.9">
              <animate attributeName="r" values="6;10;6" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.4s" repeatCount="indefinite" />
            </circle>
          )}
        </g>

        {/* SW monsoon — wavy arrow approaching from bottom-left */}
        <path
          d="M 6 250 Q 30 230 50 215 Q 70 200 80 200"
          fill="none"
          stroke="var(--sunset)"
          strokeWidth="1.5"
          strokeDasharray="3,3"
          markerEnd="url(#ar-sw)"
          opacity="0.6"
        />
        <text x="6" y="266" fontSize="9" fill="var(--sunset)" fontFamily="var(--font-mono)" letterSpacing=".05em">
          SW · MAY–SEP
        </text>

        {/* NE monsoon — wavy arrow approaching from top-right */}
        <path
          d="M 234 30 Q 210 50 190 70 Q 175 85 175 95"
          fill="none"
          stroke="var(--teal)"
          strokeWidth="1.5"
          strokeDasharray="3,3"
          markerEnd="url(#ar-ne)"
          opacity="0.7"
        />
        <text x="166" y="20" fontSize="9" fill="var(--teal)" fontFamily="var(--font-mono)" letterSpacing=".05em">
          NE · OCT–JAN
        </text>
      </svg>

      <div style={{ maxWidth: 280 }}>
        <div className="eyebrow on-dark" style={{ color: 'rgba(248,244,234,.55)' }}>
          How it works
        </div>
        <p style={{ margin: '12px 0 0', fontSize: 14, color: 'rgba(248,244,234,.78)', lineHeight: 1.55 }}>
          When the southwest monsoon hits Galle, Trincomalee on the other side is dry. Six months later, they swap.
        </p>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'rgba(248,244,234,.55)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 14, height: 2, background: 'var(--sunset)', borderRadius: 1 }} />
            Southwest monsoon · wet south & west
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 14, height: 2, background: 'var(--teal)', borderRadius: 1 }} />
            Northeast monsoon · wet east
          </span>
        </div>
      </div>
    </div>
  );
}
