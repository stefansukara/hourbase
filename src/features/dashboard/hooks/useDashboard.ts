import { useQuery } from '@tanstack/react-query';
import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabaseClient';
import type { TimeEntryWithProject } from '../../../lib/types';

const fetchTimeEntriesForDateRange = async (
  startDate: string,
  endDate: string,
): Promise<TimeEntryWithProject[]> => {
  const { data, error } = await supabase
    .from('time_entries')
    .select('*, project:projects(id, name, currency, hourly_rate)')
    .gte('entry_date', startDate)
    .lte('entry_date', endDate)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    throw error;
  }

  return data as unknown as TimeEntryWithProject[];
};

export const useDashboardData = (startDate?: string, endDate?: string) => {
  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - today.getDay());
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setDate(defaultStart.getDate() + 6);

  const start = startDate || defaultStart.toISOString().slice(0, 10);
  const end = endDate || defaultEnd.toISOString().slice(0, 10);

  const { data: timeEntries = [], isLoading, error } = useQuery<
    TimeEntryWithProject[],
    PostgrestError
  >({
    queryKey: ['dashboard', 'timeEntries', start, end],
    queryFn: () => fetchTimeEntriesForDateRange(start, end),
    enabled: Boolean(start && end),
  });

  const hoursThisWeek = timeEntries.reduce((total, entry) => {
    return total + Number(entry.hours ?? 0);
  }, 0);

  const billableAmount = timeEntries.reduce((total, entry) => {
    const hours = Number(entry.hours ?? 0);
    const rate = Number(entry.project?.hourly_rate ?? 0);
    return total + hours * rate;
  }, 0);

  const billableByCurrency = timeEntries.reduce((acc, entry) => {
    const currency = entry.project?.currency ?? 'USD';
    const hours = Number(entry.hours ?? 0);
    const rate = Number(entry.project?.hourly_rate ?? 0);
    const amount = hours * rate;
    
    if (!acc[currency]) {
      acc[currency] = 0;
    }
    acc[currency] += amount;
    return acc;
  }, {} as Record<string, number>);

  return {
    timeEntries,
    hoursThisWeek,
    billableAmount,
    billableByCurrency,
    isLoading,
    error,
  };
};

