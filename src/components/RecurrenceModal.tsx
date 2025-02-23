
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, RepeatIcon } from "lucide-react";

export type RecurrencePattern = {
  type: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  weekdays?: number[];
  monthDay?: number;
  endDate?: string;
  occurrences?: number;
};

interface RecurrenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (pattern: RecurrencePattern) => void;
  initialPattern?: RecurrencePattern;
}

const weekdays = [
  { value: 0, label: "S" },
  { value: 1, label: "M" },
  { value: 2, label: "T" },
  { value: 3, label: "W" },
  { value: 4, label: "T" },
  { value: 5, label: "F" },
  { value: 6, label: "S" },
];

export function RecurrenceModal({
  open,
  onOpenChange,
  onSave,
  initialPattern,
}: RecurrenceModalProps) {
  const [pattern, setPattern] = useState<RecurrencePattern>(
    initialPattern || {
      type: "daily",
      interval: 1,
      weekdays: [],
    }
  );
  const [endType, setEndType] = useState<"never" | "date" | "occurrences">("never");

  const handleSave = () => {
    onSave(pattern);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-card p-4">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-base">
            <RepeatIcon className="h-4 w-4" />
            Recurrence
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recurrence Type and Interval */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Every</span>
            <Input
              type="number"
              min="1"
              value={pattern.interval}
              onChange={(e) =>
                setPattern({ ...pattern, interval: parseInt(e.target.value) || 1 })
              }
              className="w-16 h-8 text-sm"
            />
            <Select
              value={pattern.type}
              onValueChange={(value: RecurrencePattern["type"]) =>
                setPattern({ ...pattern, type: value })
              }
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="daily">Days</SelectItem>
                  <SelectItem value="weekly">Weeks</SelectItem>
                  <SelectItem value="monthly">Months</SelectItem>
                  <SelectItem value="yearly">Years</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Weekly Options */}
          {pattern.type === "weekly" && (
            <div className="flex flex-wrap gap-1">
              {weekdays.map((day) => (
                <Button
                  key={day.value}
                  type="button"
                  variant={pattern.weekdays?.includes(day.value) ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 rounded-lg text-xs p-0"
                  onClick={() =>
                    setPattern({
                      ...pattern,
                      weekdays: pattern.weekdays?.includes(day.value)
                        ? pattern.weekdays.filter((d) => d !== day.value)
                        : [...(pattern.weekdays || []), day.value],
                    })
                  }
                >
                  {day.label}
                </Button>
              ))}
            </div>
          )}

          {/* Monthly Options */}
          {pattern.type === "monthly" && (
            <div className="flex items-center gap-2">
              <span className="text-sm">Day</span>
              <Input
                type="number"
                min="1"
                max="31"
                value={pattern.monthDay || 1}
                onChange={(e) =>
                  setPattern({ ...pattern, monthDay: parseInt(e.target.value) || 1 })
                }
                className="w-16 h-8 text-sm"
              />
            </div>
          )}

          {/* End Options */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm w-12">Ends</span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={endType === "never" ? "default" : "outline"}
                  className="rounded-lg text-sm h-8"
                  onClick={() => {
                    setEndType("never");
                    setPattern({ ...pattern, endDate: undefined, occurrences: undefined });
                  }}
                >
                  Never
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={endType === "date" ? "default" : "outline"}
                  className="rounded-lg text-sm h-8"
                  onClick={() => setEndType("date")}
                >
                  On date
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={endType === "occurrences" ? "default" : "outline"}
                  className="rounded-lg text-sm h-8"
                  onClick={() => setEndType("occurrences")}
                >
                  After
                </Button>
              </div>
            </div>

            {endType === "date" && (
              <div className="flex items-center gap-2 pl-14">
                <Input
                  type="date"
                  value={pattern.endDate || ""}
                  onChange={(e) =>
                    setPattern({ ...pattern, endDate: e.target.value })
                  }
                  className="w-[160px] h-8 text-sm"
                />
              </div>
            )}

            {endType === "occurrences" && (
              <div className="flex items-center gap-2 pl-14">
                <Input
                  type="number"
                  min="1"
                  value={pattern.occurrences || ""}
                  onChange={(e) =>
                    setPattern({
                      ...pattern,
                      occurrences: parseInt(e.target.value) || undefined,
                    })
                  }
                  className="w-16 h-8 text-sm"
                />
                <span className="text-sm">occurrences</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            size="sm"
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            className="rounded-lg"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
