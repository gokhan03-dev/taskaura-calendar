
import { format } from "date-fns";
import { Users, Video, MapPin, X, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MeetingCardProps {
  meeting: {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    attendees: { email: string; rsvp_status: string }[];
    meeting_type: "online" | "in-person";
    location: string;
    recurrence_pattern?: { frequency: string; interval: number };
  };
  onEdit: () => void;
  onDelete: () => void;
}

export const MeetingCard = ({ meeting, onEdit, onDelete }: MeetingCardProps) => {
  const totalAttendees = meeting.attendees?.length || 0;
  const confirmedAttendees = meeting.attendees?.filter(a => a.rsvp_status === "accepted").length || 0;

  return (
    <div 
      className="bg-blue-50/50 rounded-xl p-4 shadow-glass hover:shadow-lg transition-shadow cursor-pointer border border-blue-100"
      onClick={onEdit}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="font-medium text-blue-900">{meeting.title}</h4>
        <div className="flex items-center gap-2">
          {meeting.recurrence_pattern && (
            <Repeat className="h-4 w-4 text-blue-400" />
          )}
          <span className="text-sm text-blue-700">
            {format(new Date(meeting.start_time), 'MMM dd, HH:mm')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-blue-700 mb-3">{meeting.description}</p>
      
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 text-xs text-blue-700">
          {meeting.meeting_type === "online" ? (
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
