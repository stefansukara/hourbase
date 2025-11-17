import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  BriefcaseIcon,
  CalendarIcon,
  Bars3Icon,
  XMarkIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { NAV_LINKS } from '../../lib/constants';
import { Button } from '../ui/Button';

const icons: Record<string, React.ReactNode> = {
  Dashboard: <HomeIcon className="h-5 w-5" />,
  Projects: <BriefcaseIcon className="h-5 w-5" />,
  Calendar: <CalendarIcon className="h-5 w-5" />,
};

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
    isActive
      ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
  ].join(' ');

interface SidebarProps {
  signOut: () => void;
  userEmail?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ signOut, userEmail }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50 lg:hidden"
        aria-label="Open menu"
      >
        <Bars3Icon className="h-5 w-5 text-slate-600" />
      </button>

      {isMobileMenuOpen && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 z-[60] bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
          style={{ margin: 0, padding: 0 }}
        />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 z-[70] w-64 border-r border-slate-200/80 bg-white/95 backdrop-blur-md transition-transform duration-300 lg:translate-x-0 flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-10">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg ring-2 ring-primary-100">
                  <ClockIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Hourbase
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close menu"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Control Center
            </h1>
          </div>

          <nav className="space-y-1.5 flex-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={linkClasses}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {icons[link.label]}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-slate-200">
            {userEmail && (
              <div className="mb-3 px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Signed in as
                </p>
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {userEmail}
                </p>
              </div>
            )}
            <Button
              variant="secondary"
              onClick={signOut}
              size="sm"
              className="w-full justify-start"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
