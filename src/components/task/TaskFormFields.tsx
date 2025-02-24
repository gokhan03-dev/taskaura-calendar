
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Plus, RepeatIcon, Settings2, Link2, X, Flag } from "lucide-react";
import { TagInput, TagType } from "../TagInput";
import { SubtaskInput, type Subtask } from "../SubtaskInput";
import { Category } from "../CategoryModal";
import { type RecurrencePattern } from "../RecurrenceModal";
import { type ReminderSettings } from "../ReminderModal";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
}

interface TaskFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string) => void;
  date: string;
  setDate: (date: string) => void;
  priority: "high" | "medium" | "low";
  setPriority: (priority: "high" | "medium" | "low") => void;
  categories: Category[];
  setShowCategories: (show: boolean) => void;
  recurrencePattern?: RecurrencePattern;
  setShowRecurrence: (show: boolean) => void;
  reminderSettings?: ReminderSettings;
  setShowReminder: (show: boolean) => void;
  tags: TagType[];
  setTags: (tags: TagType[]) => void;
  dependencies: Task[];
  handleAddDependency: (taskId: string) => void;
  handleRemoveDependency: (taskId: string) => void;
  remainingTasks: Task[];
  subtasks: Subtask[];
  setSubtasks: (subtasks: Subtask[]) => void;
}

const priorityColors = {
  high: "#F97316",
  medium: "#FEC6A1",
  low: "#8E9196"
} as const;

export function TaskFormFields({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  date,
  setDate,
  priority,
  setPriority,
  categories,
  setShowCategories,
  recurrencePattern,
  setShowRecurrence,
  reminderSettings,
  setShowReminder,
  tags,
  setTags,
  dependencies,
  handleAddDependency,
  handleRemoveDependency,
  remainingTasks,
  subtasks,
  setSubtasks,
}: TaskFormFieldsProps) {
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
          placeholder="Task description..."
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="priority" className="text-right">
          Priority
        </Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="col-span-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(priorityColors).map(([level, color]) => (
                <SelectItem key={level} value={level}>
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4" style={{ color }} />
                    <span className="capitalize">{level}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category
        </Label>
        <div className="col-span-3 flex gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowCategories(true)}
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">
          Due Date
        </Label>
        <div className="col-span-3 flex gap-2">
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1"
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
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="tags" className="text-right pt-2.5">
          Tags
        </Label>
        <div className="col-span-3">
          <TagInput
            value={tags}
            onChange={setTags}
            maxTags={5}
          />
        </div>
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right">Related</Label>
        <div className="col-span-3">
          <div className="space-y-2">
            <Select onValueChange={handleAddDependency}>
              <SelectTrigger className="w-full border-dashed">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add related task</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {remainingTasks.map(task => (
                    <SelectItem key={task.id} value={task.id}>
                      <div className="flex items-center gap-2">
                        <Link2 className="h-3.5 w-3.5 text-neutral-400" />
                        {task.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <div className="space-y-1.5">
              {dependencies.map(dep => (
                <div
                  key={dep.id}
                  className="group relative flex items-center gap-2 py-1.5 px-2.5 pr-8 rounded-md bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-colors"
                >
                  <Link2 className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="text-sm font-medium text-neutral-700">{dep.title}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDependency(dep.id)}
                    className="absolute right-1.5 opacity-0 group-hover:opacity-100 h-5 w-5 p-0 hover:bg-neutral-200"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove dependency</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right">Subtasks</Label>
        <div className="col-span-3">
          <SubtaskInput
            subtasks={subtasks}
            onChange={setSubtasks}
          />
        </div>
      </div>
    </div>
  );
}

