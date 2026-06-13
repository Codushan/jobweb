'use client';

import { useState } from 'react';

interface AdminAuthPageProps {
  onAuthSuccess: () => void;
}

export function AdminAuthPage({ onAuthSuccess }: AdminAuthPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [relation, setRelation] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const correctUsername = 'ramisrich';
    const correctPassword = '&wokahaTick';
    const correctRelation = 'tera mummy ka bhatar';

    if (username === correctUsername && password === correctPassword && relation === correctRelation) {
      localStorage.setItem('adminAuth', 'true');
      onAuthSuccess();
    } else {
      setError('Invalid credentials. Please check all fields carefully.');
      setPassword('');
      setRelation('');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f2a4a 100%)' }}>

      {/* Animated background orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%', width: 320, height: 320,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
        animation: 'pulse 4s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '10%', width: 240, height: 240,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        animation: 'pulse 6s ease-in-out infinite 2s',
      }} />

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .auth-card { animation: slideUp 0.5s ease-out both; }
        .input-field {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid rgba(148,163,184,0.3);
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          color: #f1f5f9;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
          backdrop-filter: blur(4px);
        }
        .input-field::placeholder { color: rgba(148,163,184,0.6); }
        .input-field:focus {
          border-color: rgba(99,130,246,0.8);
          background: rgba(255,255,255,0.1);
          box-shadow: 0 0 0 3px rgba(99,130,246,0.15);
        }
        .login-btn {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.3px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: #fff;
          box-shadow: 0 4px 15px rgba(99,102,241,0.4);
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99,102,241,0.5);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div className="auth-card w-full" style={{ maxWidth: 440 }}>
        {/* Glassmorphism card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(148,163,184,0.15)',
          borderRadius: 20,
          padding: '40px 36px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 72, height: 72, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              borderRadius: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32,
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
            }}>🔐</div>
            <h1 style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>
              Admin Panel
            </h1>
            <p style={{ color: 'rgba(148,163,184,0.8)', fontSize: 13, marginTop: 6 }}>
              Engineer Job Portal Management
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: 20,
              padding: '12px 16px',
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: 10,
              color: '#fca5a5',
              fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(148,163,184,0.9)', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Admin Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="input-field"
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'rgba(148,163,184,0.9)', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="input-field"
                  style={{ paddingRight: 44 }}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(148,163,184,0.7)',
                    fontSize: 16, lineHeight: 1, padding: 0,
                  }}
                  tabIndex={-1}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: 'rgba(148,163,184,0.9)', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Security Question
              </label>
              <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: 12, marginBottom: 8 }}>What is your relation?</p>
              <input
                type="text"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="Enter relation (hint: family)"
                className="input-field"
                disabled={isLoading}
              />
            </div>

            <button type="submit" className="login-btn" disabled={isLoading} style={{ marginTop: 4 }}>
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Authenticating...
                </span>
              ) : 'Login to Admin Panel →'}
            </button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: 'center', color: 'rgba(100,116,139,0.7)', fontSize: 11, marginTop: 24 }}>
            🔒 Secure admin panel · Authorized access only
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
