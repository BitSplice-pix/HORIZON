import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [focused, setFocused] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div
      className="page-enter"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(15,40,100,0.7) 0%, #000510 70%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Ambient blobs */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(29,78,216,0.15) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-10%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Login Card */}
      <div
        className="glass-card float-anim"
        style={{ width: '100%', maxWidth: '420px', padding: '48px 40px' }}
      >
        {/* Logo mark */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '18px', margin: '0 auto 18px',
            background: 'linear-gradient(135deg, rgba(29,78,216,0.6), rgba(37,99,235,0.3))',
            border: '1px solid rgba(59,130,246,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(37,99,235,0.3)',
          }}>
            {/* SVG icon: simple EQ wave */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M4 14 Q7 8 10 14 Q13 20 16 14 Q19 8 22 14 Q24 17 26 14" stroke="rgba(147,197,253,0.9)" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Equilibrium
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(226,232,240,0.45)', fontWeight: 400 }}>
            Your daily wellness companion
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(226,232,240,0.6)', marginBottom: '8px', letterSpacing: '0.02em' }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              className="input-glass"
              placeholder="you@example.com"
              defaultValue="demo@equilibrium.app"
              required
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(226,232,240,0.6)', marginBottom: '8px', letterSpacing: '0.02em' }}>
              PASSWORD
            </label>
            <input
              type="password"
              className="input-glass"
              placeholder="••••••••••••"
              defaultValue="demo1234"
              required
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '12px', width: '100%' }}>
            Sign In →
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '13px', color: 'rgba(226,232,240,0.3)' }}>
          Don't have an account?{' '}
          <span style={{ color: 'rgba(147,197,253,0.7)', cursor: 'pointer' }}>Create one</span>
        </p>
      </div>
    </div>
  );
}
