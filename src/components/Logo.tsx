interface LogoProps {
  size?: number;
}

export function Logo({ size = 28 }: LogoProps) {
  return (
    <div className="logo">
      <div className="logo-mark" style={{ width: size, height: size, fontSize: size * 0.5 }}>
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
          <path d="M12 2 L19 12 L12 22 L5 12 Z" fill="currentColor" opacity="0.85" />
          <circle cx="12" cy="12" r="2.4" fill="var(--jungle)" />
        </svg>
      </div>
      <span>TourLand</span>
    </div>
  );
}
