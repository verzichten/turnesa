"use client";

import { useEffect, useState } from 'react';
import { auth, User } from '@/utils/auth-client';

export function useUserRole() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updatedUser = auth.getUser();
    
    // Defer state updates to avoid cascading renders warning
    const timer = setTimeout(() => {
      setUser(updatedUser);
      setLoading(false);
    }, 0);

    const refreshUser = () => {
      const newUser = auth.getUser();
      setUser(newUser);
    };

    window.addEventListener('storage', refreshUser);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', refreshUser);
    };
  }, []);

  const isAdmin = user?.role === 'ADMIN';
  const isProfessional = user?.role === 'PROFESSIONAL';
  const isClient = user?.role === 'CLIENT';
  const canAccessDashboard = isAdmin || isProfessional;

  return { user, role: user?.role, loading, isAdmin, isProfessional, isClient, canAccessDashboard };
}
