import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { ToastContainer } from '../components/ui/ToastContainer';
import { useToast } from '../contexts/ToastContext';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
        <div className="w-full max-w-md animate-slide-up rounded-2xl border border-slate-200/50 bg-white/95 backdrop-blur-sm p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-indigo-600 shadow-lg ring-4 ring-primary-100">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
              Hourbase
            </p>
            <h1 className="mt-2 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-2xl font-bold text-transparent">
              Time tracking for remote workers
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Track your hours, manage projects, and bill clients effortlessly.
            </p>
          </div>
          {children}
        </div>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};
