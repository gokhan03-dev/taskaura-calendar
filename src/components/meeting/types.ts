
import { type RecurrencePattern } from "../RecurrenceModal";
import { type ReminderSettings } from "../ReminderModal";

export interface Attendee {
  email: string;
  rsvp: "pending" | "accepted" | "declined" | "tentative";
}

export interface MeetingFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  date: string;
  setDate: (date: string) => void;
  time: string;
  setTime: (time: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  meetingType: "online" | "in-person";
  setMeetingType: (type: "online" | "in-person") => void;
  location: string;
  setLocation: (location: string) => void;
  attendees: Attendee[];
  setAttendees: (attendees: Attendee[]) => void;
  recurrencePattern?: RecurrencePattern;
  setShowRecurrence: (show: boolean) => void;
  reminderSettings?: ReminderSettings;
  setShowReminder: (show: boolean) => void;
  newAttendeeEmail: string;
  setNewAttendeeEmail: (email: string) => void;
}
