import React from 'react';
import { Card } from '../../../components/ui/Card';
import { TimeEntryForm } from '../components/TimeEntryForm';

const generatePlaceholderWeek = () => {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    return {
      label: date.toLocaleDateString(undefined, { weekday: 'short' }),
      date: date.toISOString().slice(0, 10),
      hours: Math.round(Math.random() * 8 * 10) / 10,
    };
  });
};

export const CalendarPage: React.FC = () => {
  const recentEntries = generatePlaceholderWeek();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-500">Calendar</p>
        <h1 className="text-3xl font-semibold text-slate-900">Time entries</h1>
        <p className="mt-2 text-sm text-slate-500">
          Capture hours per project. This view will evolve into a calendar grid powered by
          Supabase data.
        </p>
      </div>

      <Card title="Log time" footer="Supabase mutations coming soon">
        <TimeEntryForm />
      </Card>

      <Card title="Last 7 days">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentEntries.map((entry) => (
            <div key={entry.date} className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-500">{entry.label}</p>
              <p className="text-xl font-semibold text-slate-900">{entry.hours}h</p>
              <p className="text-sm text-slate-500">{entry.date}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
