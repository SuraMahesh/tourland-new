import type { Destination } from '../types';

const SL_PATH = "M 70 18 C 58 22 48 32 42 50 C 36 70 32 92 36 116 C 38 140 44 162 56 184 C 66 202 78 218 96 226 C 116 234 138 230 152 218 C 168 202 176 178 174 152 C 172 122 162 92 148 68 C 134 46 116 28 96 22 C 88 19 80 17 70 18 Z";

interface MiniMapProps {
  pins?: Destination[];
  onPick?: (id: string) => void;
  active?: string;
  small?: boolean;
}

export function MiniMap({ pins = [], onPick, active, small = false }: MiniMapProps) {
  const W = small ? 140 : 280;
  const H = small ? 200 : 360;

  const project = (lat: number, lng: number) => {
    const x = ((lng - 79.6) / (82.0 - 79.6)) * 130 + 36;
    const y = ((9.85 - lat) / (9.85 - 5.9)) * 200 + 20;
    return [x, y] as const;
  };

  return (
    <svg viewBox="0 0 210 246" width={W} height={H} style={{ display: 'block' }}>
      <defs>
        <pattern id="dots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill={small ? "rgba(248,244,234,.25)" : "rgba(10,20,16,.18)"} />
        </pattern>
      </defs>
      <path d={SL_PATH} fill={small ? "rgba(248,244,234,.08)" : "rgba(13,59,46,.06)"} stroke={small ? "rgba(248,244,234,.25)" : "rgba(13,59,46,.45)"} strokeWidth="0.8" />
      <path d={SL_PATH} fill="url(#dots)" />
      {pins.map((p) => {
        const [x, y] = project(p.lat, p.lng);
        const isActive = active === p.id;
        return (
          <g key={p.id} style={{ cursor: onPick ? 'pointer' : 'default' }} onClick={() => onPick && onPick(p.id)}>
            <circle
              cx={x}
              cy={y}
              r={isActive ? 7 : 4}
              fill={isActive ? "var(--sunset)" : small ? "var(--sand)" : "var(--jungle)"}
              stroke={small ? "var(--ink)" : "var(--bone)"}
              strokeWidth={isActive ? 2 : 1.5}
            />
            {!small && (
              <text x={x + 9} y={y + 3} fontSize="8" fill="var(--ink)" fontFamily="var(--font-body)" fontWeight="500">
                {p.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
