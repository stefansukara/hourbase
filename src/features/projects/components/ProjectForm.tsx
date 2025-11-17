import React, { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import type { Project } from '../../../lib/types';

interface ProjectFormValues {
  name: string;
  hourlyRate: number;
  currency: string;
  description: string;
}

interface ProjectFormProps {
  onSubmit: (values: ProjectFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
  disabled?: boolean;
  project?: Project | null;
  onCancel?: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  isSubmitting = false,
  disabled = false,
  project = null,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('0');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setHourlyRate(String(project.hourly_rate ?? 0));
      setCurrency(project.currency ?? 'USD');
      setDescription(project.description ?? '');
    } else {
      setName('');
      setHourlyRate('0');
      setCurrency('USD');
      setDescription('');
    }
  }, [project]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      name,
      hourlyRate: Number(hourlyRate) || 0,
      currency,
      description,
    });
    if (!project) {
      setName('');
      setHourlyRate('0');
      setCurrency('USD');
      setDescription('');
    }
  };

  const isDisabled = disabled || isSubmitting;

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700" htmlFor="project-name">
            Project name
          </label>
          <Input
            id="project-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g., ACME Design System"
            className="mt-2"
            required
            disabled={isDisabled}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-semibold text-slate-700"
              htmlFor="hourly-rate"
            >
              Hourly rate
            </label>
            <Input
              id="hourly-rate"
              type="number"
              step="0.01"
              min="0"
              value={hourlyRate}
              onChange={(event) => setHourlyRate(event.target.value)}
              className="mt-2"
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700" htmlFor="currency">
              Currency
            </label>
            <select
              id="currency"
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-all duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              disabled={isDisabled}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-semibold text-slate-700"
            htmlFor="description"
          >
            Notes
            <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add any additional notes about this project..."
            className="mt-2 min-h-[120px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            disabled={isDisabled}
          />
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white pt-4">
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} disabled={isDisabled}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isDisabled} className="min-w-[120px]">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
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
                Saving...
              </span>
            ) : project ? (
              'Update project'
            ) : (
              'Save project'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
