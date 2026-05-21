import type { ReactNode } from 'react';

interface MarqueeProps {
  items: ReactNode[];
}

export function Marquee({ items }: MarqueeProps) {
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[0, 1].map((rep) => (
          <span key={rep}>
            {items.map((it, i) => (
              <div key={i}>{it}</div>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
