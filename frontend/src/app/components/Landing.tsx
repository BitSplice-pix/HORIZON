import { useState } from "react";
import { SplineBackground, SCENES } from "./SplineBackground";

export function Landing({ onLogin }: { onLogin: (name: string) => void }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const word = "AAROGYA";

  return (
    <div className="relative w-full h-full overflow-hidden bg-black text-white">
      <SplineBackground scene={SCENES.login} dim={0.7} />

      {/* AAROGYA — fills entire viewport, gradient lighter at bottom, behind card */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1] overflow-hidden"
        style={{ mixBlendMode: "screen" }}
      >
        <div
          className="flex w-full h-full items-center justify-between px-[1vw]"
          style={{
            fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {word.split("").map((c, i) => {
            const t = i / (word.length - 1);
            // top dimmer, bottom brighter — but we want lighter overall and lighter at BOTTOM via gradient
            return (
              <span
                key={i}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: "min(95vh, 26vw)",
                  background: `linear-gradient(180deg, hsl(0,0%,${40 + t * 15}%) 0%, hsl(0,0%,${75 + t * 20}%) 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: `drop-shadow(0 0 ${30 + t * 40}px hsla(0,0%,100%,${0.15 + t * 0.2}))`,
                }}
              >
                {c}
              </span>
            );
          })}
        </div>
      </div>

      {/* Login glass card */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-6 rounded-3xl backdrop-blur-2xl z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04) 60%, rgba(255,255,255,0.08))",
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(255,255,255,0.08)",
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
          width: "min(380px, 86vw)",
        }}
      >
        <div className="text-center text-[10px] uppercase tracking-[0.5em] text-white/60 mb-4">sign in</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="username"
          className="w-full bg-transparent outline-none text-center text-white placeholder:text-white/40 px-3 py-2.5 rounded-xl border border-white/15 focus:border-white/40 transition"
        />
        <div className="relative mt-3">
          <input
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full bg-transparent outline-none text-center text-white placeholder:text-white/40 px-3 py-2.5 rounded-xl border border-white/15 focus:border-white/40 transition"
          />
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-white/40 hover:text-white/80"
          >
            {showPwd ? "hide" : "show"}
          </button>
        </div>
        <button
          onClick={() => onLogin(name.trim() || "friend")}
          className="mt-4 w-full py-2.5 rounded-xl bg-white/90 text-black hover:bg-white transition"
        >
          continue
        </button>
        <div className="mt-3 text-center text-xs text-white/55">
          new user? <span className="underline cursor-pointer hover:text-white">sign up</span>
        </div>
      </div>
    </div>
  );
}
