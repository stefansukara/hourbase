import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export const TimeEntryForm: React.FC = () => {
  const today = new Date().toISOString().slice(0, 10);
  const [entryDate, setEntryDate] = useState(today);
  const [hours, setHours] = useState('1.0');
  const [notes, setNotes] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.info('Time entry payload', {
      entryDate,
      hours: Number(hours),
      notes,
    });
  };

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
      <label className="text-sm font-medium text-slate-700" htmlFor="entry-date">
        Date
        <Input
          id="entry-date"
          type="date"
          value={entryDate}
          onChange={(event) => setEntryDate(event.target.value)}
          className="mt-1"
        />
      </label>

      <label className="text-sm font-medium text-slate-700" htmlFor="hours">
        Hours
        <Input
          id="hours"
          type="number"
          step="0.25"
          min="0"
          value={hours}
          onChange={(event) => setHours(event.target.value)}
          className="mt-1"
        />
      </label>

      <label
        className="md:col-span-2 text-sm font-medium text-slate-700"
        htmlFor="notes-field"
      >
        Notes
        <textarea
          id="notes-field"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="What did you work on?"
          className="mt-1 min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
        />
      </label>

      <div className="md:col-span-2 flex justify-end">
        <Button type="submit">Log hours</Button>
      </div>
    </form>
  );
};
