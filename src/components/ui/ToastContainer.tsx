import React from 'react';
import { Toast } from './Toast';
import type { Toast as ToastType } from './Toast';

interface ToastContainerProps {
  toasts: ToastType[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};

