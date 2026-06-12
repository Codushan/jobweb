'use client';

import { useEffect, useState } from 'react';
import { AdminAuthPage } from '@/components/AdminAuthPage';
import { AdminPanel } from '@/components/AdminPanel';

export default function AdminPage() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (isAuth) {
      setIsAdminAuthenticated(true);
      setShowAdminAuth(false);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <p className="text-primary-foreground text-lg">Loading admin panel...</p>
      </div>
    );
  }

  if (showAdminAuth && !isAdminAuthenticated) {
    return (
      <AdminAuthPage
        onAuthSuccess={() => {
          setIsAdminAuthenticated(true);
          setShowAdminAuth(false);
        }}
      />
    );
  }

  if (isAdminAuthenticated) {
    return (
      <AdminPanel
        onLogout={() => {
          localStorage.removeItem('adminAuth');
          setIsAdminAuthenticated(false);
          setShowAdminAuth(true);
          window.location.href = '/';
        }}
      />
    );
  }

  return null;
}
