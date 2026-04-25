import { useNavigate } from 'react-router-dom';

const TILES = [
  {
    id: 'meditation',
    label: 'Meditation',
    subtitle: 'Guided breathing sessions',
    path: '/meditation',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="14" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5"/>
        <circle cx="18" cy="18" r="8" stroke="rgba(147,197,253,0.8)" strokeWidth="1.5"/>
        <circle cx="18" cy="18" r="3" fill="rgba(147,197,253,0.9)"/>
        {[0,60,120,180,240,300].map((deg) => (
          <line key={deg}
            x1={18 + 10 * Math.cos(deg * Math.PI / 180)}
            y1={18 + 10 * Math.sin(deg * Math.PI / 180)}
            x2={18 + 14 * Math.cos(deg * Math.PI / 180)}
            y2={18 + 14 * Math.sin(deg * Math.PI / 180)}
            stroke="rgba(147,197,253,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
        ))}
      </svg>
    ),
  },
  {
    id: 'mood',
    label: "Today's Mood",
    subtitle: 'Track your emotional state',
    path: '/mood',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="4" y="4" width="28" height="28" rx="4" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5"/>
        <circle cx="18" cy="18" r="5" fill="rgba(147,197,253,0.8)"/>
        <line x1="4" y1="18" x2="32" y2="18" stroke="rgba(147,197,253,0.25)" strokeWidth="1" strokeDasharray="3 3"/>
        <line x1="18" y1="4" x2="18" y2="32" stroke="rgba(147,197,253,0.25)" strokeWidth="1" strokeDasharray="3 3"/>
      </svg>
    ),
  },
  {
    id: 'journal',
    label: 'Journal',
    subtitle: 'Write your thoughts freely',
    path: '/journal',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="6" y="4" width="22" height="28" rx="4" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5"/>
        <line x1="11" y1="12" x2="25" y2="12" stroke="rgba(147,197,253,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="11" y1="18" x2="25" y2="18" stroke="rgba(147,197,253,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="11" y1="24" x2="19" y2="24" stroke="rgba(147,197,253,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div
      className="page-enter"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 100% 50% at 50% 0%, rgba(10,30,80,0.6) 0%, #000510 65%)',
        padding: '40px 24px 60px',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Header */}
      <header style={{ maxWidth: '900px', width: '100%', margin: '0 auto', marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(29,78,216,0.6), rgba(37,99,235,0.3))',
                border: '1px solid rgba(59,130,246,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 15px rgba(37,99,235,0.25)',
              }}>
                <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                  <path d="M4 14 Q7 8 10 14 Q13 20 16 14 Q19 8 22 14 Q24 17 26 14" stroke="rgba(147,197,253,0.9)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.01em' }}>Equilibrium</span>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(226,232,240,0.4)', marginLeft: '48px' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="glass-card" style={{ padding: '8px 16px', borderRadius: '12px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(147,197,253,0.8)', fontWeight: 500 }}>● Live</span>
          </div>
        </div>

        <div style={{ marginTop: '48px' }}>
          <h1 style={{ fontSize: '44px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Good morning,<br />
            <span style={{ color: 'rgba(147,197,253,0.8)' }}>take a breath.</span>
          </h1>
          <p style={{ marginTop: '12px', fontSize: '16px', color: 'rgba(226,232,240,0.45)', fontWeight: 400, maxWidth: '380px', lineHeight: 1.6 }}>
            Your wellness space is ready. Choose where to begin today.
          </p>
        </div>
      </header>

      {/* 3 Tiles */}
      <main style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
        }}>
          {TILES.map((tile, i) => (
            <div
              key={tile.id}
              className="glass-card tile"
              onClick={() => navigate(tile.path)}
              style={{
                padding: '36px 32px',
                display: 'flex', flexDirection: 'column', gap: '20px',
                animationDelay: `${i * 0.1}s`,
                minHeight: '220px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle corner glow */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: '120px', height: '120px',
                background: 'radial-gradient(circle at top right, rgba(37,99,235,0.12), transparent 70%)',
                pointerEvents: 'none',
              }} />

              {/* Icon */}
              <div style={{
                width: '64px', height: '64px', borderRadius: '18px',
                background: 'rgba(29,78,216,0.15)',
                border: '1px solid rgba(59,130,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {tile.icon}
              </div>

              {/* Text */}
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px', letterSpacing: '-0.01em' }}>
                  {tile.label}
                </h2>
                <p style={{ fontSize: '14px', color: 'rgba(226,232,240,0.45)', fontWeight: 400, lineHeight: 1.5 }}>
                  {tile.subtitle}
                </p>
              </div>

              {/* Arrow */}
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(37,99,235,0.2)',
                  border: '1px solid rgba(59,130,246,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="rgba(147,197,253,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
