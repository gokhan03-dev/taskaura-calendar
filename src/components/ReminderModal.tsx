
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
import { Bell, Mail } from "lucide-react";

export type NotificationType = "in-app" | "email" | "both";

export type ReminderTime = {
  value: number;
  unit: "minutes" | "hours" | "days";
};

export type ReminderSettings = {
  time: ReminderTime;
  notificationType: NotificationType;
  enabled: boolean;
};

const timeOptions = [
  { value: 15, unit: "minutes" as const, label: "15 minutes before" },
  { value: 30, unit: "minutes" as const, label: "30 minutes before" },
  { value: 1, unit: "hours" as const, label: "1 hour before" },
  { value: 2, unit: "hours" as const, label: "2 hours before" },
  { value: 1, unit: "days" as const, label: "1 day before" },
  { value: 2, unit: "days" as const, label: "2 days before" },
];

interface ReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: ReminderSettings) => void;
  initialSettings?: ReminderSettings;
}

export function ReminderModal({
  open,
  onOpenChange,
  onSave,
  initialSettings,
}: ReminderModalProps) {
  const [settings, setSettings] = useState<ReminderSettings>(
    initialSettings || {
      time: { value: 15, unit: "minutes" },
      notificationType: "in-app",
      enabled: true,
    }
  );

  const handleSave = () => {
    onSave(settings);
    onOpenChange(false);
  };

  const getTimeKey = (time: ReminderTime) => 
    `${time.value}-${time.unit}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-card p-4">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4" />
            Reminder Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Reminder Time */}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm text-right">Notify</span>
            <Select
              value={getTimeKey(settings.time)}
              onValueChange={(value) => {
                const [valueStr, unit] = value.split("-");
                setSettings({
                  ...settings,
                  time: {
                    value: parseInt(valueStr),
                    unit: unit as ReminderTime["unit"],
                  },
                });
              }}
            >
              <SelectTrigger className="col-span-3 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {timeOptions.map((option) => (
                    <SelectItem
                      key={getTimeKey(option)}
                      value={getTimeKey(option)}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Notification Method */}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm text-right">Via</span>
            <div className="col-span-3 flex gap-2">
              <Button
                type="button"
                variant={settings.notificationType === "in-app" ? "default" : "outline"}
                size="sm"
                className="flex-1 h-9"
                onClick={() => setSettings({ ...settings, notificationType: "in-app" })}
              >
                <Bell className="h-4 w-4 mr-2" />
                In-app
              </Button>
              <Button
                type="button"
                variant={settings.notificationType === "email" ? "default" : "outline"}
                size="sm"
                className="flex-1 h-9"
                onClick={() => setSettings({ ...settings, notificationType: "email" })}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                type="button"
                variant={settings.notificationType === "both" ? "default" : "outline"}
                size="sm"
                className="flex-1 h-9"
                onClick={() => setSettings({ ...settings, notificationType: "both" })}
              >
                <Bell className="h-4 w-4 mr-2" />
                Both
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
