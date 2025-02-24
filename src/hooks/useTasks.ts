
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/lib/types/task';
import { useToast } from '@/hooks/use-toast';

// Define the database types
interface DBTask {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  categories: {
    id: string;
    name: string;
    color: string;
  } | null;
  subtasks: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  task_tags: Array<{
    tags: {
      id: string;
      name: string;
    };
  }>;
}

export const useTasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User must be authenticated to fetch tasks');

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          categories (*),
          subtasks (*),
          task_tags (
            tags (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      // Transform the data to match the Task type
      const transformedData = (data as DBTask[])?.map(task => ({
        ...task,
        tags: task.task_tags?.map(tt => ({
          id: tt.tags.id,
          label: tt.tags.name
        })) || []
      }));

      console.log('Transformed tasks data:', transformedData);
      return transformedData as Task[];
    },
    enabled: !!user,
  });

  const createTask = useMutation({
    mutationFn: async (newTask: CreateTaskInput) => {
      if (!user) throw new Error('User must be authenticated to create tasks');
      
      console.log('Creating task with data:', newTask);

      // Create tags first if needed
      const tagIds = [];
      if (newTask.tags && newTask.tags.length > 0) {
        for (const tag of newTask.tags) {
          if (!tag.id) {
            // Create new tag
            const { data: newTag, error: tagError } = await supabase
              .from('tags')
              .insert({
                name: tag.label,
                user_id: user.id
              })
              .select()
              .single();

            if (tagError) throw tagError;
            tagIds.push(newTag.id);
          } else {
            tagIds.push(tag.id);
          }
        }
      }

      // Create task
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: newTask.title,
          description: newTask.description,
          category_id: newTask.category_id,
          due_date: newTask.due_date,
          priority: newTask.priority || 'medium',
          status: 'pending',
          user_id: user.id
        })
        .select()
        .single();

      if (taskError) throw taskError;

      // Create task-tag relationships
      if (tagIds.length > 0) {
        const taskTagsToInsert = tagIds.map(tagId => ({
          task_id: task.id,
          tag_id: tagId
        }));

        const { error: tagRelationError } = await supabase
          .from('task_tags')
          .insert(taskTagsToInsert);

        if (tagRelationError) throw tagRelationError;
      }

      // Fetch final task with all relations
      const { data: finalTask, error: fetchError } = await supabase
        .from('tasks')
        .select(`
          *,
          categories (*),
          subtasks (*),
          task_tags (
            tags (*)
          )
        `)
        .eq('id', task.id)
        .single();

      if (fetchError) throw fetchError;

      // Transform to match Task type
      const transformedTask = {
        ...finalTask,
        tags: finalTask.task_tags?.map(tt => ({
          id: tt.tags.id,
          label: tt.tags.name
        })) || []
      };

      return transformedTask as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    onError: (error) => {
      console.error('Create task error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create task: " + error.message,
      });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTaskInput & { id: string }) => {
      if (!user) throw new Error('User must be authenticated to update tasks');

      // Verify ownership
      const { data: existingTask } = await supabase
        .from('tasks')
        .select('user_id')
        .eq('id', id)
        .single();

      if (existingTask?.user_id !== user.id) {
        throw new Error('Unauthorized to update this task');
      }

      // Handle tags if present
      if (updates.tags) {
        // Delete existing task-tag relationships
        await supabase
          .from('task_tags')
          .delete()
          .eq('task_id', id);

        // Create new tags if needed and get all tag IDs
        const tagIds = [];
        for (const tag of updates.tags) {
          if (!tag.id) {
            const { data: newTag, error: tagError } = await supabase
              .from('tags')
              .insert({
                name: tag.label,
                user_id: user.id
              })
              .select()
              .single();

            if (tagError) throw tagError;
            tagIds.push(newTag.id);
          } else {
            tagIds.push(tag.id);
          }
        }

        // Create new task-tag relationships
        if (tagIds.length > 0) {
          const { error: tagRelationError } = await supabase
            .from('task_tags')
            .insert(tagIds.map(tagId => ({
              task_id: id,
              tag_id: tagId
            })));

          if (tagRelationError) throw tagRelationError;
        }
      }

      // Update task
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          description: updates.description,
          category_id: updates.category_id,
          due_date: updates.due_date,
          priority: updates.priority,
          status: updates.status,
          updated_at: new Date().toISOString(),
          completed_at: updates.status === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', id)
        .select(`
          *,
          categories (*),
          subtasks (*),
          task_tags (
            tags (*)
          )
        `)
        .single();

      if (error) throw error;

      return {
        ...data,
        tags: data.task_tags?.map(tt => ({
          id: tt.tags.id,
          label: tt.tags.name
        })) || []
      } as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    },
    onError: (error) => {
      console.error('Update task error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task: " + error.message,
      });
    },
  });

  // Delete task mutation
  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User must be authenticated to delete tasks');

      const { data: existingTask } = await supabase
        .from('tasks')
        .select('user_id')
        .eq('id', id)
        .single();

      if (existingTask?.user_id !== user.id) {
        throw new Error('Unauthorized to delete this task');
      }

      // First delete related records
      const deleteRelatedPromises = [
        supabase.from('subtasks').delete().eq('task_id', id),
        supabase.from('task_tags').delete().eq('task_id', id),
        supabase.from('task_dependencies').delete().eq('dependent_task_id', id),
        supabase.from('task_dependencies').delete().eq('dependency_task_id', id),
      ];

      await Promise.all(deleteRelatedPromises);

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting task:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Delete task error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task: " + error.message,
      });
    },
  });

  // Set up real-time subscription
  const subscribeToTasks = () => {
    if (!user) return () => {};

    const channel = supabase
      .channel('tasks-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Task change received:', payload);
          queryClient.invalidateQueries({ queryKey: ['tasks', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    subscribeToTasks,
  };
};
