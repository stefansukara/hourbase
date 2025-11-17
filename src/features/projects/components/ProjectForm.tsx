import React, { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export const ProjectForm: React.FC = () => {
  const [name, setName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('0');
  const [currency, setCurrency] = useState('USD');
  const [notes, setNotes] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Replace with Supabase mutation + React Query invalidate
    console.info('Project payload', {
      name,
      hourlyRate: Number(hourlyRate),
      currency,
      notes,
    });
  };

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
      <label className="text-sm font-medium text-slate-700" htmlFor="project-name">
        Project name
        <Input
          id="project-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="ACME Design System"
          className="mt-1"
          required
        />
      </label>

      <div className="flex gap-2">
        <label
          className="flex-1 text-sm font-medium text-slate-700"
          htmlFor="hourly-rate"
        >
          Hourly rate
          <Input
            id="hourly-rate"
            type="number"
            step="0.01"
            min="0"
            value={hourlyRate}
            onChange={(event) => setHourlyRate(event.target.value)}
            className="mt-1"
          />
        </label>
        <label className="w-28 text-sm font-medium text-slate-700" htmlFor="currency">
          Currency
          <Input
            id="currency"
            value={currency}
            onChange={(event) => setCurrency(event.target.value.toUpperCase())}
            className="mt-1"
          />
        </label>
      </div>

      <label className="md:col-span-2 text-sm font-medium text-slate-700" htmlFor="notes">
        Notes
        <textarea
          id="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Optional description of the project"
          className="mt-1 min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
        />
      </label>

      <div className="md:col-span-2 flex justify-end">
        <Button type="submit">Save project</Button>
      </div>
    </form>
  );
};
