import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { SplineBackground, SCENES } from "./SplineBackground";

type Phase = "inhale" | "hold" | "exhale";
// total cycle = 8s to match Spline sand-timer
const DURATIONS: Record<Phase, number> = { inhale: 3000, hold: 2000, exhale: 3000 };

export function Breathing({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [running, setRunning] = useState(true);
  const [cycles, setCycles] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!running) return;
    setElapsed(0);
    const start = Date.now();
    const tick = setInterval(() => setElapsed(Date.now() - start), 100);
    const t = setTimeout(() => {
      setPhase((p) => {
        if (p === "inhale") return "hold";
        if (p === "hold") return "exhale";
        setCycles((c) => c + 1);
        return "inhale";
      });
      if ("vibrate" in navigator) navigator.vibrate?.(20);
    }, DURATIONS[phase]);
    return () => {
      clearTimeout(t);
      clearInterval(tick);
    };
  }, [phase, running]);

  const remain = Math.max(0, Math.ceil((DURATIONS[phase] - elapsed) / 1000));

  return (
    <div className="relative w-full h-full bg-black text-white overflow-hidden">
      <SplineBackground scene={SCENES.breath} dim={0.55} />

      {/* nav */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white text-xs uppercase tracking-widest z-20"
      >
        <ArrowLeft size={14} /> back to dashboard
      </button>

      <div className="absolute top-6 right-6 text-[10px] uppercase tracking-[0.4em] text-white/50 z-20">
        cycle {cycles}
      </div>

      {/* Top — title + cycle info */}
      <div className="absolute top-0 left-0 right-0 pt-20 sm:pt-24 px-6 text-center z-10 pointer-events-none">
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)",
          }}
        >
          Meditation
        </div>
        <div className="text-white/55 text-xs sm:text-sm mt-2 tracking-[0.3em] uppercase">
          3 · 2 · 3 breathing · calming cycle
        </div>
      </div>

      {/* Bottom — phase + button */}
      <div className="absolute bottom-0 left-0 right-0 pb-12 sm:pb-16 px-6 flex flex-col items-center gap-5 z-10">
        <div className="text-center">
          <div
            className="capitalize"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 300, letterSpacing: "0.05em" }}
          >
            {phase}
          </div>
          <div className="text-white/60 text-xs mt-2 tracking-[0.3em] uppercase">
            cycle {cycles} · {remain} sec
          </div>
        </div>

        <button
          onClick={() => setRunning((r) => !r)}
          className="px-8 py-3 rounded-full backdrop-blur-2xl border border-white/20 bg-white/10 hover:bg-white/20 text-sm tracking-[0.3em] uppercase transition"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)" }}
        >
          {running ? "end session" : "resume"}
        </button>
      </div>
    </div>
  );
}
