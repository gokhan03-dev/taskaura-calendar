
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MeetingFormFields } from "./meeting/MeetingFormFields";
import { useMeetings } from "@/hooks/useMeetings";
import { RecurrenceModal } from "./RecurrenceModal";
import { ReminderModal } from "./ReminderModal";
import { Meeting } from "@/lib/types/meeting";

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingToEdit?: Meeting;
}

export function ScheduleDialog({
  open,
  onOpenChange,
  meetingToEdit
}: ScheduleDialogProps) {
  const { createMeeting, updateMeeting } = useMeetings();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const [duration, setDuration] = useState("60");
  const [meetingType, setMeetingType] = useState<"online" | "in-person">("online");
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState<{ email: string; rsvp: "pending" | "accepted" | "declined" | "tentative" }[]>([]);
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<any>(null);
  const [reminderSettings, setReminderSettings] = useState<any>(null);
  const [newAttendeeEmail, setNewAttendeeEmail] = useState("");

  useEffect(() => {
    if (open && meetingToEdit) {
      setTitle(meetingToEdit.title);
      setDescription(meetingToEdit.description || "");
      setDate(format(new Date(meetingToEdit.start_time), "yyyy-MM-dd"));
      setTime(format(new Date(meetingToEdit.start_time), "HH:mm"));
      
      // Calculate duration in minutes
      const start = new Date(meetingToEdit.start_time);
      const end = new Date(meetingToEdit.end_time);
      const durationInMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
      setDuration(durationInMinutes.toString());
      
      setMeetingType(meetingToEdit.meeting_type);
      setLocation(meetingToEdit.location || "");
      setAttendees(meetingToEdit.attendees?.map(a => ({
        email: a.email,
        rsvp: a.rsvp_status
      })) || []);
      setRecurrencePattern(meetingToEdit.recurrence_pattern || null);
    }
  }, [open, meetingToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const startTime = `${date}T${time}`;
    const endTime = new Date(new Date(startTime).getTime() + parseInt(duration) * 60000).toISOString();

    try {
      const meetingData = {
        title,
        description,
        start_time: startTime,
        end_time: endTime,
        meeting_type: meetingType,
        location,
        attendees: attendees.map(a => ({ email: a.email })),
        ...(recurrencePattern && {
          recurrence_pattern: {
            frequency: recurrencePattern.type,
            interval: recurrencePattern.interval,
            days_of_week: recurrencePattern.weekdays,
            until_date: recurrencePattern.endDate,
            count: recurrencePattern.occurrences,
          },
        }),
      };

      if (meetingToEdit) {
        await updateMeeting.mutateAsync({
          id: meetingToEdit.id,
          ...meetingData
        });
      } else {
        await createMeeting.mutateAsync(meetingData);
      }
      
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save meeting:', error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setTime(format(new Date(), "HH:mm"));
    setDuration("60");
    setMeetingType("online");
    setLocation("");
    setAttendees([]);
    setRecurrencePattern(null);
    setReminderSettings(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{meetingToEdit ? 'Edit Meeting' : 'Schedule Meeting'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <MeetingFormFields
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              date={date}
              setDate={setDate}
              time={time}
              setTime={setTime}
              duration={duration}
              setDuration={setDuration}
              meetingType={meetingType}
              setMeetingType={setMeetingType}
              location={location}
              setLocation={setLocation}
              attendees={attendees}
              setAttendees={setAttendees}
              recurrencePattern={recurrencePattern}
              setShowRecurrence={setShowRecurrence}
              reminderSettings={reminderSettings}
              setShowReminder={setShowReminder}
              newAttendeeEmail={newAttendeeEmail}
              setNewAttendeeEmail={setNewAttendeeEmail}
            />
            <div className="mt-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {meetingToEdit ? 'Save Changes' : 'Schedule Meeting'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <RecurrenceModal
        open={showRecurrence}
        onOpenChange={setShowRecurrence}
        onSave={setRecurrencePattern}
        initialPattern={recurrencePattern}
      />

      <ReminderModal
        open={showReminder}
        onOpenChange={setShowReminder}
        onSave={setReminderSettings}
        initialSettings={reminderSettings}
      />
    </>
  );
}
