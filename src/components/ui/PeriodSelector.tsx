import React, { useEffect } from 'react';
import { DateRangePicker } from './DateRangePicker';

export type PeriodType =
  | 'week'
  | 'month'
  | '3months'
  | '6months'
  | 'year'
  | 'lastyear'
  | 'custom';

interface PeriodSelectorProps {
  period: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  className?: string;
}

const getPeriodDates = (period: PeriodType): { start: string; end: string } => {
  const today = new Date();
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  let start = new Date();

  switch (period) {
    case 'week': {
      const day = today.getDay();
      const diff = today.getDate() - day;
      start = new Date(today.setDate(diff));
      break;
    }
    case 'month': {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    }
    case '3months': {
      start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
      break;
    }
    case '6months': {
      start = new Date(today.getFullYear(), today.getMonth() - 5, 1);
      break;
    }
    case 'year': {
      start = new Date(today.getFullYear(), 0, 1);
      break;
    }
    case 'lastyear': {
      start = new Date(today.getFullYear() - 1, 0, 1);
      end = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
      break;
    }
    default:
      return { start: '', end: '' };
  }

  start.setHours(0, 0, 0, 0);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
};

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  period,
  onPeriodChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className = '',
}) => {
  const periods: { value: PeriodType; label: string }[] = [
    { value: 'week', label: 'This week' },
    { value: 'month', label: 'This month' },
    { value: '3months', label: 'Last 3 months' },
    { value: '6months', label: 'Last 6 months' },
    { value: 'year', label: 'This year' },
    { value: 'lastyear', label: 'Last year' },
  ];

  useEffect(() => {
    if (period !== 'custom' && onStartDateChange && onEndDateChange && !startDate && !endDate) {
      const dates = getPeriodDates(period);
      onStartDateChange(dates.start);
      onEndDateChange(dates.end);
    }
  }, [period, onStartDateChange, onEndDateChange, startDate, endDate]);

  const handlePeriodChange = (newPeriod: PeriodType) => {
    onPeriodChange(newPeriod);
    if (newPeriod !== 'custom' && onStartDateChange && onEndDateChange) {
      const dates = getPeriodDates(newPeriod);
      onStartDateChange(dates.start);
      onEndDateChange(dates.end);
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {periods.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => handlePeriodChange(p.value)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
              period === p.value
                ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {onStartDateChange && onEndDateChange && (
        <DateRangePicker
          startDate={startDate || ''}
          endDate={endDate || ''}
          onDateChange={(start, end) => {
            onStartDateChange(start);
            onEndDateChange(end);
          }}
        />
      )}
    </div>
  );
};

