import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { RecurrenceModal, type RecurrencePattern } from "./RecurrenceModal";
import { RepeatIcon } from "lucide-react";

export function MeetingDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [attendees, setAttendees] = useState("");
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      title,
      date,
      time,
      attendees,
      recurrencePattern,
    });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Schedule Meeting</DialogTitle>
              <DialogDescription>
                Set up a new meeting with your team.
              </DialogDescription>
            </DialogHeader>
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
            <DialogFooter>
              <Button type="submit">Schedule Meeting</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <RecurrenceModal
        open={showRecurrence}
        onOpenChange={setShowRecurrence}
        onSave={setRecurrencePattern}
        initialPattern={recurrencePattern}
      />
    </>
  );
}
