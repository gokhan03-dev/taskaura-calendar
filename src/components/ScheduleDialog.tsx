
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { RecurrenceModal, type RecurrencePattern } from "./RecurrenceModal";
import { ReminderModal, type ReminderSettings } from "./ReminderModal";
import { MeetingFormFields } from "./meeting/MeetingFormFields";
import { Loader2, CloudUpload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthProvider";

export function ScheduleDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [meetingType, setMeetingType] = useState<"online" | "in-person">("online");
  const [location, setLocation] = useState("");
  const [newAttendeeEmail, setNewAttendeeEmail] = useState("");
  const [attendees, setAttendees] = useState<{ email: string; rsvp: "pending" | "accepted" | "declined" | "tentative" }[]>([]);
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>();
  const [showReminder, setShowReminder] = useState(false);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>();
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSyncWithOutlook = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in with your Microsoft account to sync with Outlook.",
      });
      return;
    }

    setIsSyncing(true);
    try {
      // TODO: Implement actual sync logic here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated delay
      
      toast({
        title: "Successfully synced with Outlook",
        description: "Your meeting has been added to your Outlook calendar.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "Could not sync with Outlook calendar. Please try again.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const meetingData = {
      title,
      description,
      date,
      time,
      duration,
      meetingType,
      location,
      attendees,
      recurrencePattern,
      reminderSettings,
    };
    
    console.log(meetingData);
    
    try {
      await handleSyncWithOutlook();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to sync meeting:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Schedule Meeting</DialogTitle>
              </div>
              <DialogDescription>
                Set up a new meeting with your team.
              </DialogDescription>
            </DialogHeader>
            
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

            <DialogFooter className="flex sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSyncWithOutlook}
                className="relative group hover:border-blue-400 transition-colors w-10 h-10"
                disabled={isSyncing}
                title="Sync with Outlook"
              >
                {isSyncing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CloudUpload className="h-5 w-5 group-hover:text-blue-500 transition-colors" />
                )}
                {!user && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>
              <Button 
                type="submit"
                disabled={isSyncing}
                className="relative overflow-hidden transition-all duration-200"
              >
                {isSyncing ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </span>
                ) : (
                  "Schedule Meeting"
                )}
              </Button>
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

      <ReminderModal
        open={showReminder}
        onOpenChange={setShowReminder}
        onSave={setReminderSettings}
        initialSettings={reminderSettings}
      />
    </>
  );
}
