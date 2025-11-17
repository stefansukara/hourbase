import React from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface DatePickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  id,
  value,
  onChange,
  label,
  className = '',
  disabled = false,
  min,
  max,
}) => {
  const inputId = id || `date-picker-${Math.random().toString(36).substring(7)}`;

  return (
    <div className={className}>
      {label && (
        <label
          className="block text-sm font-semibold text-slate-700 mb-2"
          htmlFor={inputId}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <CalendarIcon className="h-5 w-5 text-slate-400" />
        </div>
        <input
          id={inputId}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          min={min}
          max={max}
          className="block w-full rounded-lg border border-slate-300 bg-white pl-11 pr-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition-all duration-200 placeholder-slate-400 hover:border-slate-400 hover:shadow-md focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 disabled:hover:border-slate-300 disabled:hover:shadow-sm"
        />
      </div>
    </div>
  );
};
