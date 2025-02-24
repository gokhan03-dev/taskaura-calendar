
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/lib/types/task';
import { useToast } from '@/hooks/use-toast';

export const useTasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all tasks with related data
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User must be authenticated to fetch tasks');

      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          categories (*),
          subtasks (
            id,
            title,
            completed
          ),
          task_tags!inner (
            tags (
              id,
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
        throw tasksError;
      }

      // Transform the data to match the Task type
      const transformedData = tasksData?.map(task => ({
        ...task,
        tags: task.task_tags.map(tt => tt.tags)
      }));

      console.log('Transformed tasks with tags:', transformedData);
      return transformedData as Task[];
    },
    enabled: !!user,
  });

  // Create task mutation with proper tag handling
  const createTask = useMutation({
    mutationFn: async (newTask: CreateTaskInput & { tags?: string[] }) => {
      if (!user) throw new Error('User must be authenticated to create tasks');
      
      const { tags, ...taskData } = newTask;
      
      // 1. Create the task first
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          user_id: user.id,
          status: 'pending',
        }])
        .select()
        .single();

      if (taskError) throw taskError;

      // 2. Handle tags if provided
      if (tags && tags.length > 0) {
        // First ensure all tags exist
        const existingTagsPromises = tags.map(tagName => 
          supabase
            .from('tags')
            .select('id, name')
            .eq('name', tagName)
            .eq('user_id', user.id)
            .single()
            .then(({ data }) => data)
        );

        const existingTagsResults = await Promise.all(existingTagsPromises);
        const existingTags = existingTagsResults.filter(Boolean);
        const existingTagNames = new Set(existingTags.map(t => t.name));

        // Create new tags that don't exist
        const newTagNames = tags.filter(tag => !existingTagNames.has(tag));
        
        let allTagIds = existingTags.map(t => t.id);

        if (newTagNames.length > 0) {
          const { data: newTags, error: newTagsError } = await supabase
            .from('tags')
            .insert(newTagNames.map(name => ({
              name,
              user_id: user.id
            })))
            .select('id');

          if (newTagsError) throw newTagsError;
          
          allTagIds = [...allTagIds, ...(newTags?.map(t => t.id) || [])];
        }

        // Create task-tag associations
        const { error: taskTagsError } = await supabase
          .from('task_tags')
          .insert(allTagIds.map(tagId => ({
            task_id: task.id,
            tag_id: tagId
          })));

        if (taskTagsError) throw taskTagsError;
      }

      return task;
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

  // Update task mutation
  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTaskInput & { id: string }) => {
      if (!user) throw new Error('User must be authenticated to update tasks');

      const { data: existingTask } = await supabase
        .from('tasks')
        .select('user_id')
        .eq('id', id)
        .single();

      if (existingTask?.user_id !== user.id) {
        throw new Error('Unauthorized to update this task');
      }

      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
          completed_at: updates.status === 'completed' 
            ? new Date().toISOString() 
            : updates.completed_at,
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

      if (error) {
        console.error('Error updating task:', error);
        throw error;
      }
      return data;
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
