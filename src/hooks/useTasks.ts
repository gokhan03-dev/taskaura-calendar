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

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          categories (*),
          subtasks (
            id,
            title,
            completed
          ),
          task_tags (
            tags (
              id,
              name
            )
          ),
          dependencies:task_dependencies!task_dependencies_dependent_task_id_fkey (
            dependency:tasks!task_dependencies_dependency_task_id_fkey (
              id,
              title,
              status
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      // Transform the data to match the Task type - keeping the same transformation logic
      const transformedData = data?.map(task => ({
        ...task,
        tags: task.task_tags?.map(tt => tt.tags) || [],
        dependencies: task.dependencies?.map(d => d.dependency) || []
      }));

      return transformedData as Task[];
    },
    enabled: !!user,
  });

  // Create task mutation
  const createTask = useMutation({
    mutationFn: async (newTask: CreateTaskInput & { 
      subtasks?: { title: string }[]; 
      tags?: string[];
      dependencies?: string[];
    }) => {
      if (!user) throw new Error('User must be authenticated to create tasks');
      
      const { subtasks, tags, dependencies, ...taskData } = newTask;
      
      // Insert task
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          user_id: user.id,
          status: 'in_progress',
          priority: taskData.priority || 'medium',
        }])
        .select()
        .single();

      if (taskError) throw taskError;

      // Insert subtasks if provided
      if (subtasks && subtasks.length > 0) {
        const { error: subtasksError } = await supabase
          .from('subtasks')
          .insert(subtasks.map(st => ({
            task_id: task.id,
            title: st.title,
            completed: false
          })));

        if (subtasksError) throw subtasksError;
      }

      // Handle tags
      if (tags && tags.length > 0) {
        // First ensure tags exist
        const { data: existingTags } = await supabase
          .from('tags')
          .select('id, name')
          .in('name', tags);

        const existingTagNames = new Set(existingTags?.map(t => t.name) || []);
        const newTags = tags.filter(tag => !existingTagNames.has(tag));

        // Insert new tags
        if (newTags.length > 0) {
          const { data: newTagsData, error: newTagsError } = await supabase
            .from('tags')
            .insert(newTags.map(name => ({
              name,
              user_id: user.id
            })))
            .select();

          if (newTagsError) throw newTagsError;
        }

        // Get all tag IDs
        const { data: allTags, error: tagsError } = await supabase
          .from('tags')
          .select('id, name')
          .in('name', tags);

        if (tagsError) throw tagsError;

        // Create task-tag associations
        if (allTags) {
          const { error: taskTagsError } = await supabase
            .from('task_tags')
            .insert(allTags.map(tag => ({
              task_id: task.id,
              tag_id: tag.id
            })));

          if (taskTagsError) throw taskTagsError;
        }
      }

      // Handle dependencies
      if (dependencies && dependencies.length > 0) {
        const { error: depsError } = await supabase
          .from('task_dependencies')
          .insert(dependencies.map(depId => ({
            dependent_task_id: task.id,
            dependency_task_id: depId
          })));

        if (depsError) throw depsError;
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
    onError: (error: Error) => {
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
    mutationFn: async ({ id, ...updates }: UpdateTaskInput) => {
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
        .select()
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
