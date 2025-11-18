import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  className,
  variant = 'default',
}) => {
  const baseClasses = 'rounded-xl bg-white p-6 transition-shadow';
  const variantClasses =
    variant === 'flat'
      ? 'border border-transparent shadow-none'
      : 'border border-slate-200 shadow-sm hover:shadow-md';

  return (
    <div className={`${baseClasses} ${variantClasses} ${className ?? ''}`}>
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
};
