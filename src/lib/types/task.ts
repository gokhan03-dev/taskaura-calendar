
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
  categories?: {
    id: string;
    name: string;
    color: string;
  } | null;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  category_id?: string | null;
  due_date?: string | null;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  status?: 'pending' | 'in_progress' | 'completed';
  completed_at?: string | null;
}
