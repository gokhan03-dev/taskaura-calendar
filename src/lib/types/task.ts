
import { RecurrencePattern } from "./meeting";

export interface Task {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  recurrence_pattern?: RecurrencePattern;
  tags?: Array<{ id?: string; label: string; }>;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  category_id?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: Array<{ id?: string; label: string; }>;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
  status?: 'pending' | 'in_progress' | 'completed';
  completed_at?: string | null;
}
