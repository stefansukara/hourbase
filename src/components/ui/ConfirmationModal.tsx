import React, { useEffect } from 'react';
import { TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const confirmButtonClass =
    variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500'
      : 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500';

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 bottom-0 z-[80] bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={isLoading ? undefined : onClose}
        aria-hidden="true"
        style={{ margin: 0, padding: 0 }}
      />

      <div
        className="fixed top-1/2 left-1/2 z-[90] w-[calc(100%-2rem)] sm:w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-message"
      >
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex items-start gap-3 sm:gap-4">
            <div
              className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl ${
                variant === 'danger'
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              {variant === 'danger' ? (
                <TrashIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                id="confirmation-title"
                className="text-lg sm:text-xl font-bold text-slate-900"
              >
                {title}
              </h3>
              <p
                id="confirmation-message"
                className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-600"
              >
                {message}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`${confirmButtonClass} w-full sm:w-auto order-1 sm:order-2`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
