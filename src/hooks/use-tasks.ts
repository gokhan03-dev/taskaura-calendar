
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  category_id: string | null;
  priority: string;
  status: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface CreateTaskInput {
  title: string;
  description?: string;
  due_date?: string;
  category_id?: string;
  priority?: "high" | "medium" | "low";
  tags?: { id: string; label: string }[];
  subtasks?: { title: string; completed?: boolean }[];
  dependencies?: string[];
}

export function useTasks() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all tasks
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          subtasks (
            id,
            title,
            completed
          ),
          task_tags (
            tag_id,
            tags (
              id,
              name
            )
          ),
          categories (
            id,
            name,
            color
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Create task mutation
  const createTask = useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      // Start a Supabase transaction
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: input.title,
          description: input.description,
          due_date: input.due_date,
          category_id: input.category_id,
          priority: input.priority || 'medium',
          status: 'pending'
        })
        .select()
        .single();

      if (taskError) throw taskError;

      // Insert subtasks if any
      if (input.subtasks && input.subtasks.length > 0) {
        const { error: subtasksError } = await supabase
          .from('subtasks')
          .insert(
            input.subtasks.map(subtask => ({
              task_id: task.id,
              title: subtask.title,
              completed: subtask.completed || false
            }))
          );

        if (subtasksError) throw subtasksError;
      }

      // Insert task tags if any
      if (input.tags && input.tags.length > 0) {
        const { error: tagsError } = await supabase
          .from('task_tags')
          .insert(
            input.tags.map(tag => ({
              task_id: task.id,
              tag_id: tag.id
            }))
          );

        if (tagsError) throw tagsError;
      }

      // Insert task dependencies if any
      if (input.dependencies && input.dependencies.length > 0) {
        const { error: dependenciesError } = await supabase
          .from('task_dependencies')
          .insert(
            input.dependencies.map(depId => ({
              dependent_task_id: task.id,
              dependency_task_id: depId
            }))
          );

        if (dependenciesError) throw dependenciesError;
      }

      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update task mutation
  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete task mutation
  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Toggle task completion
  const toggleTaskCompletion = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from('tasks')
        .update({
          completed_at: completed ? new Date().toISOString() : null,
          status: completed ? 'completed' : 'pending'
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Error toggling task completion:', error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
}
