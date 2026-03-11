import { memo } from 'react';

interface TianzigeCellProps {
  size: number;
  char?: string;
  mode: 'reference' | 'trace' | 'blank';
  showPinyin?: boolean;
  pinyin?: string;
  gridType?: 'mizige' | 'tianzige';
}

function TianzigeCellBase({ size, char, mode, showPinyin, pinyin, gridType = 'mizige' }: TianzigeCellProps) {
  const borderColor = '#c4a882';
  const guideColor = '#dbc8a8';

  return (
    <div className="relative flex flex-col items-center">
      {showPinyin && mode === 'reference' && pinyin && (
        <div
          className="text-center leading-none mb-0.5"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: Math.max(10, size * 0.16),
            color: '#c0572b',
            letterSpacing: '0.5px',
          }}
        >
          {pinyin}
        </div>
      )}
      {showPinyin && mode !== 'reference' && (
        <div style={{ height: Math.max(10, size * 0.16) + 2 }} />
      )}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer border */}
        <rect
          x={1}
          y={1}
          width={size - 2}
          height={size - 2}
          fill="none"
          stroke={borderColor}
          strokeWidth={1.5}
        />

        {/* Horizontal center line (dashed) */}
        <line
          x1={1}
          y1={size / 2}
          x2={size - 1}
          y2={size / 2}
          stroke={guideColor}
          strokeWidth={0.8}
          strokeDasharray="4 3"
        />

        {/* Vertical center line (dashed) */}
        <line
          x1={size / 2}
          y1={1}
          x2={size / 2}
          y2={size - 1}
          stroke={guideColor}
          strokeWidth={0.8}
          strokeDasharray="4 3"
        />

        {/* Diagonal lines (only for mizige) */}
        {gridType !== 'tianzige' && (
          <>
            <line
              x1={1}
              y1={1}
              x2={size - 1}
              y2={size - 1}
              stroke={guideColor}
              strokeWidth={0.5}
              strokeDasharray="4 4"
              opacity={0.5}
            />
            <line
              x1={size - 1}
              y1={1}
              x2={1}
              y2={size - 1}
              stroke={guideColor}
              strokeWidth={0.5}
              strokeDasharray="4 4"
              opacity={0.5}
            />
          </>
        )}

        {/* Character */}
        {char && mode !== 'blank' && (
          <text
            x={size / 2}
            y={size / 2}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fontFamily: "'LXGW WenKai', serif",
              fontWeight: 700,
              fontSize: size * 0.72,
              fill: '#2c2018',
              opacity: mode === 'reference' ? 1 : 0.15,
            }}
          >
            {char}
          </text>
        )}
      </svg>
    </div>
  );
}

export const TianzigeCell = memo(TianzigeCellBase);
