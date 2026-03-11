# Stroke Order Guide & Research-Informed Improvements

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add stroke-by-stroke progressive character construction guides above practice rows, switch to a pedagogically correct KaiTi font (LXGW WenKai), and integrate hanzi-writer for SVG stroke rendering.

**Architecture:** The stroke order guide renders above each practice row using SVG stroke paths from hanzi-writer-data. Each frame progressively builds the character with color coding (previous strokes in dark ink, new stroke highlighted in vermillion). The font switches from Noto Serif SC to LXGW WenKai, the standard KaiTi style used in Chinese elementary textbooks.

**Tech Stack:** React 19, TypeScript, hanzi-writer (already installed, unused), hanzi-writer-data (new), lxgw-wenkai-webfont (new), Tailwind CSS 4, Vite

---

## PRD_A1 Evaluation & Recommended Revisions

### What PRD_A1 Gets Right
- Progressive stroke building is the gold-standard pedagogical approach
- Placement above practice row matches real Chinese worksheet layouts
- Max frame limit handles complex characters gracefully
- Toggle for stroke order visibility is practical for different use cases

### Recommended Revisions Based on Research

1. **Color coding the current stroke** (PRD_A1 is silent on this)
   - Research shows the most effective pattern is: **previous strokes in dark gray/black, new stroke in red/orange**
   - This is what Arch Chinese, Skritter, and CopyWorks all do
   - **Recommendation:** Add color coding — completed strokes in `#2c2018` (ink), current stroke in `#e84b3a` (vermillion)

2. **Stroke number labels** (not in PRD_A1)
   - Some worksheets show a small number on each stroke frame (1, 2, 3...)
   - Helpful for kids to count and verify
   - **Recommendation:** Add small stroke number in corner of each frame cell

3. **Font change** (not in PRD_A1, but critical for pedagogy)
   - Current font is Noto Serif SC (Song/Ming style with decorative serifs)
   - Research confirms **KaiTi (楷体) is the standard for elementary textbooks in China**
   - LXGW WenKai is the best open-source KaiTi web font (SIL license, on Google Fonts, npm available)
   - **Recommendation:** Switch character display font to LXGW WenKai

4. **Grid type option** (not in PRD_A1)
   - 田字格 (Tianzige) is standard for Grade 1-2 beginners
   - 米字格 (Mizige) adds diagonals, better for complex characters — and it's our app's name!
   - **Recommendation:** Default to Mizige (matching the app name), with option to switch to Tianzige

5. **Frame size ratio** (PRD_A1 says 50-60%)
   - **Recommendation:** Use 55% of practice cell size as default. This is appropriate.

6. **Use hanzi-writer for stroke rendering, not just data**
   - hanzi-writer is already installed but unused
   - Its `loadCharacterData()` API provides stroke SVG paths
   - We should render strokes as actual SVG paths (not font text) in the stroke guide
   - **Recommendation:** Use hanzi-writer-data for stroke paths, render as SVG `<path>` elements

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/utils/strokes.ts` | Load stroke data from hanzi-writer, cache it, provide frame-building logic |
| `src/components/StrokeOrderGuide.tsx` | Renders the row of progressive stroke frames above a practice row |

### Modified Files
| File | Changes |
|------|---------|
| `src/index.css` | Add LXGW WenKai font import, stroke guide styles |
| `src/components/TianzigeCell.tsx` | Use LXGW WenKai font, support grid type prop (tianzige vs mizige) |
| `src/components/WorksheetRow.tsx` | Add StrokeOrderGuide above the practice cells |
| `src/components/WorksheetPreview.tsx` | Pass stroke order settings down |
| `src/components/SettingsPanel.tsx` | Add stroke order toggle, max frames stepper, grid type selector |
| `src/App.tsx` | Add state for showStrokeOrder, maxStrokeFrames, gridType |

### New Dependency
| Package | Purpose |
|---------|---------|
| `hanzi-writer-data` | Individual character stroke JSON files |
| `lxgw-wenkai-webfont` | KaiTi-style Chinese web font with unicode-range splitting |

---

## Chunk 1: Font Upgrade & Grid Type

### Task 1: Install LXGW WenKai webfont

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `src/index.css`

- [ ] **Step 1: Install the webfont package**

```bash
npm install lxgw-wenkai-webfont
```

- [ ] **Step 2: Import the font in index.css**

Replace the Google Fonts import with:

```css
@import "tailwindcss";
@import "lxgw-wenkai-webfont/style.css";
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
```

Update all `'Noto Serif SC'` references in index.css to `'LXGW WenKai'`:

```css
.char-reference {
  font-family: 'LXGW WenKai', serif;
  font-weight: 700;
}

