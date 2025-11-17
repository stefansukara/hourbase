import React, { useState } from 'react';
import {
  BriefcaseIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../auth/hooks/useAuth';
import {
  useProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from '../hooks/useProjects';
import { ProjectForm } from '../components/ProjectForm';
import { Button } from '../../../components/ui/Button';
import { Drawer } from '../../../components/ui/Drawer';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { useToast } from '../../../contexts/ToastContext';
import type { Project } from '../../../lib/types';

export const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { data: projects, isLoading, error } = useProjectsQuery();
  const createProject = useCreateProjectMutation();
  const updateProject = useUpdateProjectMutation();
  const deleteProject = useDeleteProjectMutation();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleCreateProject = async (values: {
    name: string;
    hourlyRate: number;
    currency: string;
    description: string;
  }) => {
    if (!user) {
      showToast('Please sign in to create projects.', 'error');
      return;
    }

    try {
      await createProject.mutateAsync({
        name: values.name,
        description: values.description,
        hourly_rate: values.hourlyRate,
        currency: values.currency,
        user_id: user.id,
      });
      showToast('Project created successfully!', 'success');
      setIsDrawerOpen(false);
    } catch (mutationError) {
      showToast(
        mutationError instanceof Error ? mutationError.message : 'Failed to save project',
        'error',
      );
    }
  };

  const handleUpdateProject = async (values: {
    name: string;
    hourlyRate: number;
    currency: string;
    description: string;
  }) => {
    if (!editingProject) return;

    try {
      await updateProject.mutateAsync({
        id: editingProject.id,
        name: values.name,
        description: values.description,
        hourly_rate: values.hourlyRate,
        currency: values.currency,
      });
      showToast('Project updated successfully!', 'success');
      setEditingProject(null);
      setIsDrawerOpen(false);
    } catch (mutationError) {
      showToast(
        mutationError instanceof Error
          ? mutationError.message
          : 'Failed to update project',
        'error',
      );
    }
  };

  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject.mutateAsync(projectToDelete);
      showToast('Project deleted successfully!', 'success');
      setProjectToDelete(null);
    } catch (mutationError) {
      showToast(
        mutationError instanceof Error
          ? mutationError.message
          : 'Failed to delete project',
        'error',
      );
    }
  };

  const renderProjects = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
            <p className="mt-4 text-sm text-slate-500">Loading projects…</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-medium text-rose-700">
            {error.message ?? 'Unable to load projects just yet.'}
          </p>
        </div>
      );
    }

    if (!projects?.length) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <BriefcaseIcon className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-700">No projects yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Create your first project above to get started.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: Project) => {
          const rate = Number(project.hourly_rate ?? 0).toFixed(2);
          return (
            <div
              key={project.id}
              className="group rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-lg"
            >
              <div className="mb-3 sm:mb-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-xs sm:text-sm font-bold text-white shadow-md">
                  {project.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="mb-3 sm:mb-4 rounded-lg bg-slate-50 p-2.5 sm:p-3">
                <p className="text-xs font-medium text-slate-500">Hourly rate</p>
                <p className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">
                  {project.currency} {rate}
                </p>
              </div>
              {project.description ? (
                <p className="mb-3 sm:mb-4 line-clamp-2 text-xs sm:text-sm text-slate-600">
                  {project.description}
                </p>
              ) : (
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm italic text-slate-400">
                  No description
                </p>
              )}
              <div className="flex gap-2 border-t border-slate-100 pt-3 sm:pt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 text-xs sm:text-sm"
                  onClick={() => {
                    setEditingProject(project);
                    setIsDrawerOpen(true);
                  }}
                  disabled={deleteProject.isPending}
                >
                  <PencilIcon className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 shrink-0"
                  onClick={() => handleDeleteClick(project.id)}
                  disabled={deleteProject.isPending}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-6 lg:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Projects & engagements
          </h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-600">
            Track the clients you bill and keep an eye on hourly rates, currency, and
            notes.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProject(null);
            setIsDrawerOpen(true);
          }}
          disabled={!user}
          className="sm:shrink-0 self-start"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Create project
        </Button>
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingProject(null);
        }}
        title={editingProject ? 'Edit project' : 'Create project'}
      >
        <ProjectForm
          project={editingProject}
          onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
          isSubmitting={
            editingProject ? updateProject.isPending : createProject.isPending
          }
          disabled={!user}
          onCancel={() => {
            setIsDrawerOpen(false);
            setEditingProject(null);
          }}
        />
      </Drawer>

      <div>
        <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-slate-900">
          Your projects
        </h2>
        {renderProjects()}
      </div>

      <ConfirmationModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteProject.isPending}
      />
    </div>
  );
};
