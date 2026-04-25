import { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Color Math ───────────────────────────────────────────────────────
// X-axis: Energy (Low → High), Y-axis: Mood (Sad → Happy)
// Using ONLY black and dark blue shades as required
const CORNERS = {
  // Low energy, sad   (bottom-left)
  BL: { r: 2,  g: 5,  b: 20  },
  // Low energy, happy (bottom-right) — slightly lighter blue
  BR: { r: 5,  g: 15, b: 50  },
  // High energy, sad  (top-left) — deep midnight
  TL: { r: 8,  g: 20, b: 80  },
  // High energy, happy(top-right) — brightest dark blue
  TR: { r: 15, g: 40, b: 130 },
};

function lerp(a, b, t) {
  return { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t };
}

function gridColor(x, y) {
  // y=0 → top row (high energy), y=1 → bottom row (low energy)
  const top    = lerp(CORNERS.TL, CORNERS.TR, x);
  const bottom = lerp(CORNERS.BL, CORNERS.BR, x);
  const c      = lerp(top, bottom, y);
  return `rgb(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)})`;
}

function bgFromPos(x, y) {
  // Wider, darker range for the full app background
  const brightness = 0.3 + (x * 0.35) + ((1 - y) * 0.35); // 0.3 – 1.0
  const blueR = Math.round(2  + brightness * 18);
  const blueG = Math.round(5  + brightness * 35);
  const blueB = Math.round(20 + brightness * 110);
  return `rgb(${blueR},${blueG},${blueB})`;
}

// Canvas gradient
function useGridCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const SIZE = 300;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(SIZE, SIZE);
    for (let py = 0; py < SIZE; py++) {
      for (let px = 0; px < SIZE; px++) {
        const x = px / SIZE;
        const y = py / SIZE;
        // Note: canvas y=0 is top, but we want y=0 at top = high energy
        const top    = lerp(CORNERS.TL, CORNERS.TR, x);
        const bottom = lerp(CORNERS.BL, CORNERS.BR, x);
        const c      = lerp(top, bottom, y);
        const i      = (py * SIZE + px) * 4;
        img.data[i]   = Math.round(c.r);
        img.data[i+1] = Math.round(c.g);
        img.data[i+2] = Math.round(c.b);
        img.data[i+3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [canvasRef]);
}

const MOODS = [
  { x: 0.1, y: 0.1, label: 'Anxious'   },
  { x: 0.9, y: 0.1, label: 'Energized' },
  { x: 0.1, y: 0.9, label: 'Tired'     },
  { x: 0.9, y: 0.9, label: 'Relaxed'   },
  { x: 0.5, y: 0.5, label: 'Neutral'   },
];

function getMoodLabel(x, y) {
  if (y < 0.35 && x < 0.35) return 'Anxious';
  if (y < 0.35 && x > 0.65) return 'Energized';
  if (y > 0.65 && x < 0.35) return 'Tired';
  if (y > 0.65 && x > 0.65) return 'Relaxed';
  if (y < 0.35) return 'Stressed';
  if (y > 0.65) return 'Calm';
  if (x < 0.35) return 'Low Energy';
  if (x > 0.65) return 'Active';
  return 'Balanced';
}

export default function MoodPage() {
  const navigate = useNavigate();
  const gridRef   = useRef(null);
  const canvasRef = useRef(null);
  const [pos, setPos]         = useState({ x: 0.5, y: 0.5 });
  const [dragging, setDragging] = useState(false);
  const [bg, setBg]           = useState(bgFromPos(0.5, 0.5));
  const [saved, setSaved]     = useState(false);

  useGridCanvas(canvasRef);

  const updatePos = useCallback((e) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    const x  = Math.max(0, Math.min(1, (cx - rect.left)  / rect.width));
    const y  = Math.max(0, Math.min(1, (cy - rect.top)   / rect.height));
    setPos({ x, y });
    setBg(bgFromPos(x, y));
  }, []);

  return (
    <div
      className="page-enter"
      style={{
        minHeight: '100vh',
        background: bg,
        transition: 'background 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '32px 24px 60px', position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Grid bg overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05,
        backgroundImage: 'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Back */}
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '40px' }}>
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
          color: 'rgba(147,197,253,0.7)', fontSize: '14px', fontWeight: 500, padding: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Today's Mood
        </h1>
        <p style={{ fontSize: '15px', color: 'rgba(226,232,240,0.45)' }}>
          Drag the dot to your emotional state right now
        </p>
      </div>

      {/* Grid */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        {/* Axis labels */}
        <div style={{ position: 'absolute', top: '-28px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', color: 'rgba(147,197,253,0.5)', letterSpacing: '0.1em', fontWeight: 500 }}>HIGH ENERGY</div>
        <div style={{ position: 'absolute', bottom: '-28px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', color: 'rgba(147,197,253,0.5)', letterSpacing: '0.1em', fontWeight: 500 }}>LOW ENERGY</div>
        <div style={{ position: 'absolute', left: '-52px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontSize: '11px', color: 'rgba(147,197,253,0.5)', letterSpacing: '0.1em', fontWeight: 500 }}>SAD</div>
        <div style={{ position: 'absolute', right: '-56px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', fontSize: '11px', color: 'rgba(147,197,253,0.5)', letterSpacing: '0.1em', fontWeight: 500 }}>HAPPY</div>

        {/* Grid itself */}
        <div
          ref={gridRef}
          className="glass-card"
          style={{
            width: '300px', height: '300px', position: 'relative',
            cursor: dragging ? 'grabbing' : 'crosshair',
            overflow: 'hidden', userSelect: 'none', touchAction: 'none',
            borderRadius: '24px',
          }}
          onMouseDown={(e) => { setDragging(true); updatePos(e); }}
          onMouseMove={(e) => { if (dragging) updatePos(e); }}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
          onTouchStart={(e) => { setDragging(true); updatePos(e); }}
          onTouchMove={(e) => { if (dragging) updatePos(e); e.preventDefault(); }}
          onTouchEnd={() => setDragging(false)}
        >
          {/* Canvas gradient */}
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.85, borderRadius: '24px' }}
          />

          {/* Glass shimmer overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)',
          }} />

          {/* Cross-hairs */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Draggable dot */}
          <div
            style={{
              position: 'absolute',
              left: `${pos.x * 100}%`,
              top:  `${pos.y * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: '32px', height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              boxShadow: '0 0 0 4px rgba(147,197,253,0.4), 0 0 20px rgba(255,255,255,0.6), 0 4px 12px rgba(0,0,0,0.4)',
              transition: dragging ? 'none' : 'left 0.15s ease, top 0.15s ease',
              cursor: 'grab',
              zIndex: 10,
            }}
          >
            {dragging && (
              <div style={{
                position: 'absolute', inset: '-8px', borderRadius: '50%',
                border: '2px solid rgba(147,197,253,0.4)',
                animation: 'none',
              }} />
            )}
          </div>
        </div>
      </div>

      {/* Mood label */}
      <div className="glass-card" style={{ marginTop: '44px', padding: '16px 36px', borderRadius: '16px', textAlign: 'center' }}>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
          {getMoodLabel(pos.x, pos.y)}
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(226,232,240,0.4)', marginTop: '4px' }}>
          Energy {Math.round(pos.x * 100)}% · Mood {Math.round((1 - pos.y) * 100)}%
        </div>
      </div>

      {/* Save button */}
      <button
        className="btn-primary"
        style={{ marginTop: '28px', padding: '13px 40px' }}
        onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
      >
        {saved ? '✓ Saved!' : 'Save Mood'}
      </button>
    </div>
  );
}
