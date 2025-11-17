import React from 'react';
import { Sidebar } from '../components/navigation/Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-5xl space-y-8">{children}</div>
      </main>
    </div>
  </div>
);
