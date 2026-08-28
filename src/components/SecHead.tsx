import type { ReactNode } from 'react';

interface SecHeadProps {
  title: string;
  lede?: string;
  right?: ReactNode;
}

export function SecHead({ title, lede, right }: SecHeadProps) {
  return (
    <div className="sec-head">
      <div className="lh" style={{ maxWidth: 780 }}>
   
        <h2 className="h-2">{title}</h2>
        {lede && <p>{lede}</p>}
      </div>
      {right && <div className="rh">{right}</div>}
    </div>
  );
}
