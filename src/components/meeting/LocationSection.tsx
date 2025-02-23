
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link2, Video, PersonStanding } from "lucide-react";

interface LocationSectionProps {
  meetingType: "online" | "in-person";
  setMeetingType: (type: "online" | "in-person") => void;
  location: string;
  setLocation: (location: string) => void;
}

export function LocationSection({
  meetingType,
  setMeetingType,
  location,
  setLocation,
}: LocationSectionProps) {
  const handleGenerateZoomLink = () => {
    alert("Zoom integration needs to be set up first. This would open the integration setup page.");
  };

  return (
    <>
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
    </>
  );
}
