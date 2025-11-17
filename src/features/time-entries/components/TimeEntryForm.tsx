import React, { useEffect, useState, useMemo } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { DatePicker } from '../../../components/ui/DatePicker';
import type { Project, TimeEntryWithProject } from '../../../lib/types';

interface TimeEntryFormValues {
  entryDate: string;
  projectId: string;
  hours: number;
  notes: string;
}

interface TimeEntryFormProps {
  defaultDate: string;
  projects: Project[];
  onSubmit: (values: TimeEntryFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
  disabled?: boolean;
  entry?: TimeEntryWithProject | null;
  onCancel?: () => void;
}

export const TimeEntryForm: React.FC<TimeEntryFormProps> = ({
  defaultDate,
  projects,
  onSubmit,
  isSubmitting = false,
  disabled = false,
  entry = null,
  onCancel,
}) => {
  const [entryDate, setEntryDate] = useState(defaultDate);
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const [hours, setHours] = useState('8.0');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (entry) {
      setEntryDate(entry.entry_date);
      setProjectId(entry.project_id);
      setHours(String(entry.hours ?? 0));
      setNotes(entry.notes ?? '');
    } else {
      setEntryDate(defaultDate);
      setProjectId(projects[0]?.id ?? '');
      setHours('8.0');
      setNotes('');
    }
  }, [entry, defaultDate, projects]);

  useEffect(() => {
    if (!entry) {
      setProjectId((prev) => prev || projects[0]?.id || '');
    }
  }, [projects, entry]);

  useEffect(() => {
    if (!entry) {
      setEntryDate(defaultDate);
    }
  }, [defaultDate, entry]);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === projectId),
    [projects, projectId],
  );

  const estimatedEarnings = useMemo(() => {
    if (!selectedProject || !hours) return 0;
    return Number(hours) * Number(selectedProject.hourly_rate ?? 0);
  }, [selectedProject, hours]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projectId) {
      return;
    }

    await onSubmit({
      entryDate,
      projectId,
      hours: Number(hours) || 0,
      notes,
    });

    if (!entry) {
      setHours('8.0');
      setNotes('');
    }
  };

  const isDisabled = disabled || isSubmitting || !projects.length;

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DatePicker
            label="Date"
            value={entryDate}
            onChange={setEntryDate}
            disabled={isDisabled}
          />

          <div>
            <label
              className="block text-sm font-semibold text-slate-700"
              htmlFor="project"
            >
              Project
            </label>
            <select
              id="project"
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition-all duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              disabled={isDisabled}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {selectedProject && (
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <CurrencyDollarIcon className="h-3.5 w-3.5" />
                <span>
                  {selectedProject.currency} {selectedProject.hourly_rate}/hr
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700" htmlFor="hours">
            Hours worked
          </label>
          <div className="mt-2">
            <Input
              id="hours"
              type="number"
              step="0.25"
              min="0"
              value={hours}
              onChange={(event) => setHours(event.target.value)}
              placeholder="8.0"
              className="text-lg font-semibold"
              disabled={isDisabled}
            />
            {selectedProject && hours && Number(hours) > 0 && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-700">
                    Estimated earnings
                  </span>
                  <span className="text-lg font-bold text-emerald-900">
                    {selectedProject.currency} {estimatedEarnings.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-semibold text-slate-700"
            htmlFor="notes-field"
          >
            Notes
            <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id="notes-field"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="What did you work on? Add any details about this time entry..."
            className="mt-2 min-h-[140px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            disabled={isDisabled}
          />
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white pt-4">
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isDisabled}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isDisabled} className="min-w-[140px]">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {entry ? 'Updating...' : 'Logging...'}
              </span>
            ) : entry ? (
              'Update entry'
            ) : (
              'Log hours'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
