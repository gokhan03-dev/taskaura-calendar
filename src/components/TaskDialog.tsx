
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { RecurrenceModal, type RecurrencePattern } from "./RecurrenceModal";
import { ReminderModal, type ReminderSettings } from "./ReminderModal";
import { CategoryModal, type Category } from "./CategoryModal";
import { type TagType } from "./TagInput";
import { type Subtask } from "./SubtaskInput";
import { TaskFormFields } from "./task/TaskFormFields";
import { useTasks } from "@/hooks/useTasks";
import { supabase } from "@/integrations/supabase/client";

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>();
  const [showReminder, setShowReminder] = useState(false);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>();
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [dependencies, setDependencies] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      const { data: fetchedCategories, error } = await supabase
        .from('categories')
        .select('*');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      if (fetchedCategories) {
        setCategories(fetchedCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          color: cat.color
        })));
        // Only set default category if none is selected and it's the initial load
        if (category === null && fetchedCategories.length > 0) {
          setCategory(fetchedCategories[0].id);
        }
      }
    };

    fetchCategories();
  }, []); // Remove category dependency to avoid circular updates

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
      const taskData = {
        title,
        description: description || null,
        category_id: category || undefined,
        due_date: date || undefined,
      };

      console.log('Creating task with data:', taskData); // Debug log
      
      await createTask.mutateAsync(taskData);
      
      // Reset form
      setTitle("");
      setDescription("");
      setCategory(null);
      setDate("");
      setRecurrencePattern(undefined);
      setReminderSettings(undefined);
      setTags([]);
      setDependencies([]);
      setSubtasks([]);
      
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create task:', error);
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
              category={category || ''}
              setCategory={setCategory}
              date={date}
              setDate={setDate}
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
              <Button type="submit">Add Task</Button>
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
