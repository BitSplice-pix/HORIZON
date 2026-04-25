import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { SplineBackground, SCENES } from "./SplineBackground";

export type MoodPoint = { x: number; y: number; date: string };

function quadrantHue(x: number, y: number) {
  // x, y in [-1, 1]. Map to HSL
  // Top-Right (+,+): green/yellow ~80
  // Top-Left (-,+): red/orange ~10
  // Bottom-Left (-,-): blue/purple ~260
  // Bottom-Right (+,-): teal ~180
  const tr = Math.max(0, x) * Math.max(0, y);
  const tl = Math.max(0, -x) * Math.max(0, y);
  const bl = Math.max(0, -x) * Math.max(0, -y);
  const br = Math.max(0, x) * Math.max(0, -y);
  const total = tr + tl + bl + br + 0.0001;
  // weighted hue using vector sum to avoid banding
  const ax = (tr * Math.cos((80 * Math.PI) / 180) +
    tl * Math.cos((10 * Math.PI) / 180) +
    bl * Math.cos((260 * Math.PI) / 180) +
    br * Math.cos((180 * Math.PI) / 180)) / total;
  const ay = (tr * Math.sin((80 * Math.PI) / 180) +
    tl * Math.sin((10 * Math.PI) / 180) +
    bl * Math.sin((260 * Math.PI) / 180) +
    br * Math.sin((180 * Math.PI) / 180)) / total;
  let h = (Math.atan2(ay, ax) * 180) / Math.PI;
  if (h < 0) h += 360;
  return h;
}

export function Mood({ onBack }: { onBack: () => void }) {
  const [pos, setPos] = useState({ x: 0, y: 0 }); // -1..1
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("aarogya_today_mood");
    if (stored) setPos(JSON.parse(stored));
  }, []);

  function update(clientX: number, clientY: number) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((clientX - r.left) / r.width) * 2 - 1;
    const y = -(((clientY - r.top) / r.height) * 2 - 1);
    const np = { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
    setPos(np);
  }

  function save() {
    const today = new Date().toISOString().slice(0, 10);
    const entry = { ...pos, date: today };
    localStorage.setItem("aarogya_today_mood", JSON.stringify(pos));
    const hist: MoodPoint[] = JSON.parse(localStorage.getItem("aarogya_mood_history") || "[]");
    const filtered = hist.filter((h) => h.date !== today);
    filtered.push(entry);
    localStorage.setItem("aarogya_mood_history", JSON.stringify(filtered));
    if ("vibrate" in navigator) navigator.vibrate?.(30);
  }

  const hue = quadrantHue(pos.x, pos.y);
  const bad = pos.y > 0 && pos.x < 0; // high arousal negative
  const sat = bad ? 60 : 40;
  const ambient = `radial-gradient(ellipse at 50% 50%, hsla(${hue}, ${sat}%, 50%, 0.18), transparent 65%)`;

  // 7-day data
  const hist: MoodPoint[] = JSON.parse(localStorage.getItem("aarogya_mood_history") || "[]");

  return (
    <div className="relative w-full h-full bg-black text-white overflow-hidden">
      <SplineBackground scene={SCENES.tiles} dim={0.7} />
      <div className="absolute inset-0 transition-all duration-700 pointer-events-none" style={{ background: ambient }} />
      {bad && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top, rgba(220,40,40,0.12), transparent 60%)" }}
        />
      )}

      <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-white/60 hover:text-white text-sm z-10">
        <ArrowLeft size={16} /> back
      </button>

      <div className="relative h-full w-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 px-4 sm:px-8 py-16">
        {/* Picker */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-xs uppercase tracking-[0.4em] text-white/60">how do you feel?</div>
          <div
            ref={ref}
            onPointerDown={(e) => {
              setDrag(true);
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              update(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => drag && update(e.clientX, e.clientY)}
            onPointerUp={() => setDrag(false)}
            className="relative rounded-3xl backdrop-blur-xl select-none touch-none cursor-crosshair"
            style={{
              width: "min(80vw, 420px)",
              height: "min(80vw, 420px)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* axis lines */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/15" />
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/15" />
            {/* labels */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] tracking-widest text-white/40">HIGH AROUSAL</div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] tracking-widest text-white/40">LOW AROUSAL</div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] tracking-widest text-white/40">NEGATIVE</div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-[10px] tracking-widest text-white/40">POSITIVE</div>

            <div className="absolute top-3 left-3 text-[10px] text-white/50">angry · anxious</div>
            <div className="absolute top-3 right-3 text-[10px] text-white/50 text-right">excited · happy</div>
            <div className="absolute bottom-3 left-3 text-[10px] text-white/50">sad · bored</div>
            <div className="absolute bottom-3 right-3 text-[10px] text-white/50 text-right">calm · relaxed</div>

            {/* marker */}
            <div
              className="absolute w-7 h-7 rounded-full -translate-x-1/2 -translate-y-1/2 transition-shadow"
              style={{
                left: `${((pos.x + 1) / 2) * 100}%`,
                top: `${((-pos.y + 1) / 2) * 100}%`,
                background: `hsl(${hue}, 70%, 60%)`,
                boxShadow: `0 0 30px hsla(${hue}, 80%, 60%, 0.7), inset 0 1px 0 rgba(255,255,255,0.4)`,
                border: "2px solid rgba(255,255,255,0.6)",
              }}
            />
          </div>
          <div className="text-xs text-white/50 font-mono">
            valence {pos.x.toFixed(2)} · arousal {pos.y.toFixed(2)}
          </div>
          <button
            onClick={save}
            className="mt-2 px-6 py-2 rounded-full backdrop-blur-xl border border-white/15 bg-white/10 hover:bg-white/20 text-sm transition"
          >
            save mood
          </button>
        </div>

        {/* 7-day scatter */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-xs uppercase tracking-[0.4em] text-white/60">7-day drift</div>
          <svg
            viewBox="0 0 200 200"
            width="min(80vw, 320px)"
            height="min(80vw, 320px)"
            className="rounded-3xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <line x1="100" y1="0" x2="100" y2="200" stroke="rgba(255,255,255,0.12)" />
            <line x1="0" y1="100" x2="200" y2="100" stroke="rgba(255,255,255,0.12)" />
            {hist.slice(-7).map((p, i, arr) => {
              const cx = ((p.x + 1) / 2) * 200;
              const cy = ((-p.y + 1) / 2) * 200;
              const next = arr[i + 1];
              const opacity = 0.3 + (i / Math.max(arr.length - 1, 1)) * 0.7;
              return (
                <g key={p.date}>
                  {next && (
                    <line
                      x1={cx}
                      y1={cy}
                      x2={((next.x + 1) / 2) * 200}
                      y2={((-next.y + 1) / 2) * 200}
                      stroke="rgba(255,255,255,0.25)"
                      strokeDasharray="2 2"
                    />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={i === arr.length - 1 ? 6 : 4}
                    fill={`hsl(${quadrantHue(p.x, p.y)}, 70%, 60%)`}
                    opacity={opacity}
                  />
                </g>
              );
            })}
          </svg>
          <div className="text-xs text-white/40">{hist.length} entries</div>
        </div>
      </div>
    </div>
  );
}
