import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const PHASES = [
  { label: 'Inhale',  duration: 4500, expand: true  },
  { label: 'Hold',    duration: 2000, expand: true  },
  { label: 'Exhale',  duration: 4500, expand: false },
  { label: 'Rest',    duration: 1500, expand: false },
];

export default function MeditationPage() {
  const navigate = useNavigate();
  const [phaseIdx, setPhaseIdx]   = useState(0);
  const [running, setRunning]     = useState(false);
  const [cycles,  setCycles]      = useState(0);
  const timeoutRef = useRef(null);

  const phase = PHASES[phaseIdx];

  const next = (idx) => {
    const nextIdx = (idx + 1) % PHASES.length;
    if (nextIdx === 0) setCycles(c => c + 1);
    setPhaseIdx(nextIdx);
    timeoutRef.current = setTimeout(() => next(nextIdx), PHASES[nextIdx].duration);
  };

  const start = () => {
    setRunning(true);
    setPhaseIdx(0);
    timeoutRef.current = setTimeout(() => next(0), PHASES[0].duration);
  };

  const stop = () => {
    setRunning(false);
    clearTimeout(timeoutRef.current);
    setPhaseIdx(0);
    setCycles(0);
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const blobStyle = running
    ? phase.expand
      ? 'breathe-in'
      : 'breathe-out'
    : '';

  return (
    <div
      className="page-enter"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(10,25,70,0.8) 0%, #000510 70%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '32px 24px', position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: 'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Back button */}
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '40px' }}>
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
          color: 'rgba(147,197,253,0.7)', fontSize: '14px', fontWeight: 500,
          transition: 'color 0.2s', padding: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Meditation
        </h1>
        <p style={{ fontSize: '15px', color: 'rgba(226,232,240,0.45)' }}>
          4-7-8 breathing · calming cycle
        </p>
      </div>

      {/* Breathing blob */}
      <div style={{ position: 'relative', width: '260px', height: '260px', marginBottom: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer ring pulse */}
        <div className="glow-pulse" style={{
          position: 'absolute', inset: '-30px',
          borderRadius: '50%',
          border: '1px solid rgba(59,130,246,0.15)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: '-15px',
          borderRadius: '50%',
          border: '1px solid rgba(59,130,246,0.1)',
          pointerEvents: 'none',
        }} />

        {/* Core blob */}
        <div
          className={blobStyle}
          style={{
            width: '160px', height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, rgba(59,130,246,0.6) 0%, rgba(29,78,216,0.8) 50%, rgba(15,40,120,0.95) 100%)',
            boxShadow: '0 0 60px rgba(37,99,235,0.5), 0 0 120px rgba(29,78,216,0.25), inset 0 0 30px rgba(147,197,253,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Inner highlight */}
          <div style={{
            width: '50px', height: '30px',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.2), transparent)',
            borderRadius: '50%',
            transform: 'translateY(-20px) translateX(-10px)',
          }} />
        </div>
      </div>

      {/* Phase label */}
      <div style={{ textAlign: 'center', marginBottom: '48px', minHeight: '64px' }}>
        {running ? (
          <>
            <div style={{
              fontSize: '36px', fontWeight: 700, color: '#e2e8f0',
              letterSpacing: '-0.02em', marginBottom: '8px',
              transition: 'all 0.5s ease',
            }}>
              {phase.label}
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(226,232,240,0.4)' }}>
              Cycle {cycles + 1} · {phase.label === 'Inhale' ? '4 sec' : phase.label === 'Hold' ? '2 sec' : phase.label === 'Exhale' ? '4 sec' : '...'}
            </p>
          </>
        ) : (
          <p style={{ fontSize: '16px', color: 'rgba(226,232,240,0.4)', lineHeight: 1.6 }}>
            Press start when you're ready<br/>to begin your breathing session.
          </p>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '16px' }}>
        {!running ? (
          <button className="btn-primary" onClick={start} style={{ padding: '14px 48px', fontSize: '16px' }}>
            Begin Session
          </button>
        ) : (
          <button
            onClick={stop}
            style={{
              padding: '14px 48px', fontSize: '16px', fontWeight: 600,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(226,232,240,0.7)', borderRadius: '14px', cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            End Session
          </button>
        )}
      </div>

      {/* Stats */}
      {cycles > 0 && (
        <div className="glass-card" style={{ marginTop: '36px', padding: '12px 28px', borderRadius: '14px' }}>
          <span style={{ fontSize: '14px', color: 'rgba(147,197,253,0.7)' }}>
            {cycles} cycle{cycles > 1 ? 's' : ''} completed ✦
          </span>
        </div>
      )}
    </div>
  );
}
