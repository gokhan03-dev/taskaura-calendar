
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, RepeatIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type RecurrencePattern } from "../RecurrenceModal";
import { type ReminderSettings } from "../ReminderModal";

interface DateTimeSectionProps {
  date: string;
  setDate: (date: string) => void;
  time: string;
  setTime: (time: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  recurrencePattern?: RecurrencePattern;
  setShowRecurrence: (show: boolean) => void;
  reminderSettings?: ReminderSettings;
  setShowReminder: (show: boolean) => void;
}

export function DateTimeSection({
  date,
  setDate,
  time,
  setTime,
  duration,
  setDuration,
  recurrencePattern,
  setShowRecurrence,
  reminderSettings,
  setShowReminder,
}: DateTimeSectionProps) {
  return (
    <>
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
          Time & Duration
        </Label>
        <div className="col-span-3 grid grid-cols-2 gap-2">
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
