import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    error: 'bg-rose-50 border-rose-200 text-rose-700',
  };

  const icons = {
    success: <CheckCircleIcon className="h-5 w-5" />,
    error: <XCircleIcon className="h-5 w-5" />,
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 animate-slide-up ${styles[toast.type]}`}
      role="alert"
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 rounded p-1 transition-colors hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-current/20"
        aria-label="Close"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

