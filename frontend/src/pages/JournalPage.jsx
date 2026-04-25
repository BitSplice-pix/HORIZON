import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'equilibrium_journal';

export default function JournalPage() {
  const navigate = useNavigate();
  const [text, setText]       = useState('');
  const [entries, setEntries] = useState([]);
  const [saved, setSaved]     = useState(false);
  const [newIds, setNewIds]   = useState(new Set());

  // Load entries from localStorage on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setEntries(stored);
    } catch {
      setEntries([]);
    }
  }, []);

  const handleSave = () => {
    if (!text.trim()) return;

    const entry = {
      id: Date.now(),
      text: text.trim(),
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [entry, ...entries];
    setEntries(updated);
    setNewIds(prev => new Set([...prev, entry.id]));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setText('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setTimeout(() => setNewIds(prev => { const n = new Set(prev); n.delete(entry.id); return n; }), 600);
  };

  const handleDelete = (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div
      className="page-enter"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(8,20,70,0.7) 0%, #000510 65%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '32px 24px 80px', position: 'relative',
      }}
    >
      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: 'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div style={{ width: '100%', maxWidth: '640px' }}>
        {/* Back */}
        <div style={{ marginBottom: '40px' }}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            color: 'rgba(147,197,253,0.7)', fontSize: '14px', fontWeight: 500, padding: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Journal
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(226,232,240,0.45)' }}>
            Write freely. Your words stay private.
          </p>
        </div>

        {/* Write area */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind today…"
            style={{
              width: '100%', minHeight: '160px', resize: 'vertical',
              background: 'transparent', border: 'none', outline: 'none',
              color: '#e2e8f0', fontSize: '16px', fontFamily: 'inherit',
              lineHeight: 1.7, letterSpacing: '0.01em',
              caretColor: 'rgba(147,197,253,0.9)',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '13px', color: 'rgba(226,232,240,0.3)' }}>
              {text.length > 0 ? `${text.trim().split(/\s+/).filter(Boolean).length} words` : 'Start writing...'}
            </span>
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={!text.trim()}
              style={{
                padding: '10px 28px', fontSize: '14px',
                opacity: text.trim() ? 1 : 0.4,
                cursor: text.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              {saved ? '✓ Saved' : 'Save Entry'}
            </button>
          </div>
        </div>

        {/* Past entries */}
        {entries.length > 0 && (
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(226,232,240,0.4)', letterSpacing: '0.08em', marginBottom: '16px' }}>
              PREVIOUS ENTRIES
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`glass-card ${newIds.has(entry.id) ? 'entry-fade' : ''}`}
                  style={{ padding: '22px 24px', position: 'relative' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(147,197,253,0.6)' }}>
                        {entry.date}
                      </span>
                      <span style={{ fontSize: '12px', color: 'rgba(226,232,240,0.3)', marginLeft: '10px' }}>
                        {entry.time}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(226,232,240,0.2)', fontSize: '18px', lineHeight: 1,
                        transition: 'color 0.2s', padding: '0 4px',
                      }}
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                  <p style={{
                    fontSize: '15px', color: 'rgba(226,232,240,0.75)',
                    lineHeight: 1.7, fontWeight: 400,
                    display: '-webkit-box', WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {entry.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {entries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(226,232,240,0.2)', fontSize: '14px' }}>
            Your entries will appear here after you save them.
          </div>
        )}
      </div>
    </div>
  );
}
