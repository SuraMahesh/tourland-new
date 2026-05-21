import type { ReactNode } from 'react';

interface SecHeadProps {
  n: string;
  eyebrow: string;
  title: string;
  lede?: string;
  right?: ReactNode;
}

export function SecHead({ n, eyebrow, title, lede, right }: SecHeadProps) {
  return (
    <div className="sec-head">
      <div className="lh" style={{ maxWidth: 780 }}>
        <div className="idx-strip">
          <span className="n">{n}</span>
          <span className="l" />
          <span className="eyebrow" style={{ color: 'var(--mute)' }}>
            {eyebrow}
          </span>
        </div>
        <h2 className="h-2">{title}</h2>
        {lede && <p>{lede}</p>}
      </div>
      {right && <div className="rh">{right}</div>}
    </div>
  );
}
