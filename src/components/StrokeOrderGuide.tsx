import { memo, useEffect, useState } from 'react';
import {
  loadStrokeData,
  generateStrokeFrames,
  type StrokeFrame,
} from '../utils/strokes';

interface StrokeOrderGuideProps {
  char: string;
  cellSize: number;
  maxFrames: number;
  gridType: 'mizige' | 'tianzige';
}

function StrokeOrderGuideBase({
  char,
  cellSize,
  maxFrames,
  gridType,
}: StrokeOrderGuideProps) {
  const [frames, setFrames] = useState<StrokeFrame[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadStrokeData(char).then((data) => {
      if (cancelled || !data) return;
      setFrames(generateStrokeFrames(data, maxFrames));
    });
    return () => {
      cancelled = true;
    };
  }, [char, maxFrames]);

  if (frames.length === 0) return null;

  const guideSize = Math.round(cellSize * 0.55);
  const borderColor = '#c4a882';
  const guideColor = '#dbc8a8';

  return (
    <div className="flex gap-0 items-end mb-0.5">
      {frames.map((frame, i) => (
        <div key={i} className="relative">
          <svg
            width={guideSize}
            height={guideSize}
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer border */}
            <rect
              x={4}
              y={4}
              width={1016}
              height={1016}
              fill="none"
              stroke={borderColor}
              strokeWidth={8}
            />

            {/* Horizontal center line */}
            <line
              x1={4}
              y1={512}
              x2={1020}
              y2={512}
              stroke={guideColor}
              strokeWidth={4}
              strokeDasharray="20 15"
            />

            {/* Vertical center line */}
            <line
              x1={512}
              y1={4}
              x2={512}
              y2={1020}
              stroke={guideColor}
              strokeWidth={4}
              strokeDasharray="20 15"
            />

            {/* Diagonal lines (only for mizige) */}
            {gridType !== 'tianzige' && (
              <>
                <line
                  x1={4}
                  y1={4}
                  x2={1020}
                  y2={1020}
                  stroke={guideColor}
                  strokeWidth={3}
                  strokeDasharray="20 20"
                  opacity={0.5}
                />
                <line
                  x1={1020}
                  y1={4}
                  x2={4}
                  y2={1020}
                  stroke={guideColor}
                  strokeWidth={3}
                  strokeDasharray="20 20"
                  opacity={0.5}
                />
              </>
            )}

            {/* Stroke paths — hanzi-writer uses Y-up, SVG uses Y-down */}
            <g transform="scale(1, -1) translate(0, -900)">
              {/* Completed strokes (dark ink) */}
              {frame.completedStrokes.map((path, j) => (
                <path key={j} d={path} fill="#2c2018" stroke="none" opacity={0.85} />
              ))}

              {/* Current stroke (vermillion highlight) */}
              <path d={frame.currentStroke} fill="#e84b3a" stroke="none" />
            </g>

            {/* Stroke number */}
            <text
              x={55}
              y={115}
              style={{
                fontSize: 95,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fill: '#9a9488',
                opacity: 0.5,
              }}
            >
              {frame.frameNumber}
            </text>
          </svg>
        </div>
      ))}
    </div>
  );
}

export const StrokeOrderGuide = memo(StrokeOrderGuideBase);
