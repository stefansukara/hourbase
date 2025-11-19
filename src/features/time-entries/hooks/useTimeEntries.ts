import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabaseClient';
import type { TimeEntryWithProject } from '../../../lib/types';

const TIME_ENTRIES_QUERY_KEY = ['timeEntries'];

const fetchEntriesForDate = async (
  entryDate: string,
): Promise<TimeEntryWithProject[]> => {
  const { data, error } = await supabase
    .from('time_entries')
    .select('*, project:projects(id, name, currency, hourly_rate)')
    .eq('entry_date', entryDate)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as unknown as TimeEntryWithProject[];
};

interface CreateTimeEntryInput {
  user_id: string;
  project_id: string;
  entry_date: string;
  hours: number;
  notes: string;
}

interface UpdateTimeEntryInput {
  id: string;
  project_id: string;
  entry_date: string;
  hours: number;
  notes: string;
}

const createTimeEntry = async (
  payload: CreateTimeEntryInput,
): Promise<TimeEntryWithProject> => {
  const { data, error } = await supabase
    .from('time_entries')
    .insert(payload)
    .select('*, project:projects(id, name, currency, hourly_rate)')
    .single();

  if (error) {
    throw error;
  }

  return data as TimeEntryWithProject;
};

const updateTimeEntry = async (
  payload: UpdateTimeEntryInput,
): Promise<TimeEntryWithProject> => {
  const { id, ...updateData } = payload;
  const { data, error } = await supabase
    .from('time_entries')
    .update(updateData)
    .eq('id', id)
    .select('*, project:projects(id, name, currency, hourly_rate)')
    .single();

  if (error) {
    throw error;
  }

  return data as TimeEntryWithProject;
};

const deleteTimeEntry = async (id: string): Promise<void> => {
  const { error } = await supabase.from('time_entries').delete().eq('id', id);
  if (error) {
    throw error;
  }
};

export const useTimeEntriesQuery = (entryDate: string) =>
  useQuery<TimeEntryWithProject[], PostgrestError>({
    queryKey: [...TIME_ENTRIES_QUERY_KEY, entryDate],
    queryFn: () => fetchEntriesForDate(entryDate),
    enabled: Boolean(entryDate),
  });

export const useCreateTimeEntryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TimeEntryWithProject, PostgrestError, CreateTimeEntryInput>({
    mutationFn: createTimeEntry,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [...TIME_ENTRIES_QUERY_KEY, data.entry_date],
      });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateTimeEntryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TimeEntryWithProject, PostgrestError, UpdateTimeEntryInput>({
    mutationFn: updateTimeEntry,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [...TIME_ENTRIES_QUERY_KEY, data.entry_date],
      });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteTimeEntryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, PostgrestError, { id: string; entryDate: string }>({
    mutationFn: ({ id }) => deleteTimeEntry(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...TIME_ENTRIES_QUERY_KEY, variables.entryDate],
      });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
