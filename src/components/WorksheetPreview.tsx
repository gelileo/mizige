import { forwardRef, useMemo } from 'react';
import { WorksheetRow } from './WorksheetRow';
import { extractChineseChars, getPinyin } from '../utils/pinyin';

interface WorksheetPreviewProps {
  text: string;
  traceCells: number;
  blankCells: number;
  cellSize: number;
  showPinyin: boolean;
  showStrokeOrder: boolean;
  maxStrokeFrames: number;
  gridType: 'mizige' | 'tianzige';
}

export const WorksheetPreview = forwardRef<HTMLDivElement, WorksheetPreviewProps>(
  function WorksheetPreview(
    { text, traceCells, blankCells, cellSize, showPinyin, showStrokeOrder, maxStrokeFrames, gridType },
    ref,
  ) {
    const characters = useMemo(() => {
      const chars = extractChineseChars(text);
      return chars.map((c) => ({ char: c, pinyin: getPinyin(c) }));
    }, [text]);

    if (characters.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center opacity-50">
            <div
              className="text-6xl mb-4"
              style={{ fontFamily: "'LXGW WenKai', serif", color: '#a09080' }}
            >
              米字格
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Enter Chinese characters to generate practice sheets
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="rice-paper p-8 rounded-lg inline-block min-w-fit"
        style={{ minHeight: 200 }}
      >
        <div className="flex flex-col gap-1">
          {characters.map((c, i) => (
            <div
              key={`${c.char}-${i}`}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 40}ms`, opacity: 0 }}
            >
              <WorksheetRow
                char={c.char}
                pinyin={c.pinyin}
                traceCells={traceCells}
                blankCells={blankCells}
                cellSize={cellSize}
                showPinyin={showPinyin}
                showStrokeOrder={showStrokeOrder}
                maxStrokeFrames={maxStrokeFrames}
                gridType={gridType}
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
);
