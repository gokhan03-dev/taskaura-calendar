
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, RepeatIcon, X } from "lucide-react";

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
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
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
      <DialogContent className="sm:max-w-[425px] glass-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RepeatIcon className="h-5 w-5" />
            Recurrence Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Recurrence Type */}
          <div className="space-y-2">
            <Label>Repeat</Label>
            <Select
              value={pattern.type}
              onValueChange={(value: RecurrencePattern["type"]) =>
                setPattern({ ...pattern, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Interval */}
          <div className="flex items-center gap-3">
            <Label>Every</Label>
            <Input
              type="number"
              min="1"
              value={pattern.interval}
              onChange={(e) =>
                setPattern({ ...pattern, interval: parseInt(e.target.value) || 1 })
              }
              className="w-20"
            />
            <span>
              {pattern.type === "daily" && "days"}
              {pattern.type === "weekly" && "weeks"}
              {pattern.type === "monthly" && "months"}
              {pattern.type === "yearly" && "years"}
            </span>
          </div>

          {/* Weekly Options */}
          {pattern.type === "weekly" && (
            <div className="space-y-2">
              <Label>Repeat on</Label>
              <div className="flex flex-wrap gap-2">
                {weekdays.map((day) => (
                  <Button
                    key={day.value}
                    type="button"
                    variant={
                      pattern.weekdays?.includes(day.value) ? "default" : "outline"
                    }
                    className="w-12 h-12 rounded-full p-0"
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
            </div>
          )}

          {/* Monthly Options */}
          {pattern.type === "monthly" && (
            <div className="space-y-2">
              <Label>Day of month</Label>
              <Input
                type="number"
                min="1"
                max="31"
                value={pattern.monthDay || 1}
                onChange={(e) =>
                  setPattern({ ...pattern, monthDay: parseInt(e.target.value) || 1 })
                }
                className="w-20"
              />
            </div>
          )}

          {/* End Options */}
          <div className="space-y-4">
            <Label>Ends</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="endType"
                  checked={endType === "never"}
                  onChange={() => {
                    setEndType("never");
                    setPattern({ ...pattern, endDate: undefined, occurrences: undefined });
                  }}
                />
                <span>Never</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="endType"
                  checked={endType === "date"}
                  onChange={() => setEndType("date")}
                />
                <span>On</span>
                {endType === "date" && (
                  <Input
                    type="date"
                    value={pattern.endDate || ""}
                    onChange={(e) =>
                      setPattern({ ...pattern, endDate: e.target.value })
                    }
                    className="w-[160px]"
                  />
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="endType"
                  checked={endType === "occurrences"}
                  onChange={() => setEndType("occurrences")}
                />
                <span>After</span>
                {endType === "occurrences" && (
                  <div className="flex items-center gap-2">
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
                      className="w-20"
                    />
                    <span>occurrences</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
