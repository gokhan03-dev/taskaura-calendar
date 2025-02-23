
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateTimeSection } from "./DateTimeSection";
import { LocationSection } from "./LocationSection";
import { AttendeesSection } from "./AttendeesSection";
import { type MeetingFormFieldsProps } from "./types";

export function MeetingFormFields({
  title,
  setTitle,
  description,
  setDescription,
  date,
  setDate,
  time,
  setTime,
  duration,
  setDuration,
  meetingType,
  setMeetingType,
  location,
  setLocation,
  attendees,
  setAttendees,
  recurrencePattern,
  setShowRecurrence,
  reminderSettings,
  setShowReminder,
  newAttendeeEmail,
  setNewAttendeeEmail,
}: MeetingFormFieldsProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="description" className="text-right pt-2.5">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="col-span-3 min-h-[100px]"
          placeholder="Meeting description..."
        />
      </div>

      <DateTimeSection
        date={date}
        setDate={setDate}
        time={time}
        setTime={setTime}
        duration={duration}
        setDuration={setDuration}
        recurrencePattern={recurrencePattern}
        setShowRecurrence={setShowRecurrence}
        reminderSettings={reminderSettings}
        setShowReminder={setShowReminder}
      />

      <LocationSection
        meetingType={meetingType}
        setMeetingType={setMeetingType}
        location={location}
        setLocation={setLocation}
      />

      <AttendeesSection
        attendees={attendees}
        setAttendees={setAttendees}
        newAttendeeEmail={newAttendeeEmail}
        setNewAttendeeEmail={setNewAttendeeEmail}
      />
    </div>
  );
}
