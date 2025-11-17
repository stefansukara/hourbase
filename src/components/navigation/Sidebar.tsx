import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../lib/constants';

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100',
  ].join(' ');

export const Sidebar: React.FC = () => (
  <aside className="hidden w-64 border-r border-slate-200 bg-white/70 p-6 lg:block">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Hourbase
      </p>
      <h1 className="text-2xl font-bold text-slate-900">Control Center</h1>
    </div>

    <nav className="mt-8 space-y-2">
      {NAV_LINKS.map((link) => (
        <NavLink key={link.path} to={link.path} className={linkClasses}>
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
