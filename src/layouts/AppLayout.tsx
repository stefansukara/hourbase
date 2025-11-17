import React from 'react';
import { Sidebar } from '../components/navigation/Sidebar';
import { useAuth } from '../features/auth/hooks/useAuth';
import { ToastContainer } from '../components/ui/ToastContainer';
import { useToast } from '../contexts/ToastContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { toasts, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar signOut={signOut} userEmail={user?.email} />
        <main className="flex-1 px-3 pt-20 pb-4 sm:px-4 sm:pt-12 sm:pb-6 lg:ml-64 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in">
              {children}
            </div>
          </div>
        </main>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};
