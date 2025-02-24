
import { BasicTaskInfo } from "./BasicTaskInfo";
import { TaskPrioritySelect } from "./TaskPrioritySelect";
import { TaskDateSelect } from "./TaskDateSelect";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/TagInput";
import { SubtaskInput } from "@/components/SubtaskInput";
import { type TagType } from "@/components/TagInput";
import { type Subtask } from "@/components/SubtaskInput";
import { Settings } from "lucide-react";

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
  categories: Array<{ id: string; name: string; color: string }>;
  setShowCategories: (show: boolean) => void;
  recurrencePattern?: { frequency: string; interval: number };
  setShowRecurrence: (show: boolean) => void;
  reminderSettings?: { type: string; time: string };
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
      <BasicTaskInfo
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      />
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category
        </Label>
        <div className="col-span-3 flex items-center gap-2">
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => setShowCategories(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <TaskPrioritySelect priority={priority} setPriority={setPriority} />
      
      <TaskDateSelect
        date={date}
        setDate={setDate}
        setShowReminder={setShowReminder}
        setShowRecurrence={setShowRecurrence}
      />

      <TagInput 
        value={tags} 
        onChange={setTags}
      />
      
      <SubtaskInput
        value={subtasks}
        onChange={setSubtasks}
      />
    </div>
  );
}
