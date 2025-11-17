import React from 'react';
import { ProjectForm } from '../components/ProjectForm';
import { Card } from '../../../components/ui/Card';

export const ProjectsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-500">Projects</p>
        <h1 className="text-3xl font-semibold text-slate-900">Clients & engagements</h1>
        <p className="mt-2 text-sm text-slate-500">
          Track the clients you bill and keep an eye on hourly rates, currency, and notes.
        </p>
      </div>

      <Card title="Create project" footer="Connected to Supabase soon">
        <ProjectForm />
      </Card>

      <Card title="Your projects">
        <p className="text-sm text-slate-500">
          Once the Supabase queries are wired up, you will see your project list right
          here.
        </p>
      </Card>
    </div>
  );
};
