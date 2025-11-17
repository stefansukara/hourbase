import React from 'react';
import { AuthRoutes } from './AuthRoutes';
import { AppRoutes } from './AppRoutes';
import { useAuth } from '../features/auth/hooks/useAuth';

export const RouterProvider: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        Checking session...
      </div>
    );
  }

  if (!user) {
    return <AuthRoutes />;
  }

  return <AppRoutes />;
};
