
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
import { CategoryModal, type Category } from "./CategoryModal";
import { type TagType } from "./TagInput";
import { type Subtask } from "./SubtaskInput";
import { TaskFormFields } from "./task/TaskFormFields";
import { useTasks } from "@/hooks/use-tasks";
import { useToast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  title: string;
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableTasks?: Task[];
}

export function TaskDialog({ open, onOpenChange, availableTasks = [] }: TaskDialogProps) {
  const { createTask } = useTasks();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("work");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>();
  const [showReminder, setShowReminder] = useState(false);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>();
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    { id: "work", name: "Work", color: "#0EA5E9" },
    { id: "personal", name: "Personal", color: "#8B5CF6" },
  ]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [dependencies, setDependencies] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  const handleAddDependency = (taskId: string) => {
    const taskToAdd = availableTasks.find(task => task.id === taskId);
    if (taskToAdd && !dependencies.some(dep => dep.id === taskId)) {
      setDependencies([...dependencies, taskToAdd]);
    }
  };

  const handleRemoveDependency = (taskId: string) => {
    setDependencies(dependencies.filter(dep => dep.id !== taskId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createTask.mutateAsync({
        title,
        description,
        due_date: date,
        category_id: category,
        priority,
        tags,
        subtasks,
        dependencies: dependencies.map(dep => dep.id),
      });
      
      onOpenChange(false);
      
      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setCategory("work");
      setPriority("medium");
      setTags([]);
      setDependencies([]);
      setSubtasks([]);
      
    } catch (error) {
      console.error('Failed to create task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const remainingTasks = availableTasks.filter(task => !dependencies.some(dep => dep.id === task.id));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task to add to your list.
              </DialogDescription>
            </DialogHeader>
            
            <TaskFormFields
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              category={category}
              setCategory={setCategory}
              date={date}
              setDate={setDate}
              priority={priority}
              setPriority={setPriority}
              categories={categories}
              setShowCategories={setShowCategories}
              recurrencePattern={recurrencePattern}
              setShowRecurrence={setShowRecurrence}
              reminderSettings={reminderSettings}
              setShowReminder={setShowReminder}
              tags={tags}
              setTags={setTags}
              dependencies={dependencies}
              handleAddDependency={handleAddDependency}
              handleRemoveDependency={handleRemoveDependency}
              remainingTasks={remainingTasks}
              subtasks={subtasks}
              setSubtasks={setSubtasks}
            />

            <DialogFooter>
              <Button type="submit" disabled={createTask.isPending}>
                {createTask.isPending ? "Creating..." : "Add Task"}
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

      <CategoryModal
        open={showCategories}
        onOpenChange={setShowCategories}
        categories={categories}
        onSave={setCategories}
      />
    </>
  );
}
