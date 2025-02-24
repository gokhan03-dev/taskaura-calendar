
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";
import { priorityColors } from "../TaskCard";

interface TaskPrioritySelectProps {
  priority: "high" | "medium" | "low";
  setPriority: (priority: "high" | "medium" | "low") => void;
}

export function TaskPrioritySelect({ priority, setPriority }: TaskPrioritySelectProps) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="priority" className="text-right">
        Priority
      </Label>
      <Select value={priority} onValueChange={setPriority}>
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder="Select priority">
            {priority && (
              <div className="flex items-center gap-2">
                <Star 
                  className="h-4 w-4" 
                  style={{ 
                    color: priorityColors[priority],
                    fill: priorityColors[priority],
                    opacity: priority === "low" ? 0.7 : 1
                  }}
                />
                <span className="capitalize">{priority}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {(Object.keys(priorityColors) as Array<keyof typeof priorityColors>).map((level) => (
              <SelectItem key={level} value={level}>
                <div className="flex items-center gap-2">
                  <Star 
                    className="h-4 w-4" 
                    style={{ 
                      color: priorityColors[level],
                      fill: priorityColors[level],
                      opacity: level === "low" ? 0.7 : 1
                    }}
                  />
                  <span className="capitalize">{level}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
