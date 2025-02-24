
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>();
  const [showReminder, setShowReminder] = useState(false);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>();
  const [showCategories, setShowCategories] = useState(false);
  const [tags, setTags] = useState<TagType[]>([]);
  const [dependencies, setDependencies] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  // Fetch categories from the database
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      return data.map(cat => ({
        id: cat.id,
        name: cat.name,
        color: cat.color
      }));
    },
  });

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
      // First create the tags if they don't exist
      const tagsToCreate = tags.filter(tag => !tag.id.includes('-')); // Filter out existing tags (which should have UUIDs)
      const createdTags = [];
      
      if (tagsToCreate.length > 0) {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) throw new Error("No user session found");

        for (const tag of tagsToCreate) {
          const { data: newTag, error } = await supabase
            .from('tags')
            .insert({
              name: tag.label,
              user_id: session.session.user.id
            })
            .select()
            .single();

          if (error) throw error;
          createdTags.push({ id: newTag.id, label: newTag.name });
        }
      }

      // Combine existing tags (with valid UUIDs) and newly created tags
      const finalTags = [
        ...tags.filter(tag => tag.id.includes('-')),
        ...createdTags
      ];

      await createTask.mutateAsync({
        title,
        description,
        due_date: date,
        category_id: category,
        priority,
        tags: finalTags,
        subtasks,
        dependencies: dependencies.map(dep => dep.id),
      });
      
      onOpenChange(false);
      
      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setCategory("");
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
        onSave={() => {
          queryClient.invalidateQueries({ queryKey: ['categories'] });
        }}
      />
    </>
  );
}
