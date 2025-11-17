import React from 'react';
import { Card } from '../../components/ui/Card';

const metrics = [
  { label: 'Hours this week', value: '32.5h' },
  { label: 'Billable amount', value: '$4,875' },
  { label: 'Active projects', value: '5' },
];

export const DashboardPage: React.FC = () => (
  <div className="space-y-6">
    <div>
      <p className="text-sm uppercase tracking-wide text-slate-500">Dashboard</p>
      <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-500">
        This overview will pull real numbers from Supabase soon. For now it acts as a
        skeleton layout.
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <p className="text-sm text-slate-500">{metric.label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{metric.value}</p>
        </Card>
      ))}
    </div>

    <Card title="Recent activity">
      <p className="text-sm text-slate-500">
        Hook up TanStack Query + Supabase RPC to populate this section with real time
        entry data.
      </p>
    </Card>
  </div>
);
