
export interface Meeting {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  meeting_type: 'online' | 'in-person';
  location: string | null;
  status: 'scheduled' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  attendees?: MeetingAttendee[];
  recurrence_pattern?: RecurrencePattern;
}

export interface MeetingAttendee {
  id: string;
  meeting_id: string;
  email: string;
  name: string | null;
  rsvp_status: 'pending' | 'accepted' | 'declined' | 'tentative';
  created_at: string;
  updated_at: string;
}

export interface RecurrencePattern {
  id: string;
  parent_type: string;
  parent_id: string;
  frequency: string;
  interval: number;
  days_of_week: string[] | null;
  until_date: string | null;
  count: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateMeetingInput {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  meeting_type: 'online' | 'in-person';
  location?: string;
  attendees?: { email: string; name?: string }[];
  recurrence_pattern?: {
    frequency: string;
    interval: number;
    days_of_week?: string[];
    until_date?: string;
    count?: number;
  };
}

export interface UpdateMeetingInput extends Partial<Omit<CreateMeetingInput, 'attendees'>> {
  status?: 'scheduled' | 'cancelled' | 'completed';
}
