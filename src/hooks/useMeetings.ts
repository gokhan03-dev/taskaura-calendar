
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Meeting, CreateMeetingInput, UpdateMeetingInput } from '@/lib/types/meeting';
import { useToast } from '@/hooks/use-toast';

export const useMeetings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all meetings
  const {
    data: meetings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meetings')
        .select(`
          *,
          meeting_attendees(*),
          recurrence_patterns!recurrence_pattern_meeting(*)
        `)
        .eq('user_id', user?.id)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching meetings:', error);
        throw error;
      }
      return data as Meeting[];
    },
    enabled: !!user,
  });

  // Create meeting mutation
  const createMeeting = useMutation({
    mutationFn: async (newMeeting: CreateMeetingInput) => {
      if (!user) throw new Error('User must be authenticated to create meetings');

      const { attendees, recurrence_pattern, ...meetingData } = newMeeting;
      
      // Start a Postgres transaction
      const { data: meeting, error: meetingError } = await supabase
        .from('meetings')
        .insert([{ ...meetingData, user_id: user.id }])
        .select()
        .single();

      if (meetingError) throw meetingError;

      // Insert attendees if provided
      if (attendees && attendees.length > 0) {
        const { error: attendeesError } = await supabase
          .from('meeting_attendees')
          .insert(
            attendees.map(attendee => ({
              meeting_id: meeting.id,
              ...attendee
            }))
          );

        if (attendeesError) throw attendeesError;
      }

      // Insert recurrence pattern if provided
      if (recurrence_pattern) {
        const { error: recurrenceError } = await supabase
          .from('recurrence_patterns')
          .insert([{
            ...recurrence_pattern,
            parent_id: meeting.id,
            parent_type: 'meeting'
          }]);

        if (recurrenceError) throw recurrenceError;
      }

      return meeting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast({
        title: "Success",
        description: "Meeting created successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create meeting: " + error.message,
      });
    },
  });

  // Update meeting mutation
  const updateMeeting = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateMeetingInput & { id: string }) => {
      const { data, error } = await supabase
        .from('meetings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast({
        title: "Success",
        description: "Meeting updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update meeting: " + error.message,
      });
    },
  });

  // Delete meeting mutation
  const deleteMeeting = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast({
        title: "Success",
        description: "Meeting deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete meeting: " + error.message,
      });
    },
  });

  // Update attendee RSVP status
  const updateAttendeeStatus = useMutation({
    mutationFn: async ({
      meetingId,
      attendeeId,
      status,
    }: {
      meetingId: string;
      attendeeId: string;
      status: 'accepted' | 'declined' | 'tentative';
    }) => {
      const { data, error } = await supabase
        .from('meeting_attendees')
        .update({ rsvp_status: status })
        .eq('id', attendeeId)
        .eq('meeting_id', meetingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast({
        title: "Success",
        description: "Attendee status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update attendee status: " + error.message,
      });
    },
  });

  // Set up real-time subscription
  const subscribeToMeetings = () => {
    const channel = supabase
      .channel('meetings-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meetings',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['meetings'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meeting_attendees',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['meetings'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    meetings,
    isLoading,
    error,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    updateAttendeeStatus,
    subscribeToMeetings,
  };
};
