
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, RepeatIcon } from "lucide-react";
import { type RecurrencePattern } from "../RecurrenceModal";
import { type ReminderSettings } from "../ReminderModal";

interface MeetingFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  date: string;
  setDate: (date: string) => void;
  time: string;
  setTime: (time: string) => void;
  attendees: string;
  setAttendees: (attendees: string) => void;
  recurrencePattern?: RecurrencePattern;
  setShowRecurrence: (show: boolean) => void;
  reminderSettings?: ReminderSettings;
  setShowReminder: (show: boolean) => void;
}

export function MeetingFormFields({
  title,
  setTitle,
  date,
  setDate,
  time,
  setTime,
  attendees,
  setAttendees,
  recurrencePattern,
  setShowRecurrence,
  reminderSettings,
  setShowReminder,
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
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">
          Date
        </Label>
        <div className="col-span-3 flex gap-2">
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1"
            required
          />
          <Button
            type="button"
            variant={recurrencePattern ? "default" : "outline"}
            size="icon"
            onClick={() => setShowRecurrence(true)}
            className="relative"
          >
            <RepeatIcon className="h-4 w-4" />
            {recurrencePattern && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
            )}
          </Button>
          <Button
            type="button"
            variant={reminderSettings ? "default" : "outline"}
            size="icon"
            onClick={() => setShowReminder(true)}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {reminderSettings && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
            )}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="time" className="text-right">
          Time
        </Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="attendees" className="text-right">
          Attendees
        </Label>
        <Input
          id="attendees"
          placeholder="Enter email addresses"
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
          className="col-span-3"
        />
      </div>
    </div>
  );
}
