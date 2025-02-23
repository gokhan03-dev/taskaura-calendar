
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserCheck, UserX, Mail } from "lucide-react";
import { type Attendee } from "./types";

interface AttendeesSectionProps {
  attendees: Attendee[];
  setAttendees: (attendees: Attendee[]) => void;
  newAttendeeEmail: string;
  setNewAttendeeEmail: (email: string) => void;
}

export function AttendeesSection({
  attendees,
  setAttendees,
  newAttendeeEmail,
  setNewAttendeeEmail,
}: AttendeesSectionProps) {
  const handleAddAttendee = () => {
    if (newAttendeeEmail && !attendees.some(a => a.email === newAttendeeEmail)) {
      setAttendees([...attendees, { email: newAttendeeEmail, rsvp: "pending" }]);
      setNewAttendeeEmail("");
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAttendee();
    }
  };

  const handleRemoveAttendee = (email: string) => {
    setAttendees(attendees.filter(a => a.email !== email));
  };

  const getRsvpIcon = (rsvp: "pending" | "accepted" | "declined" | "tentative") => {
    switch (rsvp) {
      case "accepted":
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case "declined":
        return <UserX className="h-4 w-4 text-red-500" />;
      case "tentative":
        return <Mail className="h-4 w-4 text-yellow-500" />;
      default:
        return <Mail className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label className="text-right pt-2.5">Attendees</Label>
      <div className="col-span-3 space-y-2">
        <div className="flex gap-2">
          <Input
            value={newAttendeeEmail}
            onChange={(e) => setNewAttendeeEmail(e.target.value)}
            onKeyPress={handleInputKeyPress}
            placeholder="Enter email address"
            type="email"
            className="flex-1"
          />
          <Button type="button" onClick={handleAddAttendee}>Add</Button>
        </div>
        <div className="space-y-2">
          {attendees.map((attendee) => (
            <div key={attendee.email} className="flex items-center gap-2 p-2 rounded-md bg-neutral-50 border border-neutral-200">
              {getRsvpIcon(attendee.rsvp)}
              <span className="flex-1 text-sm">{attendee.email}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveAttendee(attendee.email)}
                className="h-8 w-8 p-0 hover:bg-neutral-200"
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
