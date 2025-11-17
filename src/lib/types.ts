export interface Profile {
  id: string;
  full_name: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  hourly_rate: number;
  currency: string;
  archived: boolean;
  created_at: string;
}

export interface TimeEntry {
  id: string;
  user_id: string;
  project_id: string;
  entry_date: string;
  hours: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimeEntryWithProject extends TimeEntry {
  project?: Pick<Project, 'id' | 'name' | 'currency' | 'hourly_rate'> | null;
}
