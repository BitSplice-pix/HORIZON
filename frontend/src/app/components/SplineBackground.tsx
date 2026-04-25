import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

export const SCENES = {
  login: "https://prod.spline.design/xo8l5iQvgt4C-or0/scene.splinecode",
  tiles: "https://prod.spline.design/QipTqsIiQlQRNyFr/scene.splinecode",
  breath: "https://prod.spline.design/0RSfYdrEsdxsYMig/scene.splinecode",
};

export function SplineBackground({
  scene,
  dim = 0.55,
}: {
  scene: string;
  dim?: number;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
        <div className="absolute inset-0 w-full h-full">
          <Spline scene={scene} />
        </div>
      </Suspense>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `rgba(0,0,0,${dim})` }}
      />
      {/* hide spline watermark */}
      <div className="absolute bottom-0 right-0 w-44 h-14 bg-black pointer-events-none" />
    </div>
  );
}

export function StretchedTitle({
  text = "AAROGYA",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-stretch justify-center gap-[0.05em] pointer-events-none select-none ${className}`}
      style={{
        fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
        fontWeight: 400,
        letterSpacing: "0.02em",
      }}
      aria-label={text}
    >
      {text.split("").map((c, i) => {
        const t = i / Math.max(text.length - 1, 1);
        const lightness = 35 + t * 60;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: "scaleY(2.6)",
              transformOrigin: "center",
              color: `hsl(0, 0%, ${lightness}%)`,
              lineHeight: 1,
              textShadow: `0 0 ${20 + t * 30}px hsla(0,0%,100%,${0.05 + t * 0.18})`,
            }}
          >
            {c}
          </span>
        );
      })}
    </div>
  );
}
