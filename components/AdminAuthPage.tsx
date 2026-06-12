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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simple hardcoded authentication
    const correctUsername = 'ramisrich';
    const correctPassword = '&wokahaTick';
    const correctRelation = 'tera mummy ka bhatar';

    if (username === correctUsername && password === correctPassword && relation === correctRelation) {
      // Success
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
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/90 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl font-bold">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-2">Engineer Job Portal Management</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Admin Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                What is your relation?
              </label>
              <input
                type="text"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="Enter relation (hint: family)"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Authenticating...' : 'Login to Admin Panel'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-muted-foreground text-xs mt-6">
            🔒 This is a secure admin panel. Only authorized users can access.
          </p>
        </div>
      </div>
    </div>
  );
}
