
import { format } from "date-fns";
import { 
  Repeat, 
  Tag,
  Trash2,
  ListTodo
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/lib/types/task";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
}

export const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { updateTask, deleteTask } = useTasks();
  const { toast } = useToast();
  const isCompleted = task.status === 'completed';
  const [categoryName, setCategoryName] = useState<string>("");
  const [subtasks, setSubtasks] = useState<{ total: number; completed: number }>({ total: 0, completed: 0 });

  useEffect(() => {
    const fetchCategoryName = async () => {
      if (task.category_id) {
        const { data, error } = await supabase
          .from('categories')
          .select('name')
          .eq('id', task.category_id)
          .single();
        
        if (!error && data) {
          setCategoryName(data.name);
        }
      }
    };

    const fetchSubtasks = async () => {
      const { data, error } = await supabase
        .from('subtasks')
        .select('completed')
        .eq('task_id', task.id);

      if (!error && data) {
        const total = data.length;
        const completed = data.filter(st => st.completed).length;
        setSubtasks({ total, completed });
      }
    };

    fetchCategoryName();
    fetchSubtasks();
  }, [task.category_id, task.id]);

  const handleToggleCompletion = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateTask.mutateAsync({
        id: task.id,
        status: isCompleted ? 'pending' : 'completed',
        completed_at: isCompleted ? null : new Date().toISOString(),
      });
      toast({
        title: isCompleted ? "Task marked as pending" : "Task completed",
        description: task.title,
      });
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast({
        variant: "destructive",
        title: "Failed to update task",
        description: "Please try again later",
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteTask.mutateAsync(task.id);
      toast({
        title: "Task deleted",
        description: task.title,
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete task",
        description: "Please try again later",
      });
    }
  };

  return (
    <div 
      className="bg-white rounded-xl p-4 shadow-glass hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onEdit}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={isCompleted}
          className="mt-1"
          onClick={handleToggleCompletion}
        />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h4 className={`font-medium ${isCompleted ? 'line-through text-neutral-400' : ''}`}>
                {task.title}
              </h4>
              {task.description && (
                <p className={`text-sm text-neutral-500 mt-1 ${isCompleted ? 'line-through' : ''}`}>
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {subtasks.total > 0 && (
                <span className="flex items-center gap-1 text-sm text-neutral-500">
                  <ListTodo className="h-4 w-4" />
                  {subtasks.completed}/{subtasks.total}
                </span>
              )}
              {task.recurrence_pattern && (
                <Repeat className="h-4 w-4 text-neutral-400" />
              )}
              {task.due_date && (
                <span className="text-sm text-neutral-500 whitespace-nowrap">
                  {format(new Date(task.due_date), 'MMM dd')}
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 text-neutral-500 hover:text-red-500" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {task.priority && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                task.priority === 'high' ? 'bg-red-100 text-red-700' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            )}
            {categoryName && (
              <span className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-neutral-100 text-neutral-600">
                <Tag className="h-3 w-3" />
                {categoryName}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
