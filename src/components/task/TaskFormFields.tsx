
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarPlus, Link2, X, Plus } from "lucide-react";
import { TagInput, type TagType } from "@/components/TagInput";
import { SubtaskInput, type Subtask } from "@/components/SubtaskInput";
import { Category } from "@/components/CategoryModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string | null) => void;
  date: string;
  setDate: (date: string) => void;
  categories: Category[];
  setShowCategories: (show: boolean) => void;
  recurrencePattern?: any;
  setShowRecurrence: (show: boolean) => void;
  reminderSettings?: any;
  setShowReminder: (show: boolean) => void;
  tags: TagType[];
  setTags: (tags: TagType[]) => void;
  dependencies: Array<{ id: string; title: string }>;
  handleAddDependency: (taskId: string) => void;
  handleRemoveDependency: (taskId: string) => void;
  remainingTasks: Array<{ id: string; title: string }>;
  subtasks: Subtask[];
  setSubtasks: (subtasks: Subtask[]) => void;
}

export function TaskFormFields({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  date,
  setDate,
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
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(format(selectedDate, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={category || undefined}
          onValueChange={(value) => setCategory(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </div>
              </SelectItem>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setShowCategories(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              {date ? format(new Date(date), "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              onSelect={handleDateSelect}
              selected={date ? new Date(date) : undefined}
              initialFocus
            />
          </PopoverContent>
        </Popover>
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
