import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
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

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 z-[80] bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
        style={{ margin: 0, padding: 0 }}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 z-[90] w-full overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-out sm:max-w-md ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        aria-hidden={!isOpen}
        style={{ marginTop: 0, paddingTop: 0 }}
      >
        <div className="flex h-full flex-col">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 py-3 sm:py-4 shadow-sm">
            <h2 id="drawer-title" className="text-lg sm:text-xl font-bold text-slate-900 truncate pr-2">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 active:scale-95 shrink-0"
              aria-label="Close drawer"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">{children}</div>
        </div>
      </div>
    </>
  );
};