.char-trace {
  font-family: 'LXGW WenKai', serif;
  font-weight: 700;
  opacity: 0.18;
  color: var(--ink-stroke);
}
```

- [ ] **Step 3: Update TianzigeCell.tsx font references**

In `src/components/TianzigeCell.tsx`, change all `fontFamily: "'Noto Serif SC', serif"` to `fontFamily: "'LXGW WenKai', serif"`.

- [ ] **Step 4: Update SettingsPanel.tsx font references**

In `src/components/SettingsPanel.tsx`, change the logo and textarea font references from `'Noto Serif SC'` to `'LXGW WenKai'`.

- [ ] **Step 5: Update WorksheetPreview.tsx empty state font**

Change the empty state `fontFamily` from `'Noto Serif SC'` to `'LXGW WenKai'`.

- [ ] **Step 6: Verify in browser**

```bash
npx vite --port 5173
```

Open http://localhost:5173 and verify characters now render in KaiTi style (more brush-like, less serif-decorative). The characters should look like handwriting models rather than printed book text.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: switch to LXGW WenKai (KaiTi) font for pedagogically correct character display"
```

---

### Task 2: Add grid type option (Tianzige vs Mizige)

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/TianzigeCell.tsx`
- Modify: `src/components/SettingsPanel.tsx`
- Modify: `src/components/WorksheetRow.tsx`
- Modify: `src/components/WorksheetPreview.tsx`

- [ ] **Step 1: Add gridType state to App.tsx**

Add to the state declarations:

```tsx
const [gridType, setGridType] = useState<'mizige' | 'tianzige'>('mizige');
```

Pass `gridType` to `WorksheetPreview` and `SettingsPanel`.

- [ ] **Step 2: Update TianzigeCell to support grid type**

Add `gridType` prop. When `gridType === 'tianzige'`, omit the diagonal lines. When `gridType === 'mizige'`, keep the diagonal lines (current behavior).

```tsx
interface TianzigeCellProps {
  size: number;
  char?: string;
  mode: 'reference' | 'trace' | 'blank';
  showPinyin?: boolean;
  pinyin?: string;
  gridType?: 'mizige' | 'tianzige';
}
```

Wrap the diagonal `<line>` elements in a condition:

```tsx
{gridType !== 'tianzige' && (
  <>
    {/* Diagonal lines */}
    <line ... />
    <line ... />
  </>
)}
```

- [ ] **Step 3: Add grid type selector to SettingsPanel**

Add a new section below "Paper Size" with two buttons for Mizige and Tianzige, styled like the paper size selector:

```tsx
{/* Grid type */}
<div className="flex flex-col gap-3">
  <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
    Grid Type
  </label>
  <div className="flex gap-2">
    {(['mizige', 'tianzige'] as const).map((type) => (
      <button
        key={type}
        onClick={() => onGridTypeChange(type)}
        className="flex-1 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer"
        style={{
          background: gridType === type ? 'var(--ink-border-light)' : 'transparent',
          border: `1px solid ${gridType === type ? 'var(--gold-accent)' : 'var(--ink-border)'}`,
          color: gridType === type ? 'var(--gold-accent)' : 'var(--text-muted)',
        }}
      >
        {type === 'mizige' ? '米字格' : '田字格'}
      </button>
    ))}
  </div>
