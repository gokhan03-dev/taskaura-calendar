
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MeetingFormFields } from "./meeting/MeetingFormFields";
import { useMeetings } from "@/hooks/useMeetings";
import { RecurrenceModal } from "./RecurrenceModal";
import { ReminderModal } from "./ReminderModal";
import { format } from "date-fns";

export function ScheduleDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { createMeeting } = useMeetings();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const startTime = `${date}T${time}`;
    const endTime = new Date(new Date(startTime).getTime() + parseInt(duration) * 60000).toISOString();

    try {
      await createMeeting.mutateAsync({
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
      });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create meeting:', error);
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
            <DialogTitle>Schedule Meeting</DialogTitle>
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
              <Button type="submit">Schedule Meeting</Button>
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
