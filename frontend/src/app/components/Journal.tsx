import { useEffect, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { SplineBackground, SCENES } from "./SplineBackground";

type Entry = { date: string; text: string };
type MoodPoint = { x: number; y: number; date: string };

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function getWeekDates(): string[] {
  const today = new Date();
  const day = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function quadrantHue(x: number, y: number) {
  if (x >= 0 && y >= 0) return 80;
  if (x < 0 && y >= 0) return 10;
  if (x < 0 && y < 0) return 260;
  return 180;
}

export function Journal({ user, onBack }: { user: string; onBack: () => void }) {
  const week = getWeekDates();
  const today = new Date().toISOString().slice(0, 10);
  const [open, setOpen] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [moods, setMoods] = useState<MoodPoint[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setEntries(JSON.parse(localStorage.getItem("aarogya_journal") || "[]"));
    setMoods(JSON.parse(localStorage.getItem("aarogya_mood_history") || "[]"));
  }, [open]);

  const moodFor = (d: string) => moods.find((m) => m.date === d);
  const entryFor = (d: string) => entries.find((e) => e.date === d);

  function openTile(date: string) {
    if (date > today) return;
    setOpen(date);
    setDraft(entryFor(date)?.text || "");
  }

  function save() {
    if (!open) return;
    const next = entries.filter((e) => e.date !== open);
    if (draft.trim()) next.push({ date: open, text: draft });
    localStorage.setItem("aarogya_journal", JSON.stringify(next));
    setEntries(next);
    setOpen(null);
  }

  return (
    <div className="relative w-full h-full bg-black text-white overflow-y-auto">
      <SplineBackground scene={SCENES.tiles} dim={0.7} />

      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white text-xs uppercase tracking-widest z-20"
      >
        <ArrowLeft size={14} /> back
      </button>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-20 z-10">
        <div className="text-center mb-10">
          <div className="text-[10px] uppercase tracking-[0.5em] text-white/45">your week</div>
          <h1 className="mt-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 200, fontSize: "clamp(2rem, 5.5vw, 3.6rem)" }}>
            Journal
          </h1>
          <p className="mt-3 text-white/50 text-sm max-w-md mx-auto">
            tap a day. write what stayed with you.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {week.map((date, i) => {
            const m = moodFor(date);
            const has = !!entryFor(date);
            const isToday = date === today;
            const future = date > today;
            const hue = m ? quadrantHue(m.x, m.y) : 0;
            const h = hovered === date;
            const tint = m
              ? `linear-gradient(180deg, hsla(${hue}, 65%, 45%, 0.32), hsla(${hue}, 50%, 18%, 0.1))`
              : "rgba(255,255,255,0.04)";

            return (
              <button
                key={date}
                onClick={() => openTile(date)}
                onMouseEnter={() => setHovered(date)}
                onMouseLeave={() => setHovered(null)}
                disabled={future}
                className="group relative rounded-2xl overflow-hidden text-left transition-all duration-500 disabled:opacity-25 disabled:cursor-not-allowed"
                style={{
                  height: "min(48vh, 320px)",
                  background: tint,
                  border: `1px solid rgba(255,255,255,${isToday ? 0.4 : h ? 0.28 : 0.12})`,
                  backdropFilter: "blur(20px)",
                  boxShadow: h
                    ? "0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)"
                    : "0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                  transform: h ? "translateY(-3px)" : "translateY(0)",
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                  style={{
                    opacity: h ? 1 : 0,
                    background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.18), transparent 60%)",
                  }}
                />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-[0.4em] text-white/70">{DAYS[i]}</div>
                  {isToday && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/15 border border-white/20 uppercase tracking-widest">
                      today
                    </span>
                  )}
                </div>

                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-center">
                  <div
                    className="rounded-full mx-auto mb-3"
                    style={{
                      width: 14,
                      height: 14,
                      background: m ? `hsl(${hue}, 70%, 60%)` : "rgba(255,255,255,0.15)",
                      boxShadow: m ? `0 0 20px hsla(${hue}, 80%, 60%, 0.6)` : "none",
                    }}
                  />
                  <div className="text-[10px] text-white/40">
                    {date.slice(5)}
                  </div>
                </div>

                <div className="absolute left-4 right-4 bottom-4 text-[10px] text-white/55">
                  {has ? "entry saved" : future ? "—" : "tap to write"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className="relative w-full max-w-xl rounded-3xl p-6 sm:p-8"
            style={{
              background: "rgba(20,20,20,0.85)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
              backdropFilter: "blur(30px)",
            }}
          >
            <button onClick={() => setOpen(null)} className="absolute top-4 right-4 text-white/50 hover:text-white">
              <X size={18} />
            </button>
            <div className="text-[10px] uppercase tracking-[0.5em] text-white/50">{open}</div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, 800))}
              placeholder="write about your day, or anything in general…"
              className="mt-5 w-full h-56 bg-transparent outline-none resize-none text-white/90 placeholder:text-white/30 border border-white/10 focus:border-white/30 rounded-2xl p-4 transition"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-white/40">
              <span>{draft.length} / 800</span>
              <span>— {user}</span>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setOpen(null)} className="px-4 py-2 rounded-full text-sm text-white/70 hover:text-white">
                cancel
              </button>
              <button
                onClick={save}
                className="px-5 py-2 rounded-full text-sm bg-white/90 text-black hover:bg-white transition"
              >
                save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
