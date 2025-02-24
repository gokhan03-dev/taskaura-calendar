
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTaskSubscription = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const subscribeToTasks = () => {
    if (!userId) return () => {};

    const channel = supabase
      .channel('tasks-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Task change received:', payload);
          queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return { subscribeToTasks };
};
