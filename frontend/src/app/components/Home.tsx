import { useState } from "react";
import { Wind, HeartPulse, BookOpen, X } from "lucide-react";
import { SplineBackground, SCENES } from "./SplineBackground";

type Tile = {
  key: "breath" | "mood" | "journal";
  badge: string;
  caption: string;
  title: string;
  blurb: string;
  icon: React.ReactNode;
  art: (hover: boolean) => React.ReactNode;
};

function BreathArt({ hover }: { hover: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="b1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      {[60, 75, 90].map((r, i) => (
        <circle
          key={r}
          cx="100"
          cy="100"
          r={r + (hover ? i * 4 : 0)}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          style={{ transition: "r 1.2s ease" }}
        />
      ))}
      <circle cx="100" cy="100" r={hover ? 55 : 45} fill="url(#b1)" style={{ transition: "r 1.2s ease" }} />
    </svg>
  );
}

function MoodArt({ hover }: { hover: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="m1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
        </linearGradient>
      </defs>
      <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.15)" />
      <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.15)" />
      {[
        [60, 70],
        [120, 60],
        [140, 110],
        [90, 130],
        [70, 150],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={hover ? 6 : 4}
          fill="url(#m1)"
          stroke="rgba(255,255,255,0.6)"
          style={{ transition: "r 0.6s ease" }}
        />
      ))}
    </svg>
  );
}

function JournalArt({ hover }: { hover: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {Array.from({ length: 7 }).map((_, i) => (
        <rect
          key={i}
          x={20 + i * 22}
          y={hover ? 40 - i : 50}
          width="16"
          height={hover ? 130 + i * 2 : 110}
          rx="6"
          fill="rgba(255,255,255,0.07)"
          stroke="rgba(255,255,255,0.18)"
          style={{ transition: "all 0.6s ease" }}
        />
      ))}
    </svg>
  );
}

const TILES: Tile[] = [
  {
    key: "breath",
    badge: "breathe",
    caption: "find your inner peace",
    title: "Meditation",
    blurb: "begin your journey inward. close your eyes, breathe deeply, and let the chaos of the world dissolve.",
    icon: <Wind size={14} />,
    art: (h) => <BreathArt hover={h} />,
  },
  {
    key: "mood",
    badge: "feel",
    caption: "how are you feeling?",
    title: "Today's Mood",
    blurb: "your emotions are a compass, not a cage. check in with yourself — notice what's rising, what's fading.",
    icon: <HeartPulse size={14} />,
    art: (h) => <MoodArt hover={h} />,
  },
  {
    key: "journal",
    badge: "write",
    caption: "write your story",
    title: "Journal",
    blurb: "words have power. pour your thoughts onto the page — unfiltered, honest, free.",
    icon: <BookOpen size={14} />,
    art: (h) => <JournalArt hover={h} />,
  },
];

export function Home({
  user,
  onPick,
  onLogout,
}: {
  user: string;
  onPick: (k: "breath" | "mood" | "journal") => void;
  onLogout: () => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pop, setPop] = useState<"help" | "account" | null>(null);

  return (
    <div className="relative w-full h-full bg-black text-white overflow-y-auto">
      <SplineBackground scene={SCENES.tiles} dim={0.65} />

      {/* nav */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 text-xs text-white/60 z-20">
        <div className="tracking-[0.5em]">AAROGYA</div>
        <div className="flex gap-5 relative">
          <button onClick={() => setPop(pop === "help" ? null : "help")} className="hover:text-white transition">
            help
          </button>
          <button onClick={() => setPop(pop === "account" ? null : "account")} className="hover:text-white transition">
            account
          </button>
        </div>
      </div>

      {pop && (
        <div
          className="absolute top-12 right-6 z-30 rounded-2xl p-5 backdrop-blur-2xl text-sm w-64"
          style={{
            background: "rgba(20,20,20,0.85)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          <button onClick={() => setPop(null)} className="absolute top-2 right-2 text-white/40 hover:text-white">
            <X size={14} />
          </button>
          {pop === "help" ? (
            <>
              <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">support</div>
              <div className="mt-3 text-white/85">contact</div>
              <div className="text-white/60 mt-1 font-mono">00000000</div>
              <div className="text-white/40 text-xs mt-3">available 24 / 7</div>
            </>
          ) : (
            <>
              <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">account</div>
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between"><span className="text-white/40">name</span><span>{user}</span></div>
                <div className="flex justify-between"><span className="text-white/40">age</span><span>24</span></div>
                <div className="flex justify-between"><span className="text-white/40">gender</span><span>—</span></div>
              </div>
              <button
                onClick={onLogout}
                className="mt-4 w-full py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 text-xs uppercase tracking-widest"
              >
                logout
              </button>
            </>
          )}
        </div>
      )}

      <div className="relative px-4 sm:px-8 py-20 max-w-6xl mx-auto z-10">
        <div className="text-center mb-10">
          <div className="text-[10px] uppercase tracking-[0.5em] text-white/45">your daily sanctuary</div>
          <h1
            className="mt-4"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 200,
              fontSize: "clamp(2.2rem, 6vw, 4rem)",
              lineHeight: 1,
            }}
          >
            Mind & Soul
          </h1>
          <p className="mt-4 text-white/50 text-sm max-w-md mx-auto">
            a mindful space to breathe, reflect, and grow — one moment at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TILES.map((t) => {
            const h = hovered === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onPick(t.key)}
                onMouseEnter={() => setHovered(t.key)}
                onMouseLeave={() => setHovered(null)}
                className="group relative text-left rounded-3xl overflow-hidden transition-all duration-500"
                style={{
                  height: "min(64vh, 480px)",
                  background: h
                    ? "linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03) 60%)"
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid rgba(255,255,255,${h ? 0.28 : 0.12})`,
                  backdropFilter: "blur(24px)",
                  boxShadow: h
                    ? "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)"
                    : "0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                  transform: h ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                {/* badge */}
                <div className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] uppercase tracking-widest text-white/80 z-10">
                  {t.icon} {t.badge}
                </div>

                {/* art */}
                <div className="absolute inset-0 flex items-center justify-center p-10 pointer-events-none opacity-90">
                  {t.art(h)}
                </div>

                {/* hover glass sheen */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                  style={{
                    opacity: h ? 1 : 0,
                    background:
                      "radial-gradient(ellipse at 30% 0%, rgba(255,255,255,0.18), transparent 60%)",
                  }}
                />

                {/* footer text */}
                <div className="absolute left-0 right-0 bottom-0 p-6">
                  <div className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                    {t.caption}
                  </div>
                  <div className="mt-2" style={{ fontSize: "1.6rem", fontWeight: 300 }}>
                    {t.title}
                  </div>
                  <div className="mt-2 text-white/50 text-xs leading-relaxed line-clamp-3">
                    {t.blurb}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
