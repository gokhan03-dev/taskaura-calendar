
import { CheckCircle2, Clock, Trash2, Tag, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types/task";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TaskCardProps {
  task: Task & {
    tags?: { id: string; name: string }[];
    subtasks?: { id: string; title: string; completed: boolean }[];
  };
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <div 
      className="bg-white rounded-xl p-4 shadow-glass hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div 
          className="flex-1"
          onClick={onEdit}  
        >
          <h4 className="font-medium text-neutral-900 mb-1">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-neutral-600 mb-2">{task.description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4 text-neutral-500 hover:text-red-500" />
        </Button>
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {task.tags.map(tag => (
            <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
            <div className="flex items-center gap-1">
              <ListChecks className="h-3 w-3" />
              <span>Subtasks</span>
            </div>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-neutral-600">
        <div className="flex items-center gap-2">
          {task.status === 'completed' ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <Clock className="h-4 w-4 text-blue-500" />
          )}
          <span className="capitalize">{task.status}</span>
        </div>
        {task.due_date && (
          <span>{format(new Date(task.due_date), 'MMM dd, HH:mm')}</span>
        )}
      </div>
    </div>
  );
};
