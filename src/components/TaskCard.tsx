
import { format } from "date-fns";
import { 
  X, 
  Tag, 
  List, 
  Repeat, 
  Users,
  Trash2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/lib/types/task";
import { useTasks } from "@/hooks/useTasks";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
}

export const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { updateTask, deleteTask } = useTasks();
  const isCompleted = task.status === 'completed';

  const handleToggleCompletion = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateTask.mutateAsync({
        id: task.id,
        status: isCompleted ? 'pending' : 'completed',
        completed_at: isCompleted ? null : new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteTask.mutateAsync(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
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
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`font-medium ${isCompleted ? 'line-through text-neutral-400' : ''}`}>
              {task.title}
            </h4>
            <div className="flex items-center gap-2">
              {task.recurrence_pattern && (
                <Repeat className="h-4 w-4 text-neutral-400" />
              )}
              <span className="text-sm text-neutral-500">
                {task.due_date && format(new Date(task.due_date), 'MMM dd')}
              </span>
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
          <p className={`text-sm text-neutral-500 mb-3 ${isCompleted ? 'line-through' : ''}`}>
            {task.description}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {task.category_id && (
              <span className="px-2 py-1 text-xs rounded-md bg-neutral-100">
                {task.category_id}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
