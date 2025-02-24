
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
import { format } from "date-fns";
import { RecurrenceModal, type RecurrencePattern } from "./RecurrenceModal";
import { ReminderModal, type ReminderSettings } from "./ReminderModal";
import { CategoryModal, type Category } from "./CategoryModal";
import { type TagType } from "./TagInput";
import { type Subtask } from "./SubtaskInput";
import { TaskFormFields } from "./task/TaskFormFields";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/lib/types/task";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskToEdit?: Task;
}

export function TaskDialog({ open, onOpenChange, taskToEdit }: TaskDialogProps) {
  const { createTask, updateTask } = useTasks();
  const { toast } = useToast();
  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [category, setCategory] = useState<string | null>(taskToEdit?.category_id || null);
  const [date, setDate] = useState(taskToEdit?.due_date ? format(new Date(taskToEdit.due_date), 'yyyy-MM-dd') : "");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(taskToEdit?.priority || 'medium');
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>();
  const [showReminder, setShowReminder] = useState(false);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>();
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [dependencies, setDependencies] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  // Fetch categories
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
        setCategories(fetchedCategories);
      }
    };

    fetchCategories();
  }, []);

  // Fetch task-specific data when editing
  useEffect(() => {
    const fetchTaskData = async () => {
      if (taskToEdit) {
        // Fetch tags
        const { data: tagData, error: tagError } = await supabase
          .from('task_tags')
          .select(`
            tags (
              id,
              name
            )
          `)
          .eq('task_id', taskToEdit.id);

        if (!tagError && tagData) {
          const formattedTags = tagData
            .map(t => t.tags)
            .filter(Boolean)
            .map(tag => ({
              id: tag.id,
              label: tag.name
            }));
          setTags(formattedTags);
        }

        // Fetch subtasks
        const { data: subtaskData, error: subtaskError } = await supabase
          .from('subtasks')
          .select('*')
          .eq('task_id', taskToEdit.id);

        if (!subtaskError && subtaskData) {
          setSubtasks(subtaskData);
        }
      }
    };

    fetchTaskData();
  }, [taskToEdit]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setTitle(taskToEdit?.title || "");
      setDescription(taskToEdit?.description || "");
      setCategory(taskToEdit?.category_id || null);
      setDate(taskToEdit?.due_date ? format(new Date(taskToEdit.due_date), 'yyyy-MM-dd') : "");
      setPriority(taskToEdit?.priority || 'medium');
    } else {
      setTags([]);
      setSubtasks([]);
    }
  }, [open, taskToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const taskData = {
        title,
        description,
        category_id: category,
        due_date: date || undefined,
        priority,
      };

      let taskId: string;
      
      if (taskToEdit) {
        await updateTask.mutateAsync({
          id: taskToEdit.id,
          ...taskData
        });
        taskId = taskToEdit.id;
      } else {
        const newTask = await createTask.mutateAsync(taskData);
        taskId = newTask.id;
      }

      // Handle tags
      if (tags.length > 0) {
        // First, remove existing tags if editing
        if (taskToEdit) {
          await supabase
            .from('task_tags')
            .delete()
            .eq('task_id', taskId);
        }

        // Insert new tags
        for (const tag of tags) {
          // Create tag if it doesn't exist
          let tagId = tag.id;
          if (!tagId) {
            const { data: newTag, error: tagError } = await supabase
              .from('tags')
              .upsert({ name: tag.label })
              .select()
              .single();

            if (tagError) throw tagError;
            tagId = newTag.id;
          }

          // Link tag to task
          await supabase
            .from('task_tags')
            .upsert({ task_id: taskId, tag_id: tagId });
        }
      }

      // Handle subtasks
      if (subtasks.length > 0) {
        // First, remove existing subtasks if editing
        if (taskToEdit) {
          await supabase
            .from('subtasks')
            .delete()
            .eq('task_id', taskId);
        }

        // Insert new subtasks
        await supabase
          .from('subtasks')
          .insert(subtasks.map(subtask => ({
            task_id: taskId,
            title: subtask.title,
            completed: subtask.completed || false
          })));
      }

      toast({
        title: "Success",
        description: taskToEdit ? "Task updated successfully" : "Task created successfully",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save task. Please try again.",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{taskToEdit ? 'Edit Task' : 'Add New Task'}</DialogTitle>
              <DialogDescription>
                {taskToEdit ? 'Edit your task details.' : 'Create a new task to add to your list.'}
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
              handleAddDependency={(taskId: string) => {
                const taskToAdd = dependencies.find(dep => dep.id === taskId);
                if (taskToAdd) {
                  setDependencies([...dependencies, taskToAdd]);
                }
              }}
              handleRemoveDependency={(taskId: string) => {
                setDependencies(dependencies.filter(dep => dep.id !== taskId));
              }}
              remainingTasks={[]}
              subtasks={subtasks}
              setSubtasks={setSubtasks}
            />

            <DialogFooter>
              <Button type="submit">{taskToEdit ? 'Save Changes' : 'Add Task'}</Button>
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
