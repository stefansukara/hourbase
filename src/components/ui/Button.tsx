import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

const baseStyles =
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md focus-visible:outline-slate-900',
  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:shadow-sm focus-visible:outline-slate-300',
  ghost:
    'text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-300',
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const cx = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' ');

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => (
  <button className={cx(baseStyles, variants[variant], sizes[size], className)} {...props}>
    {children}
  </button>
);
