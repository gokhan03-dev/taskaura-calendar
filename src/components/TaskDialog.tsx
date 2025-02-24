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

export function TaskDialog({ open, onOpenChange, taskToEdit }: TaskDialogProps & { taskToEdit?: Task }) {
  const { createTask, updateTask } = useTasks();
  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [category, setCategory] = useState<string | null>(taskToEdit?.category_id || null);
  const [date, setDate] = useState(taskToEdit?.due_date ? format(new Date(taskToEdit.due_date), 'yyyy-MM-dd') : "");
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>();
  const [showReminder, setShowReminder] = useState(false);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>();
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [dependencies, setDependencies] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

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
        if (!category && fetchedCategories.length > 0) {
          setCategory(fetchedCategories[0].id);
        }
      }
    };

    fetchCategories();
  }, [category]);

  const handleAddDependency = (taskId: string) => {
    const taskToAdd = availableTasks.find(task => task.id === taskId);
    if (taskToAdd && !dependencies.some(dep => dep.id === taskId)) {
      setDependencies([...dependencies, taskToAdd]);
    }
  };

  const handleRemoveDependency = (taskId: string) => {
    setDependencies(dependencies.filter(dep => dep.id !== taskId));
  };

  useEffect(() => {
    if (open) {
      setTitle(taskToEdit?.title || "");
      setDescription(taskToEdit?.description || "");
      setCategory(taskToEdit?.category_id || null);
      setDate(taskToEdit?.due_date ? format(new Date(taskToEdit.due_date), 'yyyy-MM-dd') : "");
    }
  }, [open, taskToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (taskToEdit) {
        await updateTask.mutateAsync({
          id: taskToEdit.id,
          title,
          description,
          category_id: category,
          due_date: date || undefined,
        });
      } else {
        await createTask.mutateAsync({
          title,
          description,
          category_id: category,
          due_date: date || undefined,
        });
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save task:', error);
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
