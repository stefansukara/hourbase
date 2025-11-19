import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClockIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  ClipboardDocumentIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Filler,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { DateRangePicker } from '../../components/ui/DateRangePicker';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { TimeEntryForm } from '../time-entries/components/TimeEntryForm';
import { useProjectsQuery } from '../projects/hooks/useProjects';
import {
  useCreateTimeEntryMutation,
  useUpdateTimeEntryMutation,
  useDeleteTimeEntryMutation,
} from '../time-entries/hooks/useTimeEntries';
import { useAuth } from '../auth/hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { useDashboardData } from './hooks/useDashboard';
import type { TimeEntryWithProject } from '../../lib/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ChartTooltip,
  Filler,
);

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

const CHART_COLORS = {
  earnings: {
    primary: 'rgba(99, 102, 241, 0.9)',
    hover: 'rgba(99, 102, 241, 1)',
    gradient: 'rgba(99, 102, 241, 0.15)',
  },
  hours: {
    primary: 'rgba(16, 185, 129, 0.9)',
    hover: 'rgba(16, 185, 129, 1)',
    gradient: 'rgba(16, 185, 129, 0.15)',
  },
  line: {
    border: 'rgba(139, 92, 246, 1)',
    fill: 'rgba(139, 92, 246, 0.1)',
    point: 'rgba(139, 92, 246, 1)',
    pointHover: 'rgba(139, 92, 246, 0.8)',
  },
};

