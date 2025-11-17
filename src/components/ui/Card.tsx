import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, footer }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    {title ? <h2 className="text-lg font-semibold text-slate-900">{title}</h2> : null}
    <div className={title ? 'mt-4' : ''}>{children}</div>
    {footer ? <div className="mt-6 text-sm text-slate-500">{footer}</div> : null}
  </div>
);
