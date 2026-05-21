import { useRef, useEffect } from 'react';

interface SubHeroProps {
  eyebrow?: string;
  title: string;
  img: string;
  crumbs?: string[];
}

export function SubHero({ eyebrow, title, img, crumbs }: SubHeroProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    requestAnimationFrame(() => ref.current?.classList.add('in'));
  }, []);

  return (
    <section ref={ref} className="subhero">
      <div className="subhero-media">
        <img src={img} alt="" />
      </div>
      <div className="subhero-shade" />
      <div className="subhero-inner">
        {crumbs && (
          <div className="crumbs">
            {crumbs.map((c, i) => (
              <div key={i}>
                {i > 0 && <span className="sep">/</span>}
                <span>{c}</span>
              </div>
            ))}
          </div>
        )}
        {eyebrow && <div className="eyebrow on-dark">{eyebrow}</div>}
        <h1 className="h-1">{title}</h1>
      </div>
    </section>
  );
}
