
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/AuthProvider';
import { CreateTaskInput, UpdateTaskInput } from '@/lib/types/task';
import { useToast } from '@/hooks/use-toast';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/lib/api/tasks';
import { useTaskSubscription } from './useTaskSubscription';

export const useTasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { subscribeToTasks } = useTaskSubscription(user?.id);

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: () => {
      if (!user) throw new Error('User must be authenticated to fetch tasks');
      return fetchTasks(user.id);
    },
    enabled: !!user,
  });

  const createTaskMutation = useMutation({
    mutationFn: (newTask: CreateTaskInput & { tags?: string[] }) => {
      if (!user) throw new Error('User must be authenticated to create tasks');
      return createTask(user.id, newTask);
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

  const updateTaskMutation = useMutation({
    mutationFn: (taskData: UpdateTaskInput & { id: string }) => {
      if (!user) throw new Error('User must be authenticated to update tasks');
      return updateTask(user.id, taskData);
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

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => {
      if (!user) throw new Error('User must be authenticated to delete tasks');
      return deleteTask(user.id, taskId);
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

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation,
    updateTask: updateTaskMutation,
    deleteTask: deleteTaskMutation,
    subscribeToTasks,
  };
};
