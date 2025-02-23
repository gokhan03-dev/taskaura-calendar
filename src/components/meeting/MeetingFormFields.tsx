import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bell, RepeatIcon, Video, PersonStanding, Link2, UserCheck, UserX, Mail, Help } from "lucide-react";
import { type RecurrencePattern } from "../RecurrenceModal";
import { type ReminderSettings } from "../ReminderModal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MeetingFormFieldsProps {
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
  attendees: { email: string; rsvp: "pending" | "accepted" | "declined" | "tentative" }[];
  setAttendees: (attendees: { email: string; rsvp: "pending" | "accepted" | "declined" | "tentative" }[]) => void;
  recurrencePattern?: RecurrencePattern;
  setShowRecurrence: (show: boolean) => void;
  reminderSettings?: ReminderSettings;
  setShowReminder: (show: boolean) => void;
  newAttendeeEmail: string;
  setNewAttendeeEmail: (email: string) => void;
}

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

  const handleGenerateZoomLink = () => {
    // Here you would integrate with Zoom API
    alert("Zoom integration needs to be set up first. This would open the integration setup page.");
  };

  const getRsvpIcon = (rsvp: "pending" | "accepted" | "declined" | "tentative") => {
    switch (rsvp) {
      case "accepted":
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case "declined":
        return <UserX className="h-4 w-4 text-red-500" />;
      case "tentative":
        return <Help className="h-4 w-4 text-yellow-500" />;
      default:
        return <Mail className="h-4 w-4 text-gray-500" />;
    }
  };

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
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Meeting Type</Label>
        <div className="col-span-3 flex gap-2">
          <Button
            type="button"
            variant={meetingType === "online" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setMeetingType("online")}
          >
            <Video className="mr-2 h-4 w-4" />
            Online
          </Button>
          <Button
            type="button"
            variant={meetingType === "in-person" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setMeetingType("in-person")}
          >
            <PersonStanding className="mr-2 h-4 w-4" />
            In-Person
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="location" className="text-right">
          {meetingType === "online" ? "Meeting Link" : "Location"}
        </Label>
        <div className="col-span-3 flex gap-2">
          {meetingType === "online" && location ? (
            <a 
              href={location.startsWith('http') ? location : `https://${location}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-blue-500 hover:text-blue-700 underline break-all"
            >
              {location}
            </a>
          ) : (
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={meetingType === "online" ? "Zoom/Meet link" : "Meeting room or address"}
              className="flex-1"
            />
          )}
          {meetingType === "online" && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleGenerateZoomLink}
              title="Set up Zoom integration"
            >
              <Link2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
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
    </div>
  );
}
