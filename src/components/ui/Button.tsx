import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

const baseStyles =
  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900 disabled:opacity-50',
  secondary:
    'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 focus-visible:outline-slate-300 disabled:opacity-50',
};

const cx = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' ');

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className,
  ...props
}) => (
  <button className={cx(baseStyles, variants[variant], className)} {...props}>
    {children}
  </button>
);
