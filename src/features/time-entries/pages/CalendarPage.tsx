import React, { useMemo, useState } from 'react';
import {
  PlusIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { TimeEntryForm } from '../components/TimeEntryForm';
import { Button } from '../../../components/ui/Button';
import { Drawer } from '../../../components/ui/Drawer';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { DatePicker } from '../../../components/ui/DatePicker';
import { useProjectsQuery } from '../../projects/hooks/useProjects';
import {
  useCreateTimeEntryMutation,
  useUpdateTimeEntryMutation,
  useDeleteTimeEntryMutation,
  useTimeEntriesQuery,
} from '../hooks/useTimeEntries';
import { useAuth } from '../../auth/hooks/useAuth';
import { useToast } from '../../../contexts/ToastContext';
import type { TimeEntryWithProject } from '../../../lib/types';

const formatDateLabel = (dateString: string) =>
  new Date(dateString).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

export const CalendarPage: React.FC = () => {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);
  const { user } = useAuth();
  const { showToast } = useToast();
  const { data: projects = [], isLoading: projectsLoading } = useProjectsQuery();
  const { data: entries = [], isLoading, error } = useTimeEntriesQuery(selectedDate);
  const createEntry = useCreateTimeEntryMutation();
  const updateEntry = useUpdateTimeEntryMutation();
  const deleteEntry = useDeleteTimeEntryMutation();
  const [editingEntry, setEditingEntry] = useState<TimeEntryWithProject | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<TimeEntryWithProject | null>(null);

  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        const hours = Number(entry.hours ?? 0);
        const rate = Number(entry.project?.hourly_rate ?? 0);
        acc.hours += hours;
        acc.earnings += hours * rate;
        return acc;
      },
      { hours: 0, earnings: 0 },
    );
  }, [entries]);

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

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setSelectedDate(currentDate.toISOString().slice(0, 10));
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Time entries
            </h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-600">
              Track your hours and manage time entries for your projects.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingEntry(null);
              setIsDrawerOpen(true);
            }}
            disabled={!user || !projects.length}
            className="sm:shrink-0 self-start"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Log time
          </Button>
        </div>
        <div className="w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigateDate('prev')}
              className="flex items-center justify-center h-10 w-10 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 shrink-0"
              aria-label="Previous day"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <div className="flex-1 sm:flex-initial sm:w-[200px]">
              <DatePicker value={selectedDate} onChange={setSelectedDate} />
            </div>
            <button
              type="button"
              onClick={() => navigateDate('next')}
              className="flex items-center justify-center h-10 w-10 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 shrink-0"
              aria-label="Next day"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 via-blue-50/50 to-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-slate-600">
                Hours logged
              </p>
              <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 truncate">
                {totals.hours.toFixed(2)}h
              </p>
            </div>
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white ml-3">
              <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-slate-600">
                Estimated earnings
              </p>
              <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 truncate">
                ${totals.earnings.toFixed(2)}
              </p>
            </div>
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white ml-3">
              <CurrencyDollarIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2 sm:pb-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
            {formatDateLabel(selectedDate)}
          </h2>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500">
            {entries.length === 0
              ? 'No entries yet'
              : `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`}
          </p>
        </div>
      </div>

      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
              <p className="mt-4 text-sm text-slate-500">Loading entries…</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
            <p className="text-sm font-medium text-rose-700">
              {error.message ?? 'Unable to load entries.'}
            </p>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white">
              <ClockIcon className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-base font-semibold text-slate-700">
              No entries for this day
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Click "Log time" to add your first entry.
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {entries.map((entry: TimeEntryWithProject) => (
              <div
                key={entry.id}
                className="group rounded-xl border border-slate-200 bg-white p-3 sm:p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-xs sm:text-sm font-bold text-white shadow-md">
                        {entry.project?.name?.charAt(0).toUpperCase() ?? '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-bold text-slate-900 truncate">
                          {entry.project?.name ?? 'Unknown project'}
                        </p>
                        <p className="mt-0.5 sm:mt-1 text-xs text-slate-500">
                          Logged at {new Date(entry.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    {entry.notes ? (
                      <div className="mt-2 sm:mt-3 rounded-lg bg-slate-50 p-2 sm:p-3">
                        <p className="text-xs sm:text-sm text-slate-700">{entry.notes}</p>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center sm:items-start justify-between sm:justify-end gap-3 sm:gap-4 shrink-0">
                    <div className="text-left sm:text-right">
                      <p className="text-xl sm:text-2xl font-bold text-slate-900">
                        {entry.hours}h
                      </p>
                      <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-semibold text-emerald-600">
                        {entry.project?.currency ?? 'USD'}{' '}
                        {(
                          Number(entry.hours ?? 0) *
                          Number(entry.project?.hourly_rate ?? 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-1.5 sm:gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 sm:h-10 sm:w-10 p-0"
                        onClick={() => {
                          setEditingEntry(entry);
                          setIsDrawerOpen(true);
                        }}
                        disabled={deleteEntry.isPending}
                        title="Edit entry"
                      >
                        <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 sm:h-10 sm:w-10 p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        onClick={() => handleDeleteClick(entry)}
                        disabled={deleteEntry.isPending}
                        title="Delete entry"
                      >
                        <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingEntry(null);
        }}
        title={editingEntry ? 'Edit time entry' : 'Log time'}
      >
        {!projects.length && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
            Create a project first to log hours.
          </div>
        )}
        <TimeEntryForm
          defaultDate={selectedDate}
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
