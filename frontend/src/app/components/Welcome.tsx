import { useEffect, useState } from "react";
import { SplineBackground, SCENES } from "./SplineBackground";

export function Welcome({ user, onContinue }: { user: string; onContinue: () => void }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 100);
    return () => clearTimeout(t);
  }, []);

  const word = "AAROGYA";

  return (
    <div className="relative w-full h-full overflow-hidden bg-black text-white">
      <SplineBackground scene={SCENES.login} dim={0.7} />

      <div className="relative h-full w-full flex items-center justify-center px-6 z-10">
        <div
          className={`text-center max-w-3xl transition-all duration-1000 ${
            shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-[10px] uppercase tracking-[0.6em] text-white/55 mb-8">
            a quiet space for the mind
          </div>

          <div className="text-white/70 text-sm tracking-[0.4em] uppercase mb-12 sm:mb-16">welcome to</div>

          {/* AAROGYA in Bebas, gradient lighter at bottom */}
          <div
            className="leading-[0.85] tracking-[0.02em]"
            style={{
              fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(4rem, 16vw, 11rem)",
              background:
                "linear-gradient(180deg, hsl(0,0%,45%) 0%, hsl(0,0%,95%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(255,255,255,0.18))",
            }}
          >
            {word}
          </div>

          <p className="mt-12 text-white/55 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            hello, <span className="text-white/85">{user}</span>. breathe, reflect, and grow — one quiet moment at a time.
          </p>

          <button
            onClick={onContinue}
            className="mt-10 px-8 py-3 rounded-full backdrop-blur-2xl border border-white/20 bg-white/10 hover:bg-white/20 transition text-xs tracking-[0.4em] uppercase"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)" }}
          >
            enter
          </button>
        </div>
      </div>
    </div>
  );
}
