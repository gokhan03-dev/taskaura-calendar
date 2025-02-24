
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface TaskDateSelectProps {
  date: string;
  setDate: (date: string) => void;
  setShowReminder: (show: boolean) => void;
  setShowRecurrence: (show: boolean) => void;
}

export function TaskDateSelect({ 
  date, 
  setDate,
  setShowReminder,
  setShowRecurrence
}: TaskDateSelectProps) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="date" className="text-right">
        Due Date
      </Label>
      <div className="col-span-3 flex items-center gap-2">
        <Input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={() => setShowReminder(true)}
        >
          <Clock className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={() => setShowRecurrence(true)}
        >
          <Calendar className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
