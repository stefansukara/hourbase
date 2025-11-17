import { useState, useRef, useEffect } from 'react';
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
  className?: string;
  maxDate?: string;
  minDate?: string;
}

export const DateRangePicker = ({
  startDate,
  endDate,
  onDateChange,
  className = '',
  maxDate,
  minDate,
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update temp dates when props change
  useEffect(() => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  }, [startDate, endDate]);

  const handleApply = () => {
    onDateChange(tempStartDate, tempEndDate);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempStartDate('');
    setTempEndDate('');
    onDateChange('', '');
    setIsOpen(false);
  };

  const formatDateRange = (start: string, end: string) => {
    if (!start || !end) return 'Select date range';

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return 'Select date range';
    }

    const startFormatted = startDateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    const endFormatted = endDateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return `${startFormatted} - ${endFormatted}`;
  };

  const isDateRangeValid = () => {
    if (!tempStartDate && !tempEndDate) return true;
    if (!tempStartDate || !tempEndDate) return false;
    return new Date(tempStartDate) <= new Date(tempEndDate);
  };

  const getQuickDateRanges = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    return [
      {
        label: 'Last 7 days',
        start: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        end: todayStr,
      },
      {
        label: 'Last 30 days',
        start: new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        end: todayStr,
      },
      {
        label: 'Last 90 days',
        start: new Date(today.getTime() - 89 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        end: todayStr,
      },
      {
        label: 'This month',
        start: new Date(today.getFullYear(), today.getMonth(), 1)
          .toISOString()
          .split('T')[0],
        end: todayStr,
      },
      {
        label: 'Last month',
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1)
          .toISOString()
          .split('T')[0],
        end: new Date(today.getFullYear(), today.getMonth(), 0)
          .toISOString()
          .split('T')[0],
      },
    ];
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 border border-slate-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 w-full sm:w-auto"
      >
        <CalendarIcon className="h-4 w-4 mr-1.5 sm:mr-2 shrink-0" />
        <span className="truncate">{formatDateRange(startDate, endDate)}</span>
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown */}
          <div className="fixed inset-x-4 top-20 bottom-auto sm:absolute sm:left-0 sm:right-auto sm:top-full sm:inset-x-auto sm:mt-2 sm:w-80 max-h-[calc(100vh-6rem)] sm:max-h-[600px] overflow-y-auto bg-white rounded-xl shadow-lg border border-slate-200 z-50">
            <div className="p-4 sm:p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">Select date range</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label="Close"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Quick Date Ranges */}
              <div className="mb-4">
                <p className="text-xs sm:text-sm font-medium text-slate-700 mb-2">Quick ranges</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {getQuickDateRanges().map((range) => (
                    <button
                      key={range.label}
                      onClick={() => {
                        setTempStartDate(range.start);
                        setTempEndDate(range.end);
                      }}
                      className="px-3 py-2 text-xs sm:text-sm text-left text-slate-700 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Date Range */}
              <div className="mb-4">
                <p className="text-xs sm:text-sm font-medium text-slate-700 mb-2">Custom range</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Start date
                    </label>
                    <input
                      type="date"
                      value={tempStartDate}
                      onChange={(e) => setTempStartDate(e.target.value)}
                      max={maxDate || tempEndDate || undefined}
                      min={minDate}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      End date
                    </label>
                    <input
                      type="date"
                      value={tempEndDate}
                      onChange={(e) => setTempEndDate(e.target.value)}
                      max={maxDate}
                      min={minDate || tempStartDate || undefined}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
                <button
                  onClick={handleClear}
                  className="text-xs sm:text-sm text-slate-500 hover:text-slate-700 transition-colors text-left sm:text-left"
                >
                  Clear
                </button>
                <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 sm:space-y-0">
                  <button
                    onClick={handleCancel}
                    className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={!isDateRangeValid()}
                    className="px-3 py-2 text-xs sm:text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
