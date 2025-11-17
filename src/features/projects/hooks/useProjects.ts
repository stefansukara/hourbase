import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabaseClient';
import type { Project } from '../../../lib/types';

const PROJECTS_QUERY_KEY = ['projects'];

const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    throw error;
  }
  return data;
};

interface CreateProjectInput {
  name: string;
  description: string;
  hourly_rate: number;
  currency: string;
  user_id: string;
}

interface UpdateProjectInput {
  id: string;
  name: string;
  description: string;
  hourly_rate: number;
  currency: string;
}

const createProject = async (payload: CreateProjectInput): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .insert(payload)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

const updateProject = async (payload: UpdateProjectInput): Promise<Project> => {
  const { id, ...updateData } = payload;
  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) {
    throw error;
  }
};

export const useProjectsQuery = () =>
  useQuery<Project[], PostgrestError>({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: fetchProjects,
  });

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Project, PostgrestError, CreateProjectInput>({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Project, PostgrestError, UpdateProjectInput>({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, PostgrestError, string>({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
};
