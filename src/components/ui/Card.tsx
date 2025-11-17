import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, footer, className }) => (
  <div
    className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${className ?? ''}`}
  >
    {title ? (
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
    ) : null}
    <div>{children}</div>
    {footer ? (
      <div className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-500">
        {footer}
      </div>
    ) : null}
  </div>
);