</div>
```

- [ ] **Step 4: Thread gridType through WorksheetRow and WorksheetPreview**

Add `gridType` prop to both components and pass it down to `TianzigeCell`.

- [ ] **Step 5: Verify in browser**

Toggle between Mizige and Tianzige — diagonal guide lines should appear/disappear.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add grid type selector (米字格 with diagonals, 田字格 without)"
```

---

## Chunk 2: Stroke Data Infrastructure

### Task 3: Install hanzi-writer-data and create stroke utility

**Files:**
- Modify: `package.json` (via npm install)
- Create: `src/utils/strokes.ts`

- [ ] **Step 1: Install hanzi-writer-data**

```bash
npm install hanzi-writer-data
```

- [ ] **Step 2: Create src/utils/strokes.ts**

This utility loads stroke data for a character, caches it, and provides a function to generate progressive frame data.

```typescript
export interface CharacterStrokeData {
  strokes: string[];    // SVG path strings, one per stroke
  medians: number[][][]; // Median points for stroke direction
}

const cache = new Map<string, CharacterStrokeData>();

export async function loadStrokeData(char: string): Promise<CharacterStrokeData | null> {
  if (cache.has(char)) return cache.get(char)!;

  try {
    // hanzi-writer-data exports each character as a separate module
    const charCode = char.charCodeAt(0);
    const data = await import(
      /* @vite-ignore */
      `hanzi-writer-data/${charCode}.json`
    );
    const result: CharacterStrokeData = {
      strokes: data.strokes,
      medians: data.medians,
    };
    cache.set(char, result);
    return result;
  } catch {
    return null;
  }
}

export interface StrokeFrame {
  completedStrokes: string[];  // Strokes already drawn (dark color)
  currentStroke: string;       // The new stroke being added (highlighted)
  frameNumber: number;         // 1-based index
  totalStrokes: number;
}

export function generateStrokeFrames(
  strokeData: CharacterStrokeData,
  maxFrames: number
): StrokeFrame[] {
  const { strokes } = strokeData;
  const total = strokes.length;

  if (total <= maxFrames) {
    // Show every stroke as its own frame
    return strokes.map((stroke, i) => ({
      completedStrokes: strokes.slice(0, i),
      currentStroke: stroke,
      frameNumber: i + 1,
      totalStrokes: total,
    }));
  }

  // More strokes than maxFrames: show first (maxFrames - 1) then final
  const frames: StrokeFrame[] = [];
  for (let i = 0; i < maxFrames - 1; i++) {
    frames.push({
      completedStrokes: strokes.slice(0, i),
      currentStroke: strokes[i],
      frameNumber: i + 1,
      totalStrokes: total,
    });
  }

  // Final frame shows the complete character
  frames.push({
    completedStrokes: strokes.slice(0, total - 1),
    currentStroke: strokes[total - 1],
    frameNumber: total,
    totalStrokes: total,
  });

  return frames;
}
```

- [ ] **Step 3: Verify the import works**

Add a temporary test in App.tsx to confirm stroke data loads:

```tsx
// Temporary — remove after testing
import { loadStrokeData } from './utils/strokes';
loadStrokeData('黄').then(d => console.log('Stroke data:', d?.strokes.length, 'strokes'));
```

Open browser console and verify the log shows stroke count. Then remove the temporary code.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add stroke data utility with hanzi-writer-data integration and frame generation"
```

---

## Chunk 3: Stroke Order Guide Component

### Task 4: Create StrokeOrderGuide component

**Files:**
- Create: `src/components/StrokeOrderGuide.tsx`

- [ ] **Step 1: Create the component**

This component renders a row of small Tianzige cells, each showing one more stroke than the previous. The key visual feature: completed strokes are dark ink, the current (new) stroke is highlighted in vermillion.

```tsx
import { memo, useEffect, useState } from 'react';
import { loadStrokeData, generateStrokeFrames, type StrokeFrame } from '../utils/strokes';

