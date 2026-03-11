import { memo } from 'react';
import { TianzigeCell } from './TianzigeCell';
import { StrokeOrderGuide } from './StrokeOrderGuide';

interface WorksheetRowProps {
  char: string;
  pinyin: string;
  traceCells: number;
  blankCells: number;
  cellSize: number;
  showPinyin: boolean;
  showStrokeOrder: boolean;
  maxStrokeFrames: number;
  gridType: 'mizige' | 'tianzige';
}

function WorksheetRowBase({
  char,
  pinyin,
  traceCells,
  blankCells,
  cellSize,
  showPinyin,
  showStrokeOrder,
  maxStrokeFrames,
  gridType,
}: WorksheetRowProps) {
  return (
    <div className="flex flex-col">
      {showStrokeOrder && (
        <StrokeOrderGuide
          char={char}
          cellSize={cellSize}
          maxFrames={maxStrokeFrames}
          gridType={gridType}
        />
      )}
      <div className="flex gap-0 items-end">
        {/* Reference cell */}
        <TianzigeCell
          size={cellSize}
          char={char}
          mode="reference"
          showPinyin={showPinyin}
          pinyin={pinyin}
          gridType={gridType}
        />

        {/* Trace cells */}
        {Array.from({ length: traceCells }, (_, i) => (
          <TianzigeCell
            key={`trace-${i}`}
            size={cellSize}
            char={char}
            mode="trace"
            showPinyin={showPinyin}
            gridType={gridType}
          />
        ))}

        {/* Blank cells */}
        {Array.from({ length: blankCells }, (_, i) => (
          <TianzigeCell
            key={`blank-${i}`}
            size={cellSize}
            mode="blank"
            showPinyin={showPinyin}
            gridType={gridType}
          />
        ))}
      </div>
    </div>
  );
}

export const WorksheetRow = memo(WorksheetRowBase);