const formatCurrencyValue = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const createBarOptions = (
  formatLabel: (value: number) => string,
): ChartOptions<'bar'> => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#fff',
      bodyColor: '#e2e8f0',
      borderColor: 'transparent',
      padding: 12,
      displayColors: false,
      callbacks: {
        label: (context: TooltipItem<'bar'>) => {
          const prefix = context.dataset?.label ? `${context.dataset.label}: ` : '';
          return `${prefix}${formatLabel(Number(context.raw ?? 0))}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#475569', font: { size: 11 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: '#e2e8f0' },
      ticks: { color: '#475569', font: { size: 12 } },
    },
  },
});

const createLineOptions = (
  formatLabel: (value: number) => string,
): ChartOptions<'line'> => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#fff',
      bodyColor: '#e2e8f0',
      borderColor: 'transparent',
      padding: 12,
      displayColors: false,
      callbacks: {
        label: (context: TooltipItem<'line'>) => {
          const prefix = context.dataset?.label ? `${context.dataset.label}: ` : '';
          return `${prefix}${formatLabel(Number(context.raw ?? 0))}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#475569', font: { size: 12 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: '#e2e8f0' },
      ticks: { color: '#475569', font: { size: 12 } },
    },
  },
});

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { data: projects = [], isLoading: projectsLoading } = useProjectsQuery();
  const createEntry = useCreateTimeEntryMutation();
  const updateEntry = useUpdateTimeEntryMutation();
  const deleteEntry = useDeleteTimeEntryMutation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntryWithProject | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<TimeEntryWithProject | null>(null);

  const [startDate, setStartDate] = useState<string>(() => {
    const dates = getMonthDates();
    return dates.start;
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const dates = getMonthDates();
    return dates.end;
  });

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleCreateEntry = async (values: {
    entryDate: string;
    projectId: string;
    hours: number;
    notes: string;
  }) => {
    if (!user) {
      showToast('Please sign in to log time.', 'error');
      return;
    }

    try {
      await createEntry.mutateAsync({
        entry_date: values.entryDate,
        project_id: values.projectId,
        hours: values.hours,
        notes: values.notes,
        user_id: user.id,
      });
      showToast('Time entry logged successfully!', 'success');
      setIsDrawerOpen(false);
    } catch (mutationError) {
      showToast(
        mutationError instanceof Error ? mutationError.message : 'Failed to log hours',
        'error',
      );
    }
  };

  const handleUpdateEntry = async (values: {
    entryDate: string;
    projectId: string;
    hours: number;
    notes: string;
  }) => {
    if (!editingEntry) return;

    try {
      await updateEntry.mutateAsync({
        id: editingEntry.id,
        entry_date: values.entryDate,
        project_id: values.projectId,
        hours: values.hours,
        notes: values.notes,
      });
      showToast('Time entry updated successfully!', 'success');
      setEditingEntry(null);
      setIsDrawerOpen(false);
    } catch (mutationError) {
      showToast(
        mutationError instanceof Error ? mutationError.message : 'Failed to update entry',
        'error',
      );
    }
  };

  const handleDeleteClick = (entry: TimeEntryWithProject) => {
    setEntryToDelete(entry);
  };

  const handleDeleteConfirm = async () => {
    if (!entryToDelete) return;

    try {
      await deleteEntry.mutateAsync({
        id: entryToDelete.id,
        entryDate: entryToDelete.entry_date,
      });
      showToast('Time entry deleted successfully!', 'success');
      setEntryToDelete(null);
    } catch (mutationError) {
      showToast(
        mutationError instanceof Error ? mutationError.message : 'Failed to delete entry',
        'error',
      );
    }
  };

  const { timeEntries, hoursThisWeek, billableAmount, isLoading } = useDashboardData(
    startDate,
    endDate,
  );

  const activeProjects = useMemo(() => {
    return projects.filter((p) => !p.archived).length;
  }, [projects]);

  const earningsByProject = useMemo(() => {
    const projectMap = new Map<
      string,
      { name: string; earnings: number; hours: number }
    >();

    timeEntries.forEach((entry) => {
      const projectName = entry.project?.name ?? 'Unknown project';
      const hours = Number(entry.hours ?? 0);
      const rate = Number(entry.project?.hourly_rate ?? 0);
      const earnings = hours * rate;

      if (projectMap.has(projectName)) {
        const existing = projectMap.get(projectName)!;
        existing.earnings += earnings;
        existing.hours += hours;
      } else {
        projectMap.set(projectName, { name: projectName, earnings, hours });
      }
    });

    return Array.from(projectMap.values())
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 10);
  }, [timeEntries]);

  const dailyEarnings = useMemo(() => {
    const dayMap = new Map<string, number>();

    timeEntries.forEach((entry) => {
      const date = entry.entry_date;
      const hours = Number(entry.hours ?? 0);
      const rate = Number(entry.project?.hourly_rate ?? 0);
      const earnings = hours * rate;

      if (dayMap.has(date)) {
        dayMap.set(date, dayMap.get(date)! + earnings);
      } else {
        dayMap.set(date, earnings);
      }
    });

    return Array.from(dayMap.entries())
      .map(([date, earnings]) => ({
        dateKey: date,
        date: new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        earnings: Number(earnings.toFixed(2)),
      }))
      .sort((a, b) => {
        return a.dateKey.localeCompare(b.dateKey);
      });
  }, [timeEntries]);

  const earningsBarData = useMemo(
    () => ({
      labels: earningsByProject.map((item) => item.name),
      datasets: [
        {
          label: 'Earnings',
          data: earningsByProject.map((item) => Number(item.earnings.toFixed(2))),
          backgroundColor: CHART_COLORS.earnings.primary,
          borderColor: CHART_COLORS.earnings.hover,
          borderWidth: 0,
          borderRadius: 12,
          borderSkipped: false,
          hoverBackgroundColor: CHART_COLORS.earnings.hover,
          hoverBorderColor: CHART_COLORS.earnings.hover,
        },
      ],
    }),
    [earningsByProject],
  );

  const hoursBarData = useMemo(
    () => ({
      labels: earningsByProject.map((item) => item.name),
      datasets: [
        {
          label: 'Hours',
          data: earningsByProject.map((item) => Number(item.hours.toFixed(1))),
          backgroundColor: CHART_COLORS.hours.primary,
          borderColor: CHART_COLORS.hours.hover,
          borderWidth: 0,
          borderRadius: 12,
          borderSkipped: false,
          hoverBackgroundColor: CHART_COLORS.hours.hover,
          hoverBorderColor: CHART_COLORS.hours.hover,
        },
      ],
    }),
    [earningsByProject],
  );

  const dailyLineData = useMemo(
    () => ({
      labels: dailyEarnings.map((entry) => entry.date),
      datasets: [
        {
          label: 'Daily earnings',
          data: dailyEarnings.map((entry) => entry.earnings),
          borderColor: CHART_COLORS.line.border,
          backgroundColor: CHART_COLORS.line.fill,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: CHART_COLORS.line.point,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2.5,
          pointHoverBackgroundColor: CHART_COLORS.line.pointHover,
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2.5,
        },
      ],
    }),
    [dailyEarnings],
  );

  const earningsBarOptions = useMemo(
    () => createBarOptions((value) => formatCurrencyValue(value)),
    [],
  );

  const hoursBarOptions = useMemo(
    () => createBarOptions((value) => `${value.toFixed(1)}h`),
    [],
  );

  const dailyLineOptions = useMemo(
    () => createLineOptions((value) => formatCurrencyValue(value)),
    [],
  );

  const metrics = [
    {
      label: 'Total hours',
      value: `${hoursThisWeek.toFixed(1)}h`,
      icon: <ClockIcon className="h-6 w-6" />,
      color: 'bg-blue-500',
    },
    {
      label: 'Billable amount',
      value: formatCurrencyValue(billableAmount),
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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Welcome back!</h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-600">
            Overview of your time tracking and project activity.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
          />
          <Button
            onClick={() => {
              setEditingEntry(null);
              setIsDrawerOpen(true);
            }}
            disabled={!user || !projects.length}
            className="w-full sm:w-auto whitespace-nowrap"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Log time
          </Button>
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

      {!isLoading && timeEntries.length > 0 && (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <Card title="Earnings by project" variant="flat">
            {earningsByProject.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-slate-500">No earnings data available</p>
              </div>
            ) : (
              <div className="h-72">
                <Bar data={earningsBarData} options={earningsBarOptions} />
              </div>
            )}
          </Card>

          <Card title="Hours by project" variant="flat">
            {earningsByProject.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-slate-500">No hours data available</p>
              </div>
            ) : (
              <div className="h-72">
                <Bar data={hoursBarData} options={hoursBarOptions} />
              </div>
            )}
          </Card>

          {dailyEarnings.length > 0 && (
            <Card title="Daily earnings" variant="flat" className="lg:col-span-2">
              <div className="h-72">
                <Line data={dailyLineData} options={dailyLineOptions} />
              </div>
            </Card>
          )}
        </div>
      )}

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
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <div className="text-left sm:text-right">
                    <p className="text-xs sm:text-sm font-semibold text-emerald-600">
                      {entry.project?.currency ?? 'USD'}{' '}
                      {(
                        Number(entry.hours ?? 0) * Number(entry.project?.hourly_rate ?? 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={() => {
                        setEditingEntry(entry);
                        setIsDrawerOpen(true);
                      }}
                      disabled={deleteEntry.isPending}
                      title="Edit entry"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => handleDeleteClick(entry)}
                      disabled={deleteEntry.isPending}
                      title="Delete entry"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingEntry(null);
        }}
        title={editingEntry ? 'Edit time entry' : 'Log time'}
      >
        {!projects.length && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 flex items-center justify-between">
            <span>Create a project first to log hours.</span>
            <Link
              to="/projects"
              className="text-amber-800 underline hover:text-amber-900 font-medium"
              onClick={() => setIsDrawerOpen(false)}
            >
              Create Project
            </Link>
          </div>
        )}
        <TimeEntryForm
          defaultDate={new Date().toISOString().slice(0, 10)}
          projects={projects}
          entry={editingEntry}
          onSubmit={editingEntry ? handleUpdateEntry : handleCreateEntry}
          isSubmitting={editingEntry ? updateEntry.isPending : createEntry.isPending}
          disabled={!user || projectsLoading}
          onCancel={() => {
            setIsDrawerOpen(false);
            setEditingEntry(null);
          }}
        />
      </Drawer>

      <ConfirmationModal
        isOpen={!!entryToDelete}
        onClose={() => setEntryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete time entry"
        message="Are you sure you want to delete this time entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteEntry.isPending}
      />
    </div>
  );
};
