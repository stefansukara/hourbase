import React, { useMemo, useState, useEffect } from 'react';
import {
  ClockIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import { Card } from '../../components/ui/Card';
import { DateRangePicker } from '../../components/ui/DateRangePicker';
import { useProjectsQuery } from '../projects/hooks/useProjects';
import { useDashboardData } from './hooks/useDashboard';

const getMonthDates = () => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
};

export const DashboardPage: React.FC = () => {
  const { data: projects = [] } = useProjectsQuery();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    if (!startDate && !endDate) {
      const dates = getMonthDates();
      setStartDate(dates.start);
      setEndDate(dates.end);
    }
  }, [startDate, endDate]);

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const { timeEntries, hoursThisWeek, billableAmount, isLoading } = useDashboardData(
    startDate,
    endDate,
  );

  const activeProjects = useMemo(() => {
    return projects.filter((p) => !p.archived).length;
  }, [projects]);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const metrics = [
    {
      label: 'Total hours',
      value: `${hoursThisWeek.toFixed(1)}h`,
      icon: <ClockIcon className="h-6 w-6" />,
      color: 'bg-blue-500',
    },
    {
      label: 'Billable amount',
      value: formatCurrency(billableAmount),
      icon: <CurrencyDollarIcon className="h-6 w-6" />,
      color: 'bg-emerald-500',
    },
    {
      label: 'Active projects',
      value: activeProjects.toString(),
      icon: <BriefcaseIcon className="h-6 w-6" />,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Welcome back!</h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-600">
            Overview of your time tracking and project activity.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {metric.label}
                </p>
                <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-slate-900 truncate">
                  {isLoading ? '...' : metric.value}
                </p>
              </div>
              <div
                className={`${metric.color} rounded-lg p-2.5 sm:p-3 text-white shrink-0 ml-3`}
              >
                {metric.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Time entries">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
              <p className="mt-4 text-sm text-slate-500">Loading entries...</p>
            </div>
          </div>
        ) : timeEntries.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <ClipboardDocumentIcon className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-sm text-slate-500">
                No time entries for the selected date range.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {timeEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-xs font-bold text-white">
                    {entry.project?.name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                      {entry.project?.name ?? 'Unknown project'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(entry.entry_date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      · {entry.hours}h
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <p className="text-xs sm:text-sm font-semibold text-emerald-600">
                    {entry.project?.currency ?? 'USD'}{' '}
                    {(
                      Number(entry.hours ?? 0) * Number(entry.project?.hourly_rate ?? 0)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