interface StrokeOrderGuideProps {
  char: string;
  cellSize: number;     // Size of the practice cell (guide cells will be smaller)
  maxFrames: number;
  gridType: 'mizige' | 'tianzige';
}

// hanzi-writer data uses a 0-1024 coordinate system
const VIEWBOX = '0 0 1024 1024';

function StrokeOrderGuideBase({ char, cellSize, maxFrames, gridType }: StrokeOrderGuideProps) {
  const [frames, setFrames] = useState<StrokeFrame[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadStrokeData(char).then((data) => {
      if (cancelled || !data) return;
      setFrames(generateStrokeFrames(data, maxFrames));
    });
    return () => { cancelled = true; };
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
            viewBox={VIEWBOX}
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
              x1={4} y1={512} x2={1020} y2={512}
              stroke={guideColor}
              strokeWidth={4}
              strokeDasharray="20 15"
            />

            {/* Vertical center line */}
            <line
              x1={512} y1={4} x2={512} y2={1020}
              stroke={guideColor}
              strokeWidth={4}
              strokeDasharray="20 15"
            />

            {/* Diagonal lines (only for mizige) */}
            {gridType !== 'tianzige' && (
              <>
                <line
                  x1={4} y1={4} x2={1020} y2={1020}
                  stroke={guideColor} strokeWidth={3}
                  strokeDasharray="20 20" opacity={0.5}
                />
                <line
                  x1={1020} y1={4} x2={4} y2={1020}
                  stroke={guideColor} strokeWidth={3}
                  strokeDasharray="20 20" opacity={0.5}
                />
              </>
            )}

            {/* Completed strokes (dark ink) */}
            <g transform="scale(1, -1) translate(0, -900)" opacity={0.85}>
              {frame.completedStrokes.map((path, j) => (
                <path
                  key={j}
                  d={path}
                  fill="#2c2018"
                  stroke="none"
                />
              ))}
            </g>

            {/* Current stroke (vermillion highlight) */}
            <g transform="scale(1, -1) translate(0, -900)" opacity={1}>
              <path
                d={frame.currentStroke}
                fill="#e84b3a"
                stroke="none"
              />
            </g>

            {/* Stroke number */}
            <text
              x={60}
              y={120}
              style={{
                fontSize: 100,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fill: '#9a9488',
                opacity: 0.6,
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
```

**Important note on the SVG transform:** The hanzi-writer-data stroke paths use a coordinate system where Y increases upward (mathematical convention), but SVG's Y increases downward. The `transform="scale(1, -1) translate(0, -900)"` flips and repositions the strokes. The exact translate value (900) may need tuning — verify visually and adjust if strokes appear offset. The hanzi-writer library uses `translate(0, -124) scale(0.15, -0.15)` on a 150px viewBox. For our 1024 viewBox, the equivalent transform is roughly `scale(1, -1) translate(0, -900)`. If strokes look wrong, try the documented transform from hanzi-writer source.

- [ ] **Step 2: Verify rendering by temporarily adding to App.tsx**

Import and render a test StrokeOrderGuide directly in the main area to verify stroke paths render correctly. Adjust the SVG transform if needed.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add StrokeOrderGuide component with progressive color-coded stroke frames"
```

---

### Task 5: Integrate stroke guide into worksheet layout

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/SettingsPanel.tsx`
- Modify: `src/components/WorksheetRow.tsx`
- Modify: `src/components/WorksheetPreview.tsx`

- [ ] **Step 1: Add stroke order state to App.tsx**

```tsx
const [showStrokeOrder, setShowStrokeOrder] = useState(true);
const [maxStrokeFrames, setMaxStrokeFrames] = useState(8);
```

Pass these to both `SettingsPanel` and `WorksheetPreview`.

- [ ] **Step 2: Add stroke order controls to SettingsPanel**

In the "Display" section, add:

```tsx
{/* Show Stroke Order toggle */}
<div className="flex items-center justify-between">
  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Stroke Order</span>
  <button
    onClick={() => onShowStrokeOrderChange(!showStrokeOrder)}
    className="relative w-10 h-5 rounded-full transition-colors cursor-pointer"
    style={{ background: showStrokeOrder ? 'var(--vermillion)' : 'var(--ink-border)' }}
  >
    <span
      className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
      style={{ left: showStrokeOrder ? 22 : 2 }}
    />
  </button>
</div>
```

In the "Layout" section, add a max frames stepper (only visible when stroke order is on):

```tsx
{showStrokeOrder && (
  <NumberStepper label="Max stroke frames" value={maxStrokeFrames} onChange={onMaxStrokeFramesChange} min={4} max={12} />
)}
```

- [ ] **Step 3: Update WorksheetRow to include StrokeOrderGuide**

Add `showStrokeOrder`, `maxStrokeFrames`, and `gridType` props. Render the guide above the practice cells:

```tsx
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
      {/* existing reference, trace, blank cells */}
    </div>
  </div>
);
```

- [ ] **Step 4: Thread props through WorksheetPreview**

Pass `showStrokeOrder`, `maxStrokeFrames`, and `gridType` from WorksheetPreview to each WorksheetRow.

- [ ] **Step 5: Verify in browser**

Open the app and confirm:
- Stroke order guide appears above each practice row
- Progressive frames show strokes building up
- New stroke is in red/vermillion, previous strokes in dark ink
- Small frame numbers appear in each cell
- Toggling "Stroke Order" hides/shows the guide
- Max frames slider works

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: integrate stroke order guide into worksheet with toggle and max frames control"
```

---

## Chunk 4: Polish & PDF Verification

### Task 6: Verify PDF export with stroke guides

**Files:**
- Modify: `src/utils/pdf.ts` (if needed)

- [ ] **Step 1: Test PDF export**

Generate a worksheet with stroke order enabled, click Export PDF. Open the PDF and verify:
- Stroke guide frames render correctly
- Colors are preserved (vermillion for current stroke)
- Grid lines appear in the guide cells
- Layout doesn't overflow the page

- [ ] **Step 2: Fix any PDF rendering issues**

If stroke guides cause overflow or rendering issues, adjust the `html2canvas` settings (scale, element sizing) or the guide cell sizing.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A && git commit -m "fix: ensure PDF export renders stroke order guides correctly"
```

---

### Task 7: Mobile responsiveness check

**Files:**
- Modify: `src/components/StrokeOrderGuide.tsx` (if needed)
- Modify: `src/components/WorksheetPreview.tsx` (if needed)

- [ ] **Step 1: Test on narrow viewport**

Resize browser to mobile width (375px). Verify:
- Settings panel toggle still works
- Preview area scrolls horizontally if needed for wide rows
- Stroke guide cells scale appropriately

- [ ] **Step 2: Add horizontal scroll to preview if needed**

The preview container should allow horizontal scrolling for wide worksheets:

```tsx
<main className="... overflow-auto">
```

This already exists in the current code. Verify it works with the wider rows (stroke guide + practice cells).

- [ ] **Step 3: Commit any fixes**

```bash
git add -A && git commit -m "fix: ensure mobile responsiveness with stroke order guides"
```

---

## Summary of All Changes

| What | Why |
|------|-----|
| **LXGW WenKai font** | KaiTi is the standard for elementary textbooks; pedagogically correct |
| **Grid type selector** | 米字格 (diagonals) vs 田字格 (no diagonals) for different skill levels |
| **Stroke data loading** | hanzi-writer-data provides SVG stroke paths for 9000+ characters |
| **Progressive stroke frames** | Color-coded build-up (dark ink + vermillion highlight) per research |
| **Stroke number labels** | Small numbers help kids count and verify stroke order |
| **Stroke order toggle** | Teachers can simplify worksheets when stroke guide isn't needed |
| **Max frames control** | Prevents layout overflow for complex characters (up to 30+ strokes) |
