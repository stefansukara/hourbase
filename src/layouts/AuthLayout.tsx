import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
      <div className="mb-6 text-center">
        <p className="text-sm uppercase tracking-widest text-slate-500">Hourbase</p>
        <h1 className="text-2xl font-semibold text-slate-900">
          Time tracking for developers
        </h1>
      </div>
      {children}
    </div>
  </div>
);
