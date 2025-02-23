
import { format } from "date-fns";
import { Users, Video, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MeetingCardProps {
  meeting: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    attendees: { email: string; rsvp: string }[];
    meetingType: "online" | "in-person";
    location: string;
  };
  onEdit: () => void;
}

export const MeetingCard = ({ meeting, onEdit }: MeetingCardProps) => {
  const totalAttendees = meeting.attendees.length;
  const confirmedAttendees = meeting.attendees.filter(a => a.rsvp === "accepted").length;

  return (
    <div 
      className="bg-blue-50/50 rounded-xl p-4 shadow-glass hover:shadow-lg transition-shadow cursor-pointer border border-blue-100"
      onClick={onEdit}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="font-medium text-blue-900">{meeting.title}</h4>
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-700">
            {format(new Date(`${meeting.date} ${meeting.time}`), 'MMM dd, HH:mm')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement delete
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-blue-700 mb-3">{meeting.description}</p>
      
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 text-xs text-blue-700">
          {meeting.meetingType === "online" ? (
            <Video className="h-3 w-3" />
          ) : (
            <MapPin className="h-3 w-3" />
          )}
          {meeting.location}
        </div>

        <div className="flex items-center gap-1 text-xs text-blue-700">
          <Users className="h-3 w-3" />
          {confirmedAttendees}/{totalAttendees}
        </div>
      </div>
    </div>
  );
};
